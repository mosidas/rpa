"""サンプル"""

import os
import time

from dotenv import load_dotenv

from rpa import desktop_robot

load_dotenv()
imagepath = os.environ["IMAGE_PATH"]


def handle_dummygui() -> None:
  """Dummy GUIを操作する。"""
  desktop_robot.is_smooth = True
  desktop_robot.delay_time_sec = 0.3

  desktop_robot.active_window("dummy-gui")

  # account register
  desktop_robot.move_to_with_image(f"{imagepath}/reg-account-btn.png")
  desktop_robot.click(desktop_robot.ButtonType.Left)
  time.sleep(0.5)
  desktop_robot.move_to_with_image(f"{imagepath}/input-name.png")
  desktop_robot.click(desktop_robot.ButtonType.Left)
  desktop_robot.set_input("あいう えお")
  desktop_robot.move_to_with_image(f"{imagepath}/input-age.png")
  desktop_robot.click(desktop_robot.ButtonType.Left)
  desktop_robot.set_input("112")
  desktop_robot.move_to_with_image(f"{imagepath}/input-gender.png")
  desktop_robot.click(desktop_robot.ButtonType.Left)
  desktop_robot.move_to_with_image(f"{imagepath}/select-male.png")
  desktop_robot.click(desktop_robot.ButtonType.Left)
  desktop_robot.move_to_with_image(f"{imagepath}/input-address.png")
  desktop_robot.click(desktop_robot.ButtonType.Left)
  desktop_robot.set_input("宇宙船地球号")
  desktop_robot.move_to_with_image(f"{imagepath}/input-mail.png")
  desktop_robot.click(desktop_robot.ButtonType.Left)
  desktop_robot.set_input("aiu@example.com")
  desktop_robot.move_to_with_image(f"{imagepath}/input-phone.png")
  desktop_robot.click(desktop_robot.ButtonType.Left)
  desktop_robot.set_input("090-1111-2222")
  desktop_robot.move_to_with_image(f"{imagepath}/input-yyyy-MM-dd.png")
  desktop_robot.click(desktop_robot.ButtonType.Left)
  desktop_robot.typewrite("1800")
  desktop_robot.execute_command("right")
  desktop_robot.typewrite("02")
  desktop_robot.execute_command("right")
  desktop_robot.typewrite("12")
  desktop_robot.move_to_with_image(f"{imagepath}/comfirm-input-btn.png")
  desktop_robot.click(desktop_robot.ButtonType.Left)


def main() -> None:
  """Main"""
  time.sleep(1)
  print("===start===")
  handle_dummygui()
  print("===end===")


if __name__ == "__main__":
  main()
