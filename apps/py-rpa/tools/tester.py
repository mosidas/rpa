"""テスト"""


def check(target: str | None, expected: str) -> bool:
  """テストする。"""
  if target is None:
    return False
  return target == expected
