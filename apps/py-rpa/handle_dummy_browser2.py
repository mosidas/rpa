"""サンプル"""

import os
import time
from urllib.parse import urljoin

from dotenv import load_dotenv

from rpa.browser_robot_playwright import PlaywrightBrowserRobot
from tools import tester

load_dotenv()
imagepath = os.environ["IMAGE_PATH"]


def handle_dummygui() -> None:
  """Dummy GUIを操作する。"""

  with PlaywrightBrowserRobot(delay_time_sec=0.3) as robot:
    url_base = "http://localhost:3000"
    robot.open_browser(url_base, 1000, 1000)

    # debug
    print(f"window_size: {robot.get_window_size()}")
    print(f"current_window_handle: {robot.get_current_window_handle()}")

    # account register
    name = "あいう エオ"
    age = "112"
    gender = "男性"
    address = "宇宙船地球号"
    email = "aiu@examle.com"
    phone = "090-1111-2222"
    birthday = "1888-09-30"
    url_form = urljoin(url_base, "account/form")
    url_confirm = urljoin(url_base, "account/confirm")
    robot.click("menu-register-account")
    time.sleep(1)
    robot.scroll_y(100)
    print(f"url_form: {tester.check(robot.get_current_url(), url_form)}")
    robot.input("name", name)
    robot.input("age", age)
    robot.input("gender", gender)
    robot.input("address", address)
    robot.input("email", email)
    robot.input("phone", phone)
    robot.input_date("birthday", birthday)
    time.sleep(1)
    robot.click("submit-input")
    time.sleep(1)
    print(
      f"url_confirm: {tester.check_start_with(robot.get_current_url(), url_confirm)}",
    )
    print(f"name: {tester.check(robot.get_value('name'), name)}")
    print(f"age: {tester.check(robot.get_value('age'), age)}")
    print(f"gender: {tester.check(robot.get_value('gender'), gender)}")
    print(f"address: {tester.check(robot.get_value('address'), address)}")
    print(f"email: {tester.check(robot.get_value('email'), email)}")
    print(f"phone: {tester.check(robot.get_value('phone'), phone)}")
    print(
      f"birthday: {tester.check(robot.get_value('birthday'), birthday)}",
    )
    robot.scroll_y(200)
    robot.scroll_x(200)
    time.sleep(1)


def main() -> None:
  """Main"""
  time.sleep(1)
  print("===start===")
  handle_dummygui()
  print("===end===")


if __name__ == "__main__":
  main()
