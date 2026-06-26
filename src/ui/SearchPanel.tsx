import { useMemo, useRef, useState } from "react";
import { searchArgumentsLocal } from "../data/search/argumentSearch";
import { searchPhilosophersLocal } from "../data/search/philosopherSearch";
import { createIndexedDbCollectionsRepository } from "../domain/collections/localCollections";
import { useAppStore } from "../store/appStore";
import { showTransientMessage } from "./transientMessage";

export function SearchPanel() {
  const query = useAppStore((state) => state.searchQuery);
  const philosophers = useAppStore((state) => state.philosophers);
  const argumentIndex = useAppStore((state) => state.argumentsIndex);
  const themes = useAppStore((state) => state.themes);
  const selectPhilosopher = useAppStore((state) => state.selectPhilosopher);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const repo = useMemo(() => createIndexedDbCollectionsRepository(), []);
  const [saveMessage, setSaveMessage] = useState("");
  const saveMessageTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  const philosopherResults = useMemo(
    () => searchPhilosophersLocal(query, philosophers).slice(0, 6),
    [query, philosophers],
  );
  const argumentResults = useMemo(
    () => searchArgumentsLocal(query, argumentIndex, themes).slice(0, 6),
    [query, argumentIndex, themes],
  );

  if (!query.trim()) return null;

  return (
    <section className="panel search-panel" aria-label="搜索结果">
      <h2>搜索</h2>
      <button
        className="hud-button"
        type="button"
        onClick={async () => {
          const trimmed = query.trim();
          if (!trimmed) return;
          await repo.saveItem({ targetType: "search", targetId: trimmed, label: trimmed });
          showTransientMessage(setSaveMessage, saveMessageTimerRef, "已收藏搜索问题。");
        }}
      >
        收藏这个问题
      </button>
      {saveMessage && <p className="muted">{saveMessage}</p>}
      {philosopherResults.length > 0 && <h3>哲人</h3>}
      {philosopherResults.map((result) => (
        <button
          className="hud-button result-button"
          key={result.item.id}
          onClick={() => {
            selectPhilosopher(result.item.id);
            setSearchQuery("");
          }}
          type="button"
        >
          {result.item.names.zh} <span>{result.item.names.en}</span>
        </button>
      ))}
      {argumentResults.length > 0 && <h3>论述</h3>}
      {argumentResults.map((result) => (
        <article key={result.item.id} className="result-card">
          <strong>{result.item.questionZh}</strong>
          <p>{result.item.claimZh}</p>
          <div className="result-actions">
            <button
              className="hud-button"
              type="button"
              onClick={() => {
                selectPhilosopher(result.item.philosopherId);
                setSearchQuery("");
              }}
            >
              定位哲人
            </button>
            <button
              className="hud-button"
              type="button"
              onClick={async () => {
                await repo.saveItem({
                  targetType: "argument",
                  targetId: result.item.id,
                  label: result.item.claimZh,
                });
                showTransientMessage(setSaveMessage, saveMessageTimerRef, "已收藏论证。");
              }}
            >
              收藏论证
            </button>
          </div>
        </article>
      ))}
      {philosopherResults.length === 0 && argumentResults.length === 0 && (
        <p className="muted">没有找到结果。</p>
      )}
    </section>
  );
}
