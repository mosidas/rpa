"""RPA のコアモジュール

pyautogui, pyperclip, pywinctlのラッパー
"""

import datetime
import shutil
import subprocess
import time
from enum import Enum
from pathlib import Path
from typing import NamedTuple

import pyautogui
import pyperclip
import pywinctl

is_smooth = True


class ButtonType(Enum):
  """ボタンタイプ"""

  Left: str = "left"
  Right: str = "right"
  Middle: str = "middle"


class WindowType(NamedTuple):
  """ウィンドウサイズ情報"""

  x: int
  y: int
  width: int
  height: int


def start_app(app_path: str) -> None:
  """指定したアプリを起動する。"""
  path = Path(app_path).expanduser().resolve()

  if not str(path).endswith(".app"):
    msg = "アプリのパスは .app を指定してください"
    raise ValueError(msg)

  if not path.exists():
    msg = f"指定したパスが存在しません: {path}"
    raise FileNotFoundError(msg)

  open_cmd = shutil.which("open")
  if open_cmd is None:
    msg = "macOS の open コマンドが見つかりません"
    raise RuntimeError(msg)

  subprocess.run([open_cmd, str(path)], check=True)


def wait_for_window(app_name: str, timeout: int = 30) -> bool:
  """指定アプリのウィンドウが出るまで待機する。"""
  script = f"""
    tell application "System Events"
        count (windows of process "{app_name}")
    end tell
    """
  for _ in range(timeout):
    result = subprocess.run(
      ["osascript", "-e", script],
      check=False,
      capture_output=True,
      text=True,
    )
    try:
      count = int(result.stdout.strip())
      if count > 0:
        return True
    except ValueError:
      pass
    time.sleep(1)
  return False


def get_active_window_title() -> str:
  """アクティブウィンドウのタイトルを取得する"""
  return pywinctl.getActiveWindow().title


def active_window(app_name: str) -> None:
  """指定したアプリのウィンドウをアクティブ化する。"""
  windows = pywinctl.getAllWindows()
  if len(windows) == 0:
    return

  for window in windows:
    if window.getAppName() == app_name:
      window.moveTo(0, 0)
      window.activate()
      return


def resize_window(app_name: str, width: int, height: int) -> None:
  """指定したアプリのウィンドウをリサイズする。"""
  windows = pywinctl.getAllWindows()
  if len(windows) == 0:
    return

  for window in windows:
    if window.getAppName() == app_name:
      window.resizeTo(width, height)
      return


def get_window_size(app_name: str) -> WindowType | None:
  """指定したアプリのウィンドウサイズを取得する。"""
  windows = pywinctl.getAllWindows()
  if len(windows) == 0:
    return None

  for window in windows:
    if window.getAppName() == app_name:
      x = window.topleft.x
      y = window.topleft.y
      w = window.width
      h = window.height
      return WindowType(x=x, y=y, width=w, height=h)

  return None


def get_display_size() -> tuple[int, int]:
  """ディスプレイサイズを取得する。"""
  return pyautogui.size()


def get_current_location() -> tuple[int, int]:
  """現在のマウスカーソルの位置を取得する。"""
  x, y = pyautogui.position()
  return x, y


def get_clipboard() -> str:
  """クリップボードの内容を取得する。"""
  return pyperclip.paste()


def set_clipboard(s: str) -> None:
  """文字列をクリップボードに設定する。"""
  pyperclip.copy(s)


def save_screenshot(
  window_name: str | None,
  file_path: str | None = None,
) -> None:
  """指定したウィンドウまたは画面全体のスクリーンショットを保存する。"""
  f_path = f"./{datetime.datetime.now(datetime.UTC).strftime('%Y%m%d%H%M%S')}.png"
  if file_path is not None:
    f_path = file_path

  if window_name is None:
    screenshot = pyautogui.screenshot()
  else:
    window = pywinctl.getWindowsWithTitle(window_name)[0]
    window.activate()
    x, y = window.topleft
    width, height = window.size
    screenshot = pyautogui.screenshot(region=(x, y, width, height))

  screenshot.save(f_path)


def get_input() -> str:
  """現在の入力フィールドの内容を取得する。"""
  pyautogui.hotkey("command", "a")
  pyautogui.hotkey("command", "c")
  return get_clipboard()


def set_input(s: str) -> None:
  """現在の入力フィールドに指定した文字列を入力する。"""
  pyautogui.typewrite(s)
  # tmp = get_clipboard()
  # set_clipboard(s)
  # pyautogui.hotkey("command", "v")
  # set_clipboard(tmp)


def delete_input() -> None:
  """現在の入力フィールドの内容を削除する。"""
  pyautogui.hotkey("command", "a")
  pyautogui.press("backspace")


def move_to(x: int, y: int) -> None:
  """指定した座標 (x, y) にマウスカーソルを移動する。"""
  if is_smooth:
    pyautogui.moveTo(x, y, 0.5)
  else:
    pyautogui.moveTo(x, y)


def click(button: ButtonType) -> None:
  """指定したボタンでクリック操作を行う。"""
  pyautogui.click(button=button.value)


def double_click(button: ButtonType) -> None:
  """指定したボタンでダブルクリック操作を行う。"""
  pyautogui.doubleClick(button=button.value)


def drag_to(x: int, y: int, button: ButtonType) -> None:
  """指定した座標 (x, y) まで指定したボタンでドラッグ操作を行う。"""
  if is_smooth:
    pyautogui.dragTo(x, y, 0.5, button=button.value)
  else:
    pyautogui.dragTo(x, y, button=button.value)


def scroll_vertical(y: int) -> None:
  """垂直方向にスクロールする。"""
  pyautogui.vscroll(y)


def scroll_horizontal(x: int) -> None:
  """水平方向にスクロールする。"""
  pyautogui.hscroll(x)


def execute_command(*args: str) -> None:
  """ショートカットコマンドを実行する。

  Enable keys: https://pyautogui.readthedocs.io/en/latest/keyboard.html#keyboard-keys
  """
  pyautogui.hotkey(args)
