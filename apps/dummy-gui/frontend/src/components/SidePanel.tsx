'use client';

import Link from 'next/link';

export default function SidePanel() {
  return (
    <nav aria-label="サイドパネル" className="text-sm">
      <ul className="space-y-1">
        <li>
          <Link
            id="menu-register-account"
            href="/account/form"
            className="block px-3 py-2 rounded hover:bg-foreground/5"
          >
            アカウント登録
          </Link>
        </li>
        <li>
          <Link id="menu-account-list" href="/account/list" className="block px-3 py-2 rounded hover:bg-foreground/5">
            アカウント一覧
          </Link>
        </li>
      </ul>
    </nav>
  );
}
