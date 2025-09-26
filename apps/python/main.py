"""サンプル"""

import time

from rpa import robot


def handle_browser() -> None:
  """ダミーGUI操作"""
  robot.active_window("Microsoft Edge")
  print(robot.get_active_window_title())


def get() -> None:
  """Get"""
  print(robot.get_windows())


def handle_dummygui() -> None:
  """Dummy GUIを操作する。"""
  robot.execute_command("command", "escape")
  robot.execute_command("command", "space")

  robot.active_window("dummy-gui")
  robot.resize_window("dummy-gui", 1504, 1612)
  get()

  robot.move_to(100, 100)
  robot.click(button=robot.ButtonType.Left)

  # form
  robot.move_to(800, 240)
  robot.click(button=robot.ButtonType.Left)

  robot.move_to(260, 460)
  robot.click(button=robot.ButtonType.Left)
  robot.delete_input()
  robot.set_input("hello worldあいうえお")
  robot.set_input("a" * 100)
  print(f"clipboard: {robot.get_input()}")
  print(f"location: {robot.get_current_location()}")

  robot.move_to(270, 510)
  robot.click(button=robot.ButtonType.Left)
  robot.delete_input()
  robot.set_input("p@ssw0rd")
  print(f"clipboard: {robot.get_input()}")
  print(f"location: {robot.get_current_location()}")

  robot.move_to(240, 565)
  robot.click(button=robot.ButtonType.Left)
  robot.delete_input()
  robot.set_input("dummy@example.com")  # dummy"example.com
  print(f"clipboard: {robot.get_input()}")
  print(f"location: {robot.get_current_location()}")

  robot.move_to(600, 575)
  robot.click(button=robot.ButtonType.Left)
  print(f"location: {robot.get_current_location()}")

  # table
  robot.move_to(950, 240)
  robot.click(button=robot.ButtonType.Left)
  print(f"location: {robot.get_current_location()}")
  robot.move_to(350, 600)
  robot.click(button=robot.ButtonType.Left)
  print(f"location: {robot.get_current_location()}")
  robot.scroll_vertical(-200)
  robot.scroll_horizontal(-100)

  # canvas
  robot.move_to(1230, 240)
  robot.click(button=robot.ButtonType.Left)
  robot.move_to(250, 480)
  robot.drag_to(800, 500, button=robot.ButtonType.Left)


def main() -> None:
  """Main"""
  time.sleep(1)
  print("===start===")
  handle_browser()

  print("===end===")


if __name__ == "__main__":
  main()
