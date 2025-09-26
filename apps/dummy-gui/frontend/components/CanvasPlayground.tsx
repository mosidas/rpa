import React, { useEffect, useRef, useState } from "react";
import styles from "../pages/index.module.css";

type CanvasItem = {
  id: number;
  x: number;
  y: number;
  color: string;
  label: string;
};

const ITEM_W = 120;
const ITEM_H = 60;

export default function CanvasPlayground() {
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
}

