"""サンプル"""

import os
import time

from dotenv import load_dotenv

from rpa import robot

load_dotenv()
imagepath = os.environ["IMAGE_PATH"]


def handle_hp() -> None:
  """Home pageを操作する。"""
  robot.is_smooth = True
  robot.delay_time_sec = 0.3

  robot.active_window("Microsoft Edge")
  robot.move_to_with_resize_image(f"{imagepath}/bp-banner-sc.png", 150, 150)
  # robot.move_to_with_resize_image(f"{imagepath}/kotira-btn-p3b-x2.png", 310, 50)
  # robot.move_to_with_resize_image(f"{imagepath}/bp-banner-p3-x2.png", 150, 150)
  # robot.move_to_with_image(f"{imagepath}/kotira-btn-sc.png")
  robot.move_to_with_image(f"{imagepath}/bp-banner-sc.png")
  # robot.click(robot.ButtonType.Left)
  # time.sleep(1)
  # robot.move_to_with_image(f"{imagepath}/more-btn-sc.png")
  # robot.click(robot.ButtonType.Left)
  # time.sleep(1)
  # robot.move_to_with_image(f"{imagepath}/kotira-btn-sc.png")
  # robot.click(robot.ButtonType.Left)


def main() -> None:
  """Main"""
  time.sleep(1)
  print("===start===")
  handle_hp()
  print("===end===")


if __name__ == "__main__":
  main()
