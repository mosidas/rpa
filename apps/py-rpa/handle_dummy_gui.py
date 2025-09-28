"""サンプル"""

import time

from rpa import robot


def handle_dummygui() -> None:
  """Dummy GUIを操作する。"""
  robot.is_smooth = True
  robot.delay_time_sec = 0.5
  robot.execute_command("command", "escape")
  robot.execute_command("command", "space")
  robot.move_to(100, 100)


def main() -> None:
  """Main"""
  time.sleep(1)
  print("===start===")
  handle_dummygui()
  print("===end===")


if __name__ == "__main__":
  main()
