import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createIndexedDbCollectionsRepository,
  type CollectionTargetType,
  type LocalCollectionItem,
  type LocalNote,
} from "../domain/collections/localCollections";
import { useAppStore } from "../store/appStore";

const targetTypeLabels: Record<CollectionTargetType, string> = {
  philosopher: "哲人",
  argument: "论证",
  search: "搜索问题",
};

export function CollectionsDrawer() {
  const open = useAppStore((state) => state.collectionsOpen);
  const toggleCollections = useAppStore((state) => state.toggleCollections);
  const repo = useMemo(() => createIndexedDbCollectionsRepository(), []);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<LocalCollectionItem[]>([]);
  const [notes, setNotes] = useState<LocalNote[]>([]);
  const [message, setMessage] = useState("");

  const reload = useCallback(async () => {
    const [nextItems, nextNotes] = await Promise.all([repo.listItems(), repo.listNotes()]);
    setItems(nextItems);
    setNotes(nextNotes);
  }, [repo]);

  useEffect(() => {
    if (open) void reload();
  }, [open, reload]);

  if (!open) return null;

  return (
    <aside className="panel drawer-left" aria-label="收藏与札记">
      <button className="hud-button panel-close" type="button" onClick={toggleCollections}>
        关闭
      </button>
      <h2>收藏与札记</h2>

      <section>
        <h3>收藏</h3>
        {items.length === 0 ? (
          <p className="muted">还没有收藏。</p>
        ) : (
          items.map((item) => (
            <article key={item.id} className="result-card collection-item-card">
              <strong>{item.label}</strong>
              <p className="muted">
                {targetTypeLabels[item.targetType]} · {item.targetId}
              </p>
              <button
                className="hud-button"
                type="button"
                onClick={async () => {
                  await repo.removeItem(item.targetType, item.targetId);
                  await reload();
                }}
              >
                移除收藏
              </button>
            </article>
          ))
        )}
      </section>

      <section>
        <h3>札记</h3>
        {notes.length === 0 ? (
          <p className="muted">还没有札记。</p>
        ) : (
          notes.map((note) => (
            <article key={note.id} className="result-card">
              <strong>
                {targetTypeLabels[note.targetType]} · {note.targetId}
              </strong>
              <p>{note.body}</p>
            </article>
          ))
        )}
      </section>

      {message && <p className="muted">{message}</p>}
      <div className="drawer-actions">
        <button
          className="hud-button"
          type="button"
          onClick={async () => {
            const blob = new Blob([await repo.exportJson()], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "qunxing-collections.json";
            anchor.click();
            URL.revokeObjectURL(url);
          }}
        >
          导出 JSON
        </button>
        <button className="hud-button" type="button" onClick={() => fileInputRef.current?.click()}>
          导入 JSON
        </button>
        <input
          ref={fileInputRef}
          className="visually-hidden"
          type="file"
          accept="application/json,.json"
          aria-label="导入收藏 JSON"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            try {
              await repo.importJson(await file.text());
              await reload();
              setMessage("导入完成。");
            } catch {
              setMessage("导入失败，请检查 JSON 文件格式。");
            } finally {
              event.target.value = "";
            }
          }}
        />
      </div>
    </aside>
  );
}
