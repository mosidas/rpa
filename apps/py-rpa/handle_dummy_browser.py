"""サンプル"""

import os
import time

from dotenv import load_dotenv

from rpa import robot

load_dotenv()
imagepath = os.environ["IMAGE_PATH"]


def handle_dummygui() -> None:
  """Dummy GUIを操作する。"""
  robot.is_smooth = True
  robot.delay_time_sec = 0.3

  robot.active_window("Microsoft Edge")

  # account register
  robot.move_to_with_image(f"{imagepath}/reg-account-btn.png")
  robot.click(robot.ButtonType.Left)
  time.sleep(0.5)
  robot.move_to_with_image(f"{imagepath}/input-name.png")
  robot.click(robot.ButtonType.Left)
  robot.set_input("あいう えお")
  robot.move_to_with_image(f"{imagepath}/input-age.png")
  robot.click(robot.ButtonType.Left)
  robot.set_input("112")
  robot.move_to_with_image(f"{imagepath}/input-gender.png")
  robot.click(robot.ButtonType.Left)
  robot.move_to_with_image(f"{imagepath}/select-male.png")
  robot.click(robot.ButtonType.Left)
  robot.move_to_with_image(f"{imagepath}/input-address.png")
  robot.click(robot.ButtonType.Left)
  robot.set_input("宇宙船地球号")
  robot.move_to_with_image(f"{imagepath}/input-mail.png")
  robot.click(robot.ButtonType.Left)
  robot.set_input("aiu@example.com")
  robot.move_to_with_image(f"{imagepath}/input-phone.png")
  robot.click(robot.ButtonType.Left)
  robot.set_input("090-1111-2222")
  robot.move_to_with_image(f"{imagepath}/input-yyyy-MM-dd-browser.png")
  robot.click(robot.ButtonType.Left)
  robot.typewrite("1800")
  robot.execute_command("right")
  robot.typewrite("02")
  robot.execute_command("right")
  robot.typewrite("12")
  robot.move_to_with_image(f"{imagepath}/comfirm-input-btn.png")
  robot.click(robot.ButtonType.Left)


def main() -> None:
  """Main"""
  time.sleep(1)
  print("===start===")
  handle_dummygui()
  print("===end===")


if __name__ == "__main__":
  main()
