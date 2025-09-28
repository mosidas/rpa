'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';

type FormData = {
  name: string;
  age: string;
  gender: string;
  address: string;
  email: string;
  phone: string;
  birthday: string;
};

export default function AccountFormPage() {
  return (
    <Suspense fallback={<div className="text-sm text-foreground/70">読み込み中…</div>}>
      <FormInner />
    </Suspense>
  );
}

function FormInner() {
  const router = useRouter();
  const params = useSearchParams();

  const initial: FormData = useMemo(
    () => ({
      name: params.get('name') ?? '',
      age: params.get('age') ?? '',
      gender: params.get('gender') ?? '',
      address: params.get('address') ?? '',
      email: params.get('email') ?? '',
      phone: params.get('phone') ?? '',
      birthday: params.get('birthday') ?? '',
    }),
    [params],
  );

  const [data, setData] = useState<FormData>(initial);

  const update = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData((d) => ({ ...d, [k]: e.target.value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qs = new URLSearchParams(data as Record<string, string>).toString();
    router.push(`/account/confirm?${qs}`);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-lg font-semibold mb-4">アカウント情報入力</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="name">
            氏名{' '}
            <span className="text-red-600" aria-hidden>
              *
            </span>
            <span className="sr-only">（必須）</span>
          </label>
          <input
            id="name"
            required
            value={data.name}
            onChange={update('name')}
            className="w-full border rounded px-3 py-2 bg-background"
            placeholder="山田 太郎"
          />
        </div>

        <div>
          <label className="block text-sm mb-1" htmlFor="age">
            年齢
          </label>
          <input
            id="age"
            type="number"
            min={0}
            value={data.age}
            onChange={update('age')}
            className="w-full border rounded px-3 py-2 bg-background"
            placeholder="30"
          />
        </div>

        <div>
          <label className="block text-sm mb-1" htmlFor="gender">
            性別
          </label>
          <select
            id="gender"
            value={data.gender}
            onChange={update('gender')}
            className="w-full border rounded px-3 py-2 bg-background"
          >
            <option value="">未選択</option>
            <option value="male">男性</option>
            <option value="female">女性</option>
            <option value="other">その他</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1" htmlFor="address">
            住所
          </label>
          <input
            id="address"
            value={data.address}
            onChange={update('address')}
            className="w-full border rounded px-3 py-2 bg-background"
            placeholder="東京都千代田区…"
          />
        </div>

        <div>
          <label className="block text-sm mb-1" htmlFor="email">
            メールアドレス{' '}
            <span className="text-red-600" aria-hidden>
              *
            </span>
            <span className="sr-only">（必須）</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={data.email}
            onChange={update('email')}
            className="w-full border rounded px-3 py-2 bg-background"
            placeholder="taro@example.com"
          />
        </div>

        <div>
          <label className="block text-sm mb-1" htmlFor="phone">
            電話番号
          </label>
          <input
            id="phone"
            inputMode="tel"
            value={data.phone}
            onChange={update('phone')}
            className="w-full border rounded px-3 py-2 bg-background"
            placeholder="090-1234-5678"
          />
        </div>

        <div>
          <label className="block text-sm mb-1" htmlFor="birthday">
            生年月日
          </label>
          <input
            id="birthday"
            type="date"
            value={data.birthday}
            onChange={update('birthday')}
            className="w-full border rounded px-3 py-2 bg-background"
          />
        </div>

        <div className="pt-2 flex justify-center">
          <button type="submit" className="px-4 py-2 rounded border bg-foreground/5 hover:bg-foreground/10">
            入力内容を確認する
          </button>
        </div>
      </form>
    </div>
  );
}
