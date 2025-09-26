import React from "react";
import styles from "../../pages/index.module.css";

export default function FormsSection() {
  return (
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
            <input name="password" type="password" placeholder="password" />
          </label>
          <label>
            メール:{" "}
            <input name="email" type="email" placeholder="example@example.com" />
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
            <input name="url" type="url" placeholder="https://example.com" />
          </label>
          <label>
            読取専用:{" "}
            <input name="readonly" type="text" defaultValue="read only" readOnly />
          </label>
          <label>
            無効:{" "}
            <input name="disabled" type="text" defaultValue="disabled" disabled />
          </label>
          <label>
            テキストエリア:
            <textarea name="textarea" rows={3} placeholder="複数行"></textarea>
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
            <meter min={0} max={100} value={60} low={30} high={80} optimum={70}></meter>
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
  );
}

