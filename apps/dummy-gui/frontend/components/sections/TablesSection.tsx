import React, { useMemo } from "react";
import styles from "../../pages/index.module.css";

export default function TablesSection() {
  const tableRows = useMemo(() => {
    const statuses = ["有効", "停止", "保留"] as const;
    return Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `User #${i + 1}`,
      status: statuses[i % statuses.length],
    }));
  }, []);

  const columns = useMemo(() => Array.from({ length: 20 }, (_, i) => i + 1), []);

  return (
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
                      {idx === 0 ? r.id : idx === 1 ? r.name : idx === 2 ? r.status : `R${r.id}-C${c}`}
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
  );
}

