import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createIndexedDbCollectionsRepository,
  type LocalCollectionItem,
  type LocalNote,
} from "../domain/collections/localCollections";
import { useT, type MessageKey } from "../i18n";
import { useAppStore } from "../store/appStore";

export function CollectionsDrawer() {
  const t = useT();
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
    <aside className="panel drawer-left" aria-label={t("collections.title")}>
      <button className="hud-button panel-close" type="button" onClick={toggleCollections}>
        {t("common.close")}
      </button>
      <h2>{t("collections.title")}</h2>

      <section>
        <h3>{t("collections.items")}</h3>
        {items.length === 0 ? (
          <p className="muted">{t("collections.empty")}</p>
        ) : (
          items.map((item) => (
            <article key={item.id} className="result-card collection-item-card">
              <strong>{item.label}</strong>
              <p className="muted">
                {t(`targetType.${item.targetType}` as MessageKey)} · {item.targetId}
              </p>
              <button
                className="hud-button"
                type="button"
                onClick={async () => {
                  await repo.removeItem(item.targetType, item.targetId);
                  await reload();
                }}
              >
                {t("collections.remove")}
              </button>
            </article>
          ))
        )}
      </section>

      <section>
        <h3>{t("collections.notes")}</h3>
        {notes.length === 0 ? (
          <p className="muted">{t("collections.notesEmpty")}</p>
        ) : (
          notes.map((note) => (
            <article key={note.id} className="result-card">
              <strong>
                {t(`targetType.${note.targetType}` as MessageKey)} · {note.targetId}
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
            anchor.download = "decisive-moments-collections.json";
            anchor.click();
            URL.revokeObjectURL(url);
          }}
        >
          {t("collections.exportJson")}
        </button>
        <button className="hud-button" type="button" onClick={() => fileInputRef.current?.click()}>
          {t("collections.importJson")}
        </button>
        <input
          ref={fileInputRef}
          className="visually-hidden"
          type="file"
          accept="application/json,.json"
          aria-label={t("collections.importAria")}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            try {
              await repo.importJson(await file.text());
              await reload();
              setMessage(t("collections.importDone"));
            } catch {
              setMessage(t("collections.importFailed"));
            } finally {
              event.target.value = "";
            }
          }}
        />
      </div>
    </aside>
  );
}
