"""サンプル"""

import os
import time

from dotenv import load_dotenv

from rpa import robot
from tools import tester

load_dotenv()
imagepath = os.environ["IMAGE_PATH"]


def handle_dummygui() -> None:
  """Dummy GUIを操作する。"""
  robot.is_smooth = True
  robot.delay_time_sec = 0.3

  robot.open_browser("http://localhost:3000/")

  # account register
  name = "あいう エオ"
  age = "112"
  gender = "男性"
  address = "宇宙船地球号"
  email = "aiu@examle.com"
  phone = "090-1111-2222"
  birthday = "1888-09-30"
  robot.click_browser("menu-register-account")
  robot.input_browser("name", name)
  robot.input_browser("age", age)
  robot.input_browser("gender", gender)
  robot.input_browser("address", address)
  robot.input_browser("email", email)
  robot.input_browser("phone", phone)
  robot.input_date_browser("birthday", birthday)
  time.sleep(2)
  robot.click_browser("submit-input")

  time.sleep(5)

  print(f"name: {tester.check(robot.get_value_browser('name'), name)}")
  print(f"age: {tester.check(robot.get_value_browser('age'), age)}")
  print(f"gender: {tester.check(robot.get_value_browser('gender'), gender)}")
  print(f"address: {tester.check(robot.get_value_browser('address'), address)}")
  print(f"email: {tester.check(robot.get_value_browser('email'), email)}")
  print(f"phone: {tester.check(robot.get_value_browser('phone'), phone)}")
  print(f"birthday: {tester.check(robot.get_value_browser('birthday'), birthday)}")


def main() -> None:
  """Main"""
  time.sleep(1)
  print("===start===")
  handle_dummygui()
  print("===end===")


if __name__ == "__main__":
  main()
