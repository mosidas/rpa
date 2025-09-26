import React from "react";
import styles from "../../pages/index.module.css";

type Props = { onOpenModal: () => void };

export default function NavigationSection({ onOpenModal }: Props) {
  return (
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
        <a href="#" title="ツールチップの例">ツールチップ（title属性）</a>
      </p>
      <p>
        <button onClick={onOpenModal}>モーダルを開く</button>
      </p>
    </section>
  );
}

