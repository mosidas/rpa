"""RPA のコアモジュール

pyautogui, pyperclip, pywinctlのラッパー
"""

import datetime
from enum import Enum

import pyautogui
import pyperclip
import pywinctl

is_smooth = True


class ButtonType(Enum):
  """ボタンタイプ"""

  Left = "left"
  Right = "right"
  Middle = "middle"


def active_window(window_name: str) -> None:
  """指定したウィンドウ名のウィンドウをアクティブ化し、最大化する。"""
  window = pywinctl.getWindowsWithTitle(window_name)[0]
  window.activate()
  window.maximize()


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
  file_name: str | None,
) -> None:
  """指定したウィンドウまたは画面全体のスクリーンショットを保存する。"""
  f_name = f"{datetime.datetime.now(datetime.UTC).strftime('%Y%m%d%H%M%S')}.png"
  if file_name is None:
    f_name = file_name

  if window_name is None:
    screenshot = pyautogui.screenshot()
  else:
    window = pywinctl.getWindowsWithTitle(window_name)[0]
    window.activate()
    x, y = window.topleft
    width, height = window.size
    screenshot = pyautogui.screenshot(region=(x, y, width, height))

  screenshot.save(f"./{f_name}")


def get_input() -> str:
  """現在の入力フィールドの内容を取得する。"""
  pyautogui.hotkey("command", "a")
  pyautogui.hotkey("command", "c")
  return get_clipboard()


def set_input(s: str) -> None:
  """現在の入力フィールドに指定した文字列を入力する。"""
  tmp = get_clipboard()
  set_clipboard(s)
  pyautogui.hotkey("command", "v")
  set_clipboard(tmp)


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
  pyautogui.click(button=button)


def double_click(button: ButtonType) -> None:
  """指定したボタンでダブルクリック操作を行う。"""
  pyautogui.doubleClick(button=button)


def drag_to(x: int, y: int, button: ButtonType) -> None:
  """指定した座標 (x, y) まで指定したボタンでドラッグ操作を行う。"""
  if is_smooth:
    pyautogui.dragTo(x, y, 0.5, button=button)
  else:
    pyautogui.dragTo(x, y, button=button)


def scroll_vertical(y: int) -> None:
  """垂直方向にスクロールする。"""
  pyautogui.scroll(0, 0, y)


def scroll_horizontal(x: int) -> None:
  """水平方向にスクロールする。"""
  pyautogui.scroll(0, x, 0)


def execute_command(*args: str) -> None:
  """ショートカットコマンドを実行する。

  Enable keys: https://pyautogui.readthedocs.io/en/latest/keyboard.html#keyboard-keys
  """
  pyautogui.hotkey(args)
