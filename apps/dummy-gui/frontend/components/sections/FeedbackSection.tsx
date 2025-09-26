import React from "react";
import styles from "../../pages/index.module.css";

export default function FeedbackSection() {
  return (
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
        <img className={styles.avatar} src="/images/logo-universal.png" alt="avatar" />
        <span>アバター</span>
      </div>
    </section>
  );
}

