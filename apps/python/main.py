import pyautogui  # type: ignore
import pyperclip  # type: ignore
import pywinctl  # type: ignore
import time
import datetime


def print_location():
  """現在のポインターの位置を出力する。"""

  x, y = pyautogui.position()
  print(f"location: {x} {y}")


def print_clipboard():
  """現在のクリップボードのテキストを出力する。"""

  clip_str = pyperclip.paste()
  print(f"clipboard: {clip_str}")


def delete_input():
  """現在のフォーカスされているテキストボックスの内容を削除する。"""
  pyautogui.hotkey("command", "a")
  pyautogui.press("backspace")


def copy_input():
  """現在のフォーカスされているテキストボックスの内容をクリップボードにコピーする。"""
  pyautogui.hotkey("command", "a")
  pyautogui.hotkey("command", "c")
  print_clipboard()


def save_screenshot():
  window = pywinctl.getWindowsWithTitle("dummy-gui")[0]
  window.activate()
  x, y = window.topleft
  width, height = window.size
  print(f"x:{x} y:{y} w:{width} h:{height}")
  now = datetime.datetime.now()
  # YYYYMMDDhhmmss形式に書式化
  file_name = f"{now.strftime('%Y%m%d%H%M%S')}.png"
  screenshot = pyautogui.screenshot(region=(x, y, width, height))
  screenshot.save(f"./{file_name}")


def handle_browser():
  pyautogui.moveTo(380, 330, 0.3)
  pyautogui.click(button="middle")


def handle_dummygui():
  pyautogui.rightClick()
  pyautogui.hotkey("command", "escape")
  pyautogui.hotkey("command", "space")

  pyautogui.moveTo(100, 100)
  pyautogui.leftClick()

  # form
  pyautogui.moveTo(800, 240, 0.3)
  pyautogui.leftClick()

  pyautogui.moveTo(260, 460, 0.3)
  pyautogui.leftClick()
  delete_input()
  pyautogui.typewrite("hello worldあいうえお")  # hello world
  # for i in range(100):
  #   pyautogui.press("a")

  pyautogui.typewrite("a" * 100)
  copy_input()
  print_location()

  pyautogui.moveTo(270, 510, 0.3)
  pyautogui.leftClick()
  delete_input()
  pyautogui.typewrite("p@ssw0rd")  # p"ssw0rd
  copy_input()
  print_location()

  pyautogui.moveTo(240, 565, 0.3)
  pyautogui.leftClick()
  delete_input()
  pyautogui.typewrite("dummy@example.com")  # dummy"example.com
  copy_input()
  print_location()

  pyautogui.moveTo(600, 575, 0.3)
  pyautogui.leftClick()
  print_location()

  # table
  pyautogui.moveTo(950, 240, 0.3)
  pyautogui.leftClick()
  print_location()
  pyautogui.moveTo(350, 600, 0.3)
  pyautogui.leftClick()
  print_location()
  pyautogui.scroll(0, 0, 200)
  # save_screenshot()

  # canvas
  pyautogui.moveTo(1230, 240, 0.3)
  pyautogui.leftClick()
  pyautogui.moveTo(250, 480, 0.3)
  pyautogui.dragTo(800, 500, 0.5, button="left")


def main():
  time.sleep(1)
  print("===start===")
  handle_dummygui()
  # handle_browser()
  print("===end===")


if __name__ == "__main__":
  main()
