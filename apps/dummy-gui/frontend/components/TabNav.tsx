import React from "react";
import styles from "../pages/index.module.css";

export type Section = { key: string; label: string };

type Props = {
  sections: readonly Section[];
  activeKey: string;
  onChange: (key: string) => void;
};

export default function TabNav({ sections, activeKey, onChange }: Props) {
  return (
    <nav className={styles.tabs} aria-label="セクション切替タブ">
      {sections.map((s) => (
        <button
          key={s.key}
          className={activeKey === s.key ? styles.tabActive : styles.tab}
          onClick={() => onChange(s.key)}
          aria-pressed={activeKey === s.key}
        >
          {s.label}
        </button>
      ))}
    </nav>
  );
}

