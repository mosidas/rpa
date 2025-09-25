import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./index.module.css";

type CanvasItem = {
  id: number;
  x: number;
  y: number;
  color: string;
  label: string;
};

const ITEM_W = 120;
const ITEM_H = 60;

const CanvasPlayground = () => {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [items, setItems] = useState<CanvasItem[]>([
    { id: 1, x: 20, y: 20, color: "#e0f2fe", label: "ノード A" },
    { id: 2, x: 200, y: 120, color: "#dcfce7", label: "ノード B" },
    { id: 3, x: 380, y: 220, color: "#fee2e2", label: "ノード C" },
  ]);
  const [drag, setDrag] = useState<{ id: number | null; offsetX: number; offsetY: number }>({
    id: null,
    offsetX: 0,
    offsetY: 0,
  });

  useEffect(() => {
    if (drag.id === null) return;
    const onMove = (e: MouseEvent) => {
      const board = boardRef.current;
      if (!board) return;
      const b = board.getBoundingClientRect();
      let x = e.clientX - b.left - drag.offsetX;
      let y = e.clientY - b.top - drag.offsetY;
      x = Math.max(0, Math.min(x, b.width - ITEM_W));
      y = Math.max(0, Math.min(y, b.height - ITEM_H));
      setItems((prev) => prev.map((it) => (it.id === drag.id ? { ...it, x, y } : it)));
    };
    const onUp = () => setDrag({ id: null, offsetX: 0, offsetY: 0 });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp, { once: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, [drag.id, drag.offsetX, drag.offsetY]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    setDrag({ id, offsetX, offsetY });
    e.preventDefault();
  };

  const reset = () => {
    setItems([
      { id: 1, x: 20, y: 20, color: "#e0f2fe", label: "ノード A" },
      { id: 2, x: 200, y: 120, color: "#dcfce7", label: "ノード B" },
      { id: 3, x: 380, y: 220, color: "#fee2e2", label: "ノード C" },
    ]);
  };

  return (
    <div>
      <div className={styles.buttonRow}>
        <button type="button" onClick={reset} aria-label="配置リセット">
          位置をリセット
        </button>
      </div>
      <div ref={boardRef} className={styles.canvasBoard} aria-label="ドラッグ可能キャンバス">
        {items.map((it) => (
          <div
            key={it.id}
            className={`${styles.canvasItem} ${drag.id === it.id ? styles.canvasItemDragging : ""}`}
            onMouseDown={(e) => handleMouseDown(e, it.id)}
            style={{ left: it.x, top: it.y, width: ITEM_W, height: ITEM_H, background: it.color }}
            role="button"
            aria-label={`${it.label} をドラッグで移動`}
          >
            {it.label}
          </div>
        ))}
      </div>
    </div>
  );
};

const Home: NextPage = () => {
	const [activeTab, setActiveTab] = useState<
		| "forms"
		| "media"
		| "tables"
		| "navigation"
		| "feedback"
		| "canvas"
		| "misc"
	>("forms");
	const [showModal, setShowModal] = useState(false);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const [snack, setSnack] = useState<{ visible: boolean; message: string }>({
		visible: false,
		message: "",
	});
	const snackTimer = useRef<number | null>(null);

	const showSnackbar = (message: string) => {
		// 既存タイマーをクリア
		if (snackTimer.current) {
			window.clearTimeout(snackTimer.current);
		}
		setSnack({ visible: true, message });
		snackTimer.current = window.setTimeout(() => {
			setSnack((s) => ({ ...s, visible: false }));
		}, 2000);
	};

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			const target = e.target as HTMLElement | null;
			if (!target) return;
			const btn = target.closest<HTMLElement>("button, [role='button']");
			if (!btn) return;
			const label = (
				btn.getAttribute("aria-label") ||
				btn.textContent ||
				"ボタン"
			).trim();
			showSnackbar(`${label} を押しました`);
		};
		document.addEventListener("click", handler, true);
		return () => document.removeEventListener("click", handler, true);
	}, []);

	const sections = useMemo(
			() =>
				[
					{ key: "forms", label: "フォーム" },
					{ key: "media", label: "メディア" },
					{ key: "tables", label: "テーブル" },
					{ key: "navigation", label: "ナビゲーション" },
					{ key: "feedback", label: "フィードバック" },
					{ key: "canvas", label: "キャンバス" },
					{ key: "misc", label: "その他" },
				] as const,
		[],
	);

	// テーブル用ダミーデータ（1000行）
	const tableRows = useMemo(() => {
		const statuses = ["有効", "停止", "保留"] as const;
		return Array.from({ length: 1000 }, (_, i) => ({
			id: i + 1,
			name: `User #${i + 1}`,
			status: statuses[i % statuses.length],
		}));
	}, []);

	// 20列分のカラム定義（列1〜列20）
	const columns = useMemo(
		() => Array.from({ length: 20 }, (_, i) => i + 1),
		[],
	);

	return (
		<div className={styles["app-container"]}>
			<Head>
				<title>Dummy GUI - Kitchen Sink</title>
			</Head>

			<header className={styles.header}>
				<div className={styles.brand}>
					<h1>Dummy GUI</h1>
				</div>
				<nav className={styles.tabs} aria-label="セクション切替タブ">
					{sections.map((s) => (
						<button
							key={s.key}
							className={activeTab === s.key ? styles.tabActive : styles.tab}
							onClick={() => setActiveTab(s.key)}
							aria-pressed={activeTab === s.key}
						>
							{s.label}
						</button>
					))}
				</nav>
			</header>

			<main className={styles.main}>
				{activeTab === "canvas" && (
					<section className={styles.section} aria-label="ドラッグ&ドロップ キャンバス">
						<h2>キャンバス</h2>
						<CanvasPlayground />
					</section>
				)}
				{activeTab === "forms" && (
					<section className={styles.section} aria-label="フォーム要素">
						<h2>フォーム要素</h2>
						<form className={styles.grid} onSubmit={(e) => e.preventDefault()}>
							<fieldset className={styles.fieldset}>
								<legend>テキスト系</legend>
								<label>
									テキスト: <input name="text" type="text" placeholder="text" />
								</label>
								<label>
									パスワード:{" "}
									<input
										name="password"
										type="password"
										placeholder="password"
									/>
								</label>
								<label>
									メール:{" "}
									<input
										name="email"
										type="email"
										placeholder="example@example.com"
									/>
								</label>
								<label>
									数値: <input name="number" type="number" min={0} max={100} />
								</label>
								<label>
									検索: <input name="search" type="search" placeholder="検索" />
								</label>
								<label>
									TEL:{" "}
									<input name="tel" type="tel" placeholder="090-1234-5678" />
								</label>
								<label>
									URL:{" "}
									<input
										name="url"
										type="url"
										placeholder="https://example.com"
									/>
								</label>
								<label>
									読取専用:{" "}
									<input
										name="readonly"
										type="text"
										defaultValue="read only"
										readOnly
									/>
								</label>
								<label>
									無効:{" "}
									<input
										name="disabled"
										type="text"
										defaultValue="disabled"
										disabled
									/>
								</label>
								<label>
									テキストエリア:
									<textarea
										name="textarea"
										rows={3}
										placeholder="複数行"
									></textarea>
								</label>
								<label>
									datalist:
									<input list="fruits" name="fruit" placeholder="フルーツ" />
									<datalist id="fruits">
										<option value="Apple" />
										<option value="Banana" />
										<option value="Cherry" />
									</datalist>
								</label>
							</fieldset>

							<fieldset className={styles.fieldset}>
								<legend>選択系</legend>
								<label>
									セレクト:
									<select name="select">
										<option>選択してください</option>
										<option>Option A</option>
										<option>Option B</option>
										<option>Option C</option>
									</select>
								</label>
								<label>
									マルチセレクト:
									<select name="multiselect" multiple size={4}>
										<option>One</option>
										<option>Two</option>
										<option>Three</option>
										<option>Four</option>
									</select>
								</label>
								<fieldset className={styles.inlineGroup}>
									<legend>チェックボックス</legend>
									<label>
										<input type="checkbox" name="cb" value="a" /> A
									</label>
									<label>
										<input type="checkbox" name="cb" value="b" /> B
									</label>
									<label>
										<input type="checkbox" name="cb" value="c" /> C
									</label>
								</fieldset>
								<fieldset className={styles.inlineGroup}>
									<legend>ラジオボタン</legend>
									<label>
										<input type="radio" name="rd" value="x" /> X
									</label>
									<label>
										<input type="radio" name="rd" value="y" /> Y
									</label>
									<label>
										<input type="radio" name="rd" value="z" /> Z
									</label>
								</fieldset>
								<label className={styles.switch}>
									<input type="checkbox" />
									<span>トグルスイッチ</span>
								</label>
								<label>
									スライダー:{" "}
									<input type="range" min={0} max={100} defaultValue={50} />
								</label>
								<label>
									進捗: <progress value={40} max={100}></progress>
								</label>
								<label>
									メーター:{" "}
									<meter
										min={0}
										max={100}
										value={60}
										low={30}
										high={80}
										optimum={70}
									></meter>
								</label>
								<label>
									日付: <input type="date" />
								</label>
								<label>
									時刻: <input type="time" />
								</label>
								<label>
									日時: <input type="datetime-local" />
								</label>
								<label>
									月: <input type="month" />
								</label>
								<label>
									週: <input type="week" />
								</label>
								<label>
									色: <input type="color" defaultValue="#0070f3" />
								</label>
								<label>
									ファイル: <input type="file" />
								</label>
								<label>
									複数ファイル: <input type="file" multiple />
								</label>
								<output name="calc">出力: 1 + 2 = 3</output>
							</fieldset>

							<div className={styles.buttonRow}>
								<button type="button">ボタン</button>
								<button type="button" disabled>
									無効ボタン
								</button>
								<button type="reset">リセット</button>
								<button type="submit">送信</button>
								<a href="#" role="button" className={styles.linkButton}>
									リンクボタン
								</a>
							</div>
						</form>
					</section>
				)}

				{activeTab === "media" && (
					<section className={styles.section} aria-label="メディア要素">
						<h2>メディア</h2>
						<div className={styles.grid}>
							<figure>
								<img
									src="/images/nextjs-logo.svg"
									alt="Next.js"
									width={120}
									height={80}
								/>
								<figcaption>画像</figcaption>
							</figure>
							<figure>
								<video ref={videoRef} width={220} height={140} controls>
									<source src="" type="video/mp4" />
								</video>
								<figcaption>ビデオ（ソース未設定）</figcaption>
							</figure>
							<figure>
								<audio controls>
									<source src="" type="audio/mpeg" />
								</audio>
								<figcaption>オーディオ（ソース未設定）</figcaption>
							</figure>
							<figure>
								<canvas
									id="demo-canvas"
									width={220}
									height={80}
									className={styles.canvas}
								></canvas>
								<figcaption>キャンバス</figcaption>
							</figure>
						</div>
					</section>
				)}

				{activeTab === "tables" && (
					<section className={styles.section} aria-label="テーブル・リスト">
						<h2>テーブル・リスト</h2>
						<div className={styles.grid}>
							<div className={styles.tableScroll}>
								<table className={`${styles.table} ${styles.tableWide}`}>
									<caption>サンプルテーブル</caption>
									<thead>
										<tr>
											{columns.map((c) => (
												<th key={c}>{`列${c}`}</th>
											))}
										</tr>
									</thead>
									<tbody>
										{tableRows.map((r) => (
											<tr key={r.id}>
												{columns.map((c, idx) => (
													<td key={c}>
														{idx === 0
															? r.id
															: idx === 1
																? r.name
																: idx === 2
																	? r.status
																	: `R${r.id}-C${c}`}
													</td>
												))}
											</tr>
										))}
									</tbody>
								</table>
							</div>

							<div>
								<h3>リスト</h3>
								<ul>
									<li>項目1</li>
									<li>項目2</li>
									<li>項目3</li>
								</ul>
								<ol>
									<li>一</li>
									<li>二</li>
									<li>三</li>
								</ol>
								<dl>
									<dt>用語</dt>
									<dd>説明テキスト</dd>
								</dl>
							</div>

							<div>
								<h3>ツリー</h3>
								<ul>
									<li>
										親
										<ul>
											<li>子1</li>
											<li>
												子2
												<ul>
													<li>孫</li>
												</ul>
											</li>
										</ul>
									</li>
								</ul>
							</div>
						</div>
					</section>
				)}

				{activeTab === "navigation" && (
					<section className={styles.section} aria-label="ナビゲーション">
						<h2>ナビゲーション</h2>
						<nav aria-label="パンくず">
							<ol className={styles.breadcrumbs}>
								<li>
									<a href="#">ホーム</a>
								</li>
								<li>
									<a href="#">ライブラリ</a>
								</li>
								<li aria-current="page">データ</li>
							</ol>
						</nav>
						<div className={styles.pagination}>
							<button>{"<"}</button>
							<button className={styles.active}>1</button>
							<button>2</button>
							<button>3</button>
							<button>{">"}</button>
						</div>
						<details>
							<summary>アコーディオン項目</summary>
							<p>展開コンテンツ</p>
						</details>
						<menu className={styles.menu}>
							<li>
								<button>新規</button>
							</li>
							<li>
								<button>開く</button>
							</li>
							<li>
								<button>保存</button>
							</li>
						</menu>
						<p>
							<a href="#" title="ツールチップの例">
								ツールチップ（title属性）
							</a>
						</p>
						<p>
							<button onClick={() => setShowModal(true)}>モーダルを開く</button>
						</p>
					</section>
				)}

				{activeTab === "feedback" && (
					<section className={styles.section} aria-label="フィードバック">
						<h2>フィードバック</h2>
						<div className={styles.badges}>
							<span className={styles.badge}>Badge</span>
							<span className={styles.badgeInfo}>Info</span>
							<span className={styles.badgeWarn}>Warn</span>
							<span className={styles.badgeSuccess}>Success</span>
						</div>
						<div className={styles.chips}>
							<span className={styles.chip}>Chip 1</span>
							<span className={styles.chip}>Chip 2</span>
							<span className={styles.chip}>Chip 3</span>
						</div>
						<div className={styles.spinner} aria-label="ローディング"></div>
						<div className={styles.toast} role="status" aria-live="polite">
							トースト領域（ダミー表示）
						</div>
						<div className={styles.progressBlock}>
							<progress value={70} max={100}></progress>
							<meter min={0} max={1} value={0.3}></meter>
						</div>
						<div className={styles.avatarRow}>
							<img
								className={styles.avatar}
								src="/images/logo-universal.png"
								alt="avatar"
							/>
							<span>アバター</span>
						</div>
					</section>
				)}

				{activeTab === "misc" && (
					<section className={styles.section} aria-label="その他">
						<h2>その他</h2>
						<div className={styles.grid}>
							<div
								contentEditable
								className={styles.editable}
								suppressContentEditableWarning
							>
								contenteditable領域（編集可能）
							</div>
							<iframe
								title="空のiframe"
								srcDoc="<p>iframe内テキスト</p>"
								className={styles.iframe}
							></iframe>
							<code className={styles.code}>const x = 1;</code>
							<kbd>⌘ + K</kbd>
							<samp>サンプル出力</samp>
							<mark>ハイライト</mark>
							<small>小さな文字</small>
							<abbr title="World Health Organization">WHO</abbr>
							<button accessKey="k">アクセシビリティ（accesskey）</button>
						</div>
					</section>
				)}
			</main>

			{showModal && (
				<div className={styles.modalBackdrop} role="dialog" aria-modal="true">
					<div className={styles.modal}>
						<h3>モーダル</h3>
						<p>RPA検証用のダミーモーダルです。</p>
						<div className={styles.buttonRow}>
							<button onClick={() => setShowModal(false)}>閉じる</button>
						</div>
					</div>
				</div>
			)}

			<div
				className={`${styles.snackbar} ${snack.visible ? styles.snackbarShow : ""}`}
				role="status"
				aria-live="polite"
			>
				{snack.message}
			</div>

			<footer className={styles.footer}>
				<a href="#" target="_self">
					リンク
				</a>
				<span>© Dummy GUI</span>
			</footer>
		</div>
	);
};

export default Home;
