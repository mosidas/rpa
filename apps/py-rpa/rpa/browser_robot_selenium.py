"""Selenium を利用したブラウザ操作モジュール。"""

from __future__ import annotations

import atexit
import time
from enum import Enum
from typing import TYPE_CHECKING, Any, Self

from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select

if TYPE_CHECKING:
  from selenium.webdriver.remote.webdriver import WebDriver

DEFAULT_DELAY_TIME_SEC = 0.5


class BrowserType(Enum):
  """ブラウザタイプ"""

  Edge = "edge"
  Chrome = "chrome"
  Safari = "safari"
  FireFox = "firefox"


class SeleniumBrowserRobot:
  """Selenium を利用したブラウザ自動化クラス。"""

  def __init__(
    self,
    *,
    browser_type: BrowserType = BrowserType.Edge,
    delay_time_sec: float = DEFAULT_DELAY_TIME_SEC,
    driver_kwargs: dict[str, Any] | None = None,
  ) -> None:
    self.delay_time_sec = delay_time_sec
    self._browser_type = browser_type
    self._driver_kwargs = driver_kwargs or {}
    self._driver: WebDriver | None = None
    atexit.register(self.close)

  # ------------------------------------------------------------------
  # パブリックAPI
  # ------------------------------------------------------------------
  def set_browser_type(self, browser_type: BrowserType) -> None:
    """使用するブラウザタイプを切り替える。"""
    if self._browser_type == browser_type:
      return
    self._browser_type = browser_type
    self._close_driver()

  def open_browser(self, url: str, x: int | None = None, y: int | None = None) -> None:
    """指定したURLを開く。"""
    driver = self._ensure_driver()
    driver.get(url)
    if x is not None and y is not None:
      self.set_window_size(x, y)
    self._wait_after_action()

  def set_window_size(self, x: int, y: int) -> None:
    """ウィンドウサイズを指定値に設定する。"""
    driver = self._ensure_driver()
    driver.set_window_size(x, y)
    self._wait_after_action()

  def get_window_size(self) -> tuple[int, int]:
    """現在のウィンドウサイズを (幅, 高さ) で返す。"""
    driver = self._ensure_driver()
    size = driver.get_window_size()
    return size["width"], size["height"]

  def get_current_window_handle(self) -> str:
    """アクティブなウィンドウハンドルを取得する。"""
    driver = self._ensure_driver()
    return driver.current_window_handle

  def open_new_tab(self, url: str) -> None:
    """新しいタブで指定したURLを開く。"""
    driver = self._ensure_driver()
    driver.execute_script("window.open('');")
    driver.switch_to.window(driver.window_handles[-1])
    driver.get(url)
    self._wait_after_action()

  def switch_tab(self, index: int) -> None:
    """指定したインデックスのタブへ切り替える。"""
    driver = self._ensure_driver()
    handles = driver.window_handles
    if index < 0 or index >= len(handles):
      message = f"指定したインデックスのタブは存在しません: {index}"
      raise IndexError(message)
    driver.switch_to.window(handles[index])
    self._wait_after_action()

  def close_tab(self) -> None:
    """現在のタブを閉じて、前のタブへ切り替える。"""
    driver = self._ensure_driver()
    handles = driver.window_handles
    if len(handles) <= 1:
      message = "タブが1つしかないため、閉じることができません。"
      raise RuntimeError(message)
    current_handle = driver.current_window_handle
    driver.close()
    for i, handle in enumerate(handles):
      if handle == current_handle:
        new_index = max(0, i - 1)
        driver.switch_to.window(handles[new_index])
        break
    self._wait_after_action()

  def close_browser(self) -> None:
    """ブラウザを閉じてドライバを破棄する。"""
    self._close_driver()

  def get_current_url(self) -> str:
    """現在表示している URL を返す。"""
    driver = self._ensure_driver()
    return driver.current_url

  def input(self, attr_id: str, value: str) -> None:
    """ID 指定した要素へ文字列または選択値を入力する。"""
    driver = self._ensure_driver()
    try:
      element = driver.find_element(By.ID, attr_id)
      self._fill_or_select(element, value)
      self._wait_after_action()
    except NoSuchElementException as error:
      print(error.msg)

  def input_date(self, attr_id: str, value: str) -> None:
    """ID 指定した日付入力要素へ文字列を入力する。"""
    driver = self._ensure_driver()
    try:
      element = driver.find_element(By.ID, attr_id)
      element.clear()
      element.send_keys(value)
      self._wait_after_action()
    except NoSuchElementException as error:
      print(error.msg)

  def click(self, attr_id: str) -> None:
    """ID 指定した要素をクリックする。"""
    driver = self._ensure_driver()
    try:
      driver.find_element(By.ID, attr_id).click()
      self._wait_after_action()
    except NoSuchElementException as error:
      print(error.msg)

  def get_value(self, attr_id: str) -> str | None:
    """ID 指定した要素の表示値または入力値を取得する。"""
    driver = self._ensure_driver()
    try:
      element = driver.find_element(By.ID, attr_id)
      tag_name = element.tag_name.lower()
      if tag_name in {"input", "textarea"}:
        return element.get_attribute("value")
      if tag_name == "select":
        selected = Select(element).first_selected_option
        return selected.text
      return element.text
    except NoSuchElementException as error:
      print(error.msg)
      return None

  def get_current_scroll_position(self) -> tuple[int, int]:
    """現在のスクロール位置を (X, Y) で返す。"""
    driver = self._ensure_driver()
    scroll_y = driver.execute_script("return window.pageYOffset;")
    scroll_x = driver.execute_script("return window.pageXOffset;")
    return int(scroll_x), int(scroll_y)

  def scroll_x(self, delta_x: int) -> None:
    """指定量だけ水平方向にスクロールする。"""
    driver = self._ensure_driver()
    current_x, current_y = self.get_current_scroll_position()
    driver.execute_script(
      "window.scrollTo(arguments[0], arguments[1]);",
      delta_x + current_x,
      current_y,
    )

  def scroll_y(self, delta_y: int) -> None:
    """指定量だけ垂直方向にスクロールする。"""
    driver = self._ensure_driver()
    current_x, current_y = self.get_current_scroll_position()
    driver.execute_script(
      "window.scrollTo(arguments[0], arguments[1]);",
      current_x,
      delta_y + current_y,
    )

  def close(self) -> None:
    """保持しているドライバを明示的に解放する。"""
    self._close_driver()

  def __enter__(self) -> Self:
    """コンテキストマネージャー開始時に自身を返す。"""
    return self

  def __exit__(self, exc_type, exc, tb) -> None:  # noqa: ANN001
    """コンテキストマネージャー終了時に後始末を行う。"""
    self.close()

  # ------------------------------------------------------------------
  # 内部ユーティリティ
  # ------------------------------------------------------------------
  def _ensure_driver(self) -> WebDriver:
    """WebDriver を遅延生成しつつ取得する。"""
    if self._driver is None:
      self._driver = self._create_driver()
    return self._driver

  def _create_driver(self) -> WebDriver:
    """ブラウザタイプに応じて WebDriver を生成する。"""
    if self._browser_type is BrowserType.Edge:
      return webdriver.Edge(**self._driver_kwargs)
    if self._browser_type is BrowserType.Chrome:
      return webdriver.Chrome(**self._driver_kwargs)
    if self._browser_type is BrowserType.FireFox:
      return webdriver.Firefox(**self._driver_kwargs)
    if self._browser_type is BrowserType.Safari:
      return webdriver.Safari(**self._driver_kwargs)
    message = f"未対応のブラウザタイプです: {self._browser_type}"
    raise ValueError(message)

  def _fill_or_select(self, element, value: str) -> None:  # noqa: ANN001
    """要素のタイプに応じて入力または選択操作を行う。"""
    tag_name = element.tag_name.lower()
    if tag_name == "select":
      select = Select(element)
      try:
        select.select_by_visible_text(value)
      except Exception:  # noqa: BLE001
        select.select_by_value(value)
      return
    element.clear()
    element.send_keys(value)

  def _close_driver(self) -> None:
    """WebDriver が存在する場合に終了処理を行う。"""
    if self._driver is None:
      return
    try:
      self._driver.quit()
    except Exception:  # noqa: BLE001
      print("WebDriver quit error.")
    finally:
      self._driver = None

  def _wait_after_action(self) -> None:
    """操作後の待機時間を設ける。"""
    time.sleep(self.delay_time_sec)


__all__ = [
  "DEFAULT_DELAY_TIME_SEC",
  "BrowserType",
  "SeleniumBrowserRobot",
]
