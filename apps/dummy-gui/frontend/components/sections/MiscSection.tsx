import React from "react";
import styles from "../../pages/index.module.css";

export default function MiscSection() {
  return (
    <section className={styles.section} aria-label="その他">
      <h2>その他</h2>
      <div className={styles.grid}>
        <div contentEditable className={styles.editable} suppressContentEditableWarning>
          contenteditable領域（編集可能）
        </div>
        <iframe title="空のiframe" srcDoc="<p>iframe内テキスト</p>" className={styles.iframe}></iframe>
        <code className={styles.code}>const x = 1;</code>
        <kbd>⌘ + K</kbd>
        <samp>サンプル出力</samp>
        <mark>ハイライト</mark>
        <small>小さな文字</small>
        <abbr title="World Health Organization">WHO</abbr>
        <button accessKey="k">アクセシビリティ（accesskey）</button>
      </div>
    </section>
  );
}

