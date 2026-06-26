import type { Argument } from "../data/schemas";

type ArgumentPanelProps = {
  argument: Argument;
  onClose(): void;
};

export function ArgumentPanel({ argument, onClose }: ArgumentPanelProps) {
  return (
    <aside className="panel" aria-label="论述详情">
      <button className="hud-button panel-close" type="button" onClick={onClose}>
        关闭
      </button>
      <h2>{argument.questionZh}</h2>
      <p>
        <strong>{argument.claimZh}</strong>
      </p>
      <p>{argument.explanationZh}</p>
      <p className="muted">
        {argument.source.locator ?? "摘要"} · {argument.reviewStatus === "reviewed" ? "已审核" : "草稿"}
      </p>
    </aside>
  );
}
