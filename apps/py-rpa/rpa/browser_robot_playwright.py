"""Playwright を利用したブラウザ操作モジュール。"""

from __future__ import annotations

import atexit
import contextlib
import time
from enum import Enum
from typing import Self, TypedDict

from playwright.sync_api import (  # type: ignore[import-untyped]
  Browser,
  BrowserContext,
  Locator,
  Page,
  Playwright,
  sync_playwright,
)
from playwright.sync_api import (
  Error as PlaywrightError,
)

DEFAULT_DELAY_TIME_SEC = 0.5


class BrowserType(Enum):
  """ブラウザタイプ"""

  Edge = "msedge"
  Chrome = "chrome"
  Safari = "webkit"
  FireFox = "firefox"


class _LaunchOptions(TypedDict, total=False):
  headless: bool


class PlaywrightBrowserRobot:
  """Playwright を利用したブラウザ自動化クラス。"""

  def __init__(
    self,
    *,
    browser_type: BrowserType = BrowserType.Chrome,
    headless: bool = False,
    delay_time_sec: float = DEFAULT_DELAY_TIME_SEC,
  ) -> None:
    self.delay_time_sec = delay_time_sec
    self._browser_type = browser_type
    self._headless = headless
    self._playwright: Playwright | None = None
    self._browser: Browser | None = None
    self._context: BrowserContext | None = None
    self._page: Page | None = None
    self._launched_browser_type: BrowserType | None = None
    atexit.register(self.close)

  # ------------------------------------------------------------------
  # パブリックAPI
  # ------------------------------------------------------------------
  def set_browser_type(self, browser_type: BrowserType) -> None:
    """使用するブラウザタイプを切り替える。"""
    if self._browser_type == browser_type:
      return
    self._browser_type = browser_type
    self._close_browser_only()

  def open_browser(self, url: str, x: int | None = None, y: int | None = None) -> None:
    """指定したURLを開く。"""
    page = self._ensure_page()
    page.goto(url, wait_until="load")
    if x is not None and y is not None:
      self.set_window_size(x, y)
    self._wait_after_action(page)

  def set_window_size(self, x: int, y: int) -> None:
    """ウィンドウサイズを指定する。"""
    page = self._ensure_page()
    page.set_viewport_size({"width": x, "height": y})
    self._wait_after_action(page)

  def get_window_size(self) -> tuple[int, int]:
    """ウィンドウサイズを取得する。"""
    page = self._ensure_page()
    viewport = page.viewport_size
    if viewport is None:
      message = "ビューポートサイズを取得できませんでした。"
      raise RuntimeError(message)
    return viewport["width"], viewport["height"]

  def get_current_window_handle(self) -> str:
    """現在のウィンドウハンドルを取得する。"""
    page = self._ensure_page()
    return f"page-{id(page)}"

  def close_browser(self) -> None:
    """ブラウザと Playwright を終了する。"""
    self._close_if_needed()

  def get_current_url(self) -> str:
    """現在のURLを取得する。"""
    page = self._ensure_page()
    return page.url

  def input(self, attr_id: str, value: str) -> None:
    """指定したHTML要素に文字列を入力する。"""
    page = self._ensure_page()
    try:
      locator = page.locator(f"#{attr_id}")
      self._fill_or_select(locator, value)
      self._wait_after_action(page)
    except PlaywrightError as error:
      print(error)

  def input_date(self, attr_id: str, value: str) -> None:
    """日付入力用フィールドに値を入力する。"""
    page = self._ensure_page()
    try:
      locator = page.locator(f"#{attr_id}")
      locator.fill("")
      locator.fill(value)
      self._wait_after_action(page)
    except PlaywrightError as error:
      print(error)

  def click_browser(self, attr_id: str) -> None:
    """指定したHTML要素をクリックする。"""
    page = self._ensure_page()
    try:
      page.locator(f"#{attr_id}").click()
      self._wait_after_action(page)
    except PlaywrightError as error:
      print(error)

  def get_value_browser(self, attr_id: str) -> str | None:
    """指定したHTML要素の値を取得する。"""
    page = self._ensure_page()
    try:
      locator = page.locator(f"#{attr_id}")
      tag_name = locator.evaluate("el => el.tagName.toLowerCase()")
      if tag_name in {"input", "textarea"}:
        return locator.input_value()
      if tag_name == "select":
        option = locator.locator("option:checked").first
        option_text = option.text_content()
        if option_text:
          return option_text
        return locator.input_value()
      return locator.text_content()
    except PlaywrightError as error:
      print(error)
      return None

  def get_current_scroll_position(self) -> tuple[int, int]:
    """現在のスクロール位置を取得する。"""
    page = self._ensure_page()
    scroll_y = page.evaluate("() => window.pageYOffset")
    scroll_x = page.evaluate("() => window.pageXOffset")
    return int(scroll_x), int(scroll_y)

  def scroll_x(self, delta_x: int) -> None:
    """水平スクロール"""
    page = self._ensure_page()
    current_x, current_y = self.get_current_scroll_position()
    page.evaluate(
      "([targetX, targetY]) => window.scrollTo(targetX, targetY)",
      [delta_x + current_x, current_y],
    )

  def scroll_y(self, delta_y: int) -> None:
    """垂直スクロール"""
    page = self._ensure_page()
    current_x, current_y = self.get_current_scroll_position()
    page.evaluate(
      "([targetX, targetY]) => window.scrollTo(targetX, targetY)",
      [current_x, delta_y + current_y],
    )

  def close(self) -> None:
    """リソースを解放する。"""
    self._close_if_needed()

  def __enter__(self) -> Self:
    """コンテキストマネージャー開始時に自身を返す。"""
    return self

  def __exit__(self, exc_type, exc, tb) -> None:  # noqa: ANN001
    """コンテキストマネージャー終了時に後始末を行う。"""
    self.close()

  # ------------------------------------------------------------------
  # 内部ユーティリティ
  # ------------------------------------------------------------------
  def _ensure_page(self) -> Page:
    if self._browser is None or self._launched_browser_type != self._browser_type:
      self._close_browser_only()
      self._browser = self._launch_browser()
      self._launched_browser_type = self._browser_type

    if self._context is None or getattr(self._context, "is_closed", lambda: True)():
      self._context = self._browser.new_context()

    if self._page is None or self._page.is_closed():
      self._page = self._context.new_page()

    return self._page

  def _start_playwright(self) -> Playwright:
    if self._playwright is None:
      self._playwright = sync_playwright().start()
    return self._playwright

  def _launch_browser(self) -> Browser:
    playwright = self._start_playwright()
    launch_kwargs: _LaunchOptions = {"headless": self._headless}

    if self._browser_type in {BrowserType.Edge, BrowserType.Chrome}:
      return self._launch_chromium(playwright, launch_kwargs=launch_kwargs)
    if self._browser_type is BrowserType.Safari:
      return playwright.webkit.launch(**launch_kwargs)
    if self._browser_type is BrowserType.FireFox:
      return playwright.firefox.launch(**launch_kwargs)
    unsupported_msg = f"未対応のブラウザタイプです: {self._browser_type}"
    raise ValueError(unsupported_msg)

  def _launch_chromium(
    self,
    playwright: Playwright,
    *,
    launch_kwargs: _LaunchOptions,
  ) -> Browser:
    channel = self._browser_type.value
    if isinstance(channel, str):
      with contextlib.suppress(PlaywrightError):
        return playwright.chromium.launch(channel=channel, **launch_kwargs)
    return playwright.chromium.launch(**launch_kwargs)

  def _wait_after_action(self, page: Page | None = None) -> None:
    if page is not None and not page.is_closed():
      page.wait_for_timeout(self.delay_time_sec * 1000)
      return
    time.sleep(self.delay_time_sec)

  def _close_browser_only(self) -> None:
    with contextlib.suppress(Exception):
      if self._page is not None and not self._page.is_closed():
        self._page.close()

    with contextlib.suppress(Exception):
      context = self._context
      is_context_open = getattr(context, "is_closed", lambda: False)
      if context is not None and is_context_open() is False:
        context.close()

    with contextlib.suppress(Exception):
      if self._browser is not None:
        self._browser.close()

    self._page = None
    self._context = None
    self._browser = None

  def _close_if_needed(self) -> None:
    self._close_browser_only()

    with contextlib.suppress(Exception):
      if self._playwright is not None:
        self._playwright.stop()

    self._playwright = None
    self._launched_browser_type = None

  def _fill_or_select(self, locator: Locator, value: str) -> None:
    tag_name = locator.evaluate("el => el.tagName.toLowerCase()")
    if tag_name == "select":
      self._select_option(locator, value)
      return
    locator.fill(value)

  def _select_option(self, locator: Locator, value: str) -> None:
    try:
      locator.select_option(label=value)
    except PlaywrightError:
      locator.select_option(value=value)


__all__ = [
  "DEFAULT_DELAY_TIME_SEC",
  "BrowserType",
  "PlaywrightBrowserRobot",
]
