import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./index.module.css";
import TabNav from "../components/TabNav";
import CanvasBoard from "../components/CanvasPlayground";
import FormsSection from "../components/sections/FormsSection";
import MediaSection from "../components/sections/MediaSection";
import TablesSection from "../components/sections/TablesSection";
import NavigationSection from "../components/sections/NavigationSection";
import FeedbackSection from "../components/sections/FeedbackSection";
import MiscSection from "../components/sections/MiscSection";

// セクション実装は components 配下へ分割

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



	return (
		<div className={styles["app-container"]}>
			<Head>
				<title>Dummy GUI - Kitchen Sink</title>
			</Head>

			<header className={styles.header}>
				<div className={styles.brand}>
					<h1>Dummy GUI</h1>
				</div>
				<TabNav sections={sections} activeKey={activeTab} onChange={setActiveTab} />
			</header>

			<main className={styles.main}>
				{activeTab === "canvas" && (
					<section className={styles.section} aria-label="ドラッグ&ドロップ キャンバス">
						<h2>キャンバス</h2>
						<CanvasBoard />
					</section>
				)}
				{activeTab === "forms" && <FormsSection />}

				{activeTab === "media" && <MediaSection />}

				{activeTab === "tables" && <TablesSection />}

				{activeTab === "navigation" && (
					<NavigationSection onOpenModal={() => setShowModal(true)} />
				)}

				{activeTab === "feedback" && <FeedbackSection />}

				{activeTab === "misc" && <MiscSection />}
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
