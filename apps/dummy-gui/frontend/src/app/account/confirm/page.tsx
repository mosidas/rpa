'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function AccountConfirmPage() {
  return (
    <Suspense fallback={<div className="text-sm text-foreground/70">読み込み中…</div>}>
      <ConfirmInner />
    </Suspense>
  );
}

function ConfirmInner() {
  const router = useRouter();
  const sp = useSearchParams();

  const data = {
    name: sp.get('name') || '',
    age: sp.get('age') || '',
    gender: sp.get('gender') || '',
    address: sp.get('address') || '',
    email: sp.get('email') || '',
    phone: sp.get('phone') || '',
    birthday: sp.get('birthday') || '',
  };

  const backToForm = () => {
    const qs = new URLSearchParams(data as Record<string, string>).toString();
    router.push(`/account/form?${qs}`);
  };

  const complete = () => {
    router.push(`/account/complete`);
  };

  const genderLabel = (g: string) => {
    if (g === 'male') return '男性';
    if (g === 'female') return '女性';
    if (g === 'other') return 'その他';
    return '';
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-lg font-semibold mb-4">アカウント情報確認</h1>
      <div className="border rounded divide-y">
        <Row id="name" label="氏名" value={data.name} />
        <Row id="age" label="年齢" value={data.age} />
        <Row id="gender" label="性別" value={genderLabel(data.gender)} />
        <Row id="address" label="住所" value={data.address} />
        <Row id="email" label="メールアドレス" value={data.email} />
        <Row id="phone" label="電話番号" value={data.phone} />
        <Row id="birthday" label="生年月日" value={data.birthday} />
      </div>
      <div className="flex justify-center gap-3 mt-4">
        <button type="button" onClick={backToForm} className="px-4 py-2 rounded border">
          修正する
        </button>
        <button
          type="button"
          onClick={complete}
          className="px-4 py-2 rounded border bg-foreground/5 hover:bg-foreground/10"
        >
          登録する
        </button>
      </div>
    </div>
  );
}

function Row({ id, label, value }: { id: string; label: string; value: string }) {
  return (
    <div className="flex p-3">
      <div className="w-36 shrink-0 text-foreground/70">{label}</div>
      <div id={id} className="flex-1 whitespace-pre-wrap break-words">
        {value || '—'}
      </div>
    </div>
  );
}
