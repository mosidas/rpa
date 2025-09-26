"""サンプル"""

import time

from rpa import robot


def handle_browser() -> None:
  """サンプル"""
  robot.active_window("Microsoft Edge")
  print(f"window title: {robot.get_active_window_title()}")

  robot.move_to_with_image("/Users/syoota.yamaguchi/repos/rpa/.assets/dl.png")


def main() -> None:
  """Main"""
  time.sleep(1)
  print("===start===")
  handle_browser()
  print("===end===")


if __name__ == "__main__":
  main()
