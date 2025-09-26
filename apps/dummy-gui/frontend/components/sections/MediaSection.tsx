import React, { useRef } from "react";
import styles from "../../pages/index.module.css";

export default function MediaSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  return (
    <section className={styles.section} aria-label="メディア要素">
      <h2>メディア</h2>
      <div className={styles.grid}>
        <figure>
          <img src="/images/nextjs-logo.svg" alt="Next.js" width={120} height={80} />
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
          <canvas id="demo-canvas" width={220} height={80} className={styles.canvas}></canvas>
          <figcaption>キャンバス</figcaption>
        </figure>
      </div>
    </section>
  );
}

