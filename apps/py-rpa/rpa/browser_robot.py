"""ブラウザ操作RPA のコアモジュール

seleniumのラッパー
"""

import time
from enum import Enum

from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By

delay_time_sec = 0.5
_driver = webdriver.Edge()


class BrowserType(Enum):
  """ブラウザタイプ"""

  Edge = 1
  Chrome = 2
  Safari = 3
  FireFox = 4


def open_browser(url: str) -> None:
  """指定したURLを指定したブラウザで表示する。"""
  _driver.get(url)
  time.sleep(delay_time_sec)


def close_browser() -> None:
  """ブラウザを閉じる"""
  _driver.quit()


def get_current_url() -> str:
  """urlを取得する。"""
  return _driver.current_url


def input_browser(attr_id: str, s: str) -> None:
  """指定したHTML要素に値を入力する。"""
  try:
    _driver.find_element(By.ID, attr_id).send_keys(s)
    time.sleep(delay_time_sec)
  except NoSuchElementException as e:
    print(e.msg)


def input_date_browser(attr_id: str, s: str) -> None:
  """指定したHTML要素に値を入力する。"""
  try:
    _driver.find_element(By.ID, attr_id).send_keys(f"00{s}")
    time.sleep(delay_time_sec)
  except NoSuchElementException as e:
    print(e.msg)


def click_browser(attr_id: str) -> None:
  """指定したHTML要素をクリックする。"""
  try:
    _driver.find_element(By.ID, attr_id).click()
    time.sleep(delay_time_sec)
  except NoSuchElementException as e:
    print(e.msg)


def get_value_browser(attr_id: str) -> str | None:
  """指定したHTML要素の値を取得する。"""
  try:
    return _driver.find_element(By.ID, attr_id).text
  except NoSuchElementException as e:
    print(e.msg)
    return None
