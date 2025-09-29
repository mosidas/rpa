"""サンプル"""

import os
import time

from dotenv import load_dotenv

from rpa import browser_robot
from tools import tester

load_dotenv()
imagepath = os.environ["IMAGE_PATH"]


def handle_dummygui() -> None:
  """Dummy GUIを操作する。"""
  browser_robot.delay_time_sec = 0.3

  url_base = "http://localhost:3000/"
  browser_robot.open_browser(url_base, 300, 300)

  # account register
  name = "あいう エオ"
  age = "112"
  gender = "男性"
  address = "宇宙船地球号"
  email = "aiu@examle.com"
  phone = "090-1111-2222"
  birthday = "1888-09-30"
  url_form = f"{url_base}account/form"
  url_confirm = f"{url_base}account/confirm"
  browser_robot.click_browser("menu-register-account")
  time.sleep(1)
  browser_robot.scroll_y(100)
  print(f"url_form: {tester.check(browser_robot.get_current_url(), url_form)}")
  browser_robot.input_browser("name", name)
  browser_robot.input_browser("age", age)
  browser_robot.input_browser("gender", gender)
  browser_robot.input_browser("address", address)
  browser_robot.input_browser("email", email)
  browser_robot.input_browser("phone", phone)
  browser_robot.input_date_browser("birthday", birthday)
  time.sleep(1)
  browser_robot.click_browser("submit-input")
  time.sleep(1)
  print(f"url_confirm: {tester.check_start_with(browser_robot.get_current_url(), url_confirm)}")
  print(f"name: {tester.check(browser_robot.get_value_browser('name'), name)}")
  print(f"age: {tester.check(browser_robot.get_value_browser('age'), age)}")
  print(f"gender: {tester.check(browser_robot.get_value_browser('gender'), gender)}")
  print(f"address: {tester.check(browser_robot.get_value_browser('address'), address)}")
  print(f"email: {tester.check(browser_robot.get_value_browser('email'), email)}")
  print(f"phone: {tester.check(browser_robot.get_value_browser('phone'), phone)}")
  print(f"birthday: {tester.check(browser_robot.get_value_browser('birthday'), birthday)}")
  browser_robot.scroll_y(200)
  browser_robot.scroll_x(200)
  time.sleep(1)


def main() -> None:
  """Main"""
  time.sleep(1)
  print("===start===")
  handle_dummygui()
  print("===end===")


if __name__ == "__main__":
  main()
