import pyautogui  # type: ignore
import pyperclip  # type: ignore
import pywinctl  # type: ignore
import datetime
from enum import Enum
from typing import Tuple

is_smooth = True


class ButtonType(Enum):
  Left = "left"
  Right = "right"
  Middle = "middle"


def active_window(window_name: str) -> None:
  window = pywinctl.getWindowsWithTitle(window_name)[0]
  window.activate()
  window.maximize()
  return


def get_current_location() -> Tuple[int, int]:
  x, y = pyautogui.position()
  return x, y


def get_clipboard() -> str:
  return pyperclip.paste()


def set_clipboard(s: str) -> None:
  pyperclip.copy(s)


def save_screenshot(
  window_name: str | None,
  file_name: str | None,
) -> None:
  f_name = f"{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.png"
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
  return


def get_input() -> str:
  pyautogui.hotkey("command", "a")
  pyautogui.hotkey("command", "c")
  return get_clipboard()


def set_input(s: str) -> None:
  tmp = get_clipboard()
  set_clipboard(s)
  pyautogui.hotkey("command", "v")
  set_clipboard(tmp)
  return


def delete_input() -> None:
  pyautogui.hotkey("command", "a")
  pyautogui.press("backspace")
  return


def move_to(x: int, y: int) -> None:
  if is_smooth:
    pyautogui.moveTo(x, y, 0.5)
  else:
    pyautogui.moveTo(x, y)
  return


def click(button: ButtonType) -> None:
  pyautogui.click(button=button)
  return


def double_click(button: ButtonType) -> None:
  pyautogui.doubleClick(button=button)
  return


def drag_to(x: int, y: int, button: ButtonType) -> None:
  if is_smooth:
    pyautogui.dragTo(x, y, 0.5, button=button)
  else:
    pyautogui.dragTo(x, y, button=button)
  return


def scroll_vertical(y: int) -> None:
  pyautogui.scroll(0, 0, y)
  return


def scroll_horizontal(x: int) -> None:
  pyautogui.scroll(0, x, 0)
  return


def execute_command(*args: str) -> None:
  """enable keys: https://pyautogui.readthedocs.io/en/latest/keyboard.html#keyboard-keys"""
  pyautogui.hotkey(args)
