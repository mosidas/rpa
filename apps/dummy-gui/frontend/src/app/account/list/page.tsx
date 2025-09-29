'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';

type Account = {
  id: number;
  name: string;
  email: string;
  age: number;
  address: string;
  gender?: string;
};

const PAGE_SIZE = 20;
const CSV_PATH = '/data.csv';

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          // escaped quote
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        row.push(field);
        field = '';
      } else if (c === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      } else if (c === '\r') {
        // ignore
      } else {
        field += c;
      }
    }
  }
  // last field
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  const headers = rows.shift() ?? [];
  return { headers, rows };
}

function toAccounts(headers: string[], rows: string[][]): Account[] {
  const norm = (s: string) => s.trim().toLowerCase();
  const idx = (keys: string[]) => headers.findIndex((h) => keys.includes(norm(h)));
  const idIdx = idx(['id', 'no', '番号']);
  const nameIdx = idx(['name', '氏名', '名前']);
  const emailIdx = idx(['email', 'mail', 'メール', 'メールアドレス']);
  const ageIdx = idx(['age', '年齢']);
  const addrIdx = idx(['address', '住所']);
  const genderIdx = idx(['gender', '性別']);
  return rows.map((r, i) => ({
    id: idIdx >= 0 ? parseInt(r[idIdx] || String(i + 1), 10) || i + 1 : i + 1,
    name: nameIdx >= 0 ? r[nameIdx] || '' : '',
    email: emailIdx >= 0 ? r[emailIdx] || '' : '',
    age: ageIdx >= 0 ? parseInt(r[ageIdx] || '0', 10) || 0 : 0,
    address: addrIdx >= 0 ? r[addrIdx] || '' : '',
    gender: genderIdx >= 0 ? r[genderIdx] || '' : '',
  }));
}

export default function AccountListPage() {
  return (
    <Suspense fallback={<div className="text-sm text-foreground/70">読み込み中…</div>}>
      <ListInner />
    </Suspense>
  );
}

function ListInner() {
  const router = useRouter();
  const sp = useSearchParams();

  const qParam = sp.get('q') ?? '';
  const pageParam = Math.max(1, parseInt(sp.get('page') ?? '1', 10) || 1);

  const [query, setQuery] = useState(qParam);
  const [data, setData] = useState<Account[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(CSV_PATH, { cache: 'no-store' });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const text = await res.text();
        const { headers, rows } = parseCSV(text);
        const accounts = toAccounts(headers, rows);
        if (!cancelled) setData(accounts);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (!cancelled) setError(`CSVの読み込みに失敗しました: ${msg}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const list = data ?? [];
    if (!qParam.trim()) return list;
    const q = qParam.toLowerCase();
    return list.filter((a) => [a.name, a.email, a.address, a.gender ?? ''].some((v) => v.toLowerCase().includes(q)));
  }, [data, qParam]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(pageParam, totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

  // 表示するページ番号を省略して生成
  const pageItems = useMemo<(number | string)[]>(() => {
    const items: (number | string)[] = [];
    const win = 2; // 現在ページの前後に表示する数
    const set = new Set<number>();
    set.add(1);
    set.add(totalPages);
    for (let p = Math.max(1, page - win); p <= Math.min(totalPages, page + win); p++) {
      set.add(p);
    }
    const pages = Array.from(set).sort((a, b) => a - b);
    for (let i = 0; i < pages.length; i++) {
      if (i > 0 && pages[i] - pages[i - 1] > 1) items.push(`gap-${pages[i - 1]}-${pages[i]}`);
      items.push(pages[i]);
    }
    return items;
  }, [page, totalPages]);

  const pushWith = (next: { q?: string; page?: number }) => {
    const params = new URLSearchParams();
    const q = next.q ?? qParam;
    const p = next.page ?? page;
    if (q) params.set('q', q);
    if (p && p !== 1) params.set('page', String(p));
    const qs = params.toString();
    router.push(`/account/list${qs ? `?${qs}` : ''}`);
  };

  const onSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    pushWith({ q: query, page: 1 });
  };

  const goPage = (p: number) => pushWith({ page: p });

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">アカウント一覧</h1>

      <form onSubmit={onSearch} className="flex gap-1 mb-4 justify-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="名前・メール・住所を検索"
          className="w-[min(520px,100%)] border rounded px-3 py-1 bg-background"
        />
        <button type="submit" className="px-4 py-1 rounded border bg-foreground/5 hover:bg-foreground/10">
          検索
        </button>
      </form>

      {loading && <div className="text-sm text-foreground/70">読み込み中…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {!loading && !error && (
        <>
          <div className="text-sm text-foreground/70 mb-1">
            {total} 件中 {start + 1}–{Math.min(start + PAGE_SIZE, total)} 件を表示
          </div>

          <div className="overflow-auto rounded border">
            <table className="min-w-[640px] w-full text-sm">
              <thead className="bg-foreground/5">
                <tr>
                  <th className="text-left px-3 py-2 w-16">ID</th>
                  <th className="text-left px-3 py-2">氏名</th>
                  <th className="text-left px-3 py-2">メール</th>
                  <th className="text-left px-3 py-2 w-20">年齢</th>
                  <th className="text-left px-3 py-2 w-20">性別</th>
                  <th className="text-left px-3 py-2">住所</th>
                </tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.id} className="odd:bg-background even:bg-foreground/[0.02]">
                    <td className="px-3 py-2 align-top">{a.id}</td>
                    <td className="px-3 py-2 align-top">{a.name}</td>
                    <td className="px-3 py-2 align-top">{a.email}</td>
                    <td className="px-3 py-2 align-top">{a.age}</td>
                    <td className="px-3 py-2 align-top">{renderGender(a.gender)}</td>
                    <td className="px-3 py-2 align-top">{a.address}</td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-foreground/70">
                      該当するデータがありません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 max-w-full overflow-x-auto">
            <nav className="flex flex-wrap justify-center items-center gap-1" aria-label="ページング">
              <button
                type="button"
                className="px-3 py-1.5 rounded border disabled:opacity-40"
                onClick={() => goPage(1)}
                disabled={page <= 1}
              >
                最初へ
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded border disabled:opacity-40"
                onClick={() => goPage(Math.max(1, page - 1))}
                disabled={page <= 1}
              >
                前へ
              </button>
              {pageItems.map((it) =>
                typeof it === 'string' && it.startsWith('gap-') ? (
                  <span key={it} className="px-2 py-1.5 text-foreground/60 select-none">
                    …
                  </span>
                ) : (
                  <button
                    type="button"
                    key={`p-${it}`}
                    aria-current={it === page ? 'page' : undefined}
                    className={`px-3 py-1.5 rounded border ${
                      it === page ? 'bg-foreground/10' : 'hover:bg-foreground/5'
                    }`}
                    onClick={() => goPage(Number(it))}
                  >
                    {it}
                  </button>
                ),
              )}
              <button
                type="button"
                className="px-3 py-1.5 rounded border disabled:opacity-40"
                onClick={() => goPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
              >
                次へ
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded border disabled:opacity-40"
                onClick={() => goPage(totalPages)}
                disabled={page >= totalPages}
              >
                最後へ
              </button>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}

function renderGender(g?: string) {
  if (!g) return '—';
  const v = g.toLowerCase();
  if (v === 'male' || g === '男' || g === '男性') return '男性';
  if (v === 'female' || g === '女' || g === '女性') return '女性';
  if (v === 'other' || g === 'その他') return 'その他';
  return g; // 未知の値はそのまま表示
}
