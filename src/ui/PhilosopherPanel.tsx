import { useMemo, useRef, useState } from "react";
import type { Philosopher } from "../data/schemas";
import { createIndexedDbCollectionsRepository } from "../domain/collections/localCollections";
import { useAppStore } from "../store/appStore";
import { showTransientMessage } from "./transientMessage";

const relationshipTypeLabels: Record<string, string> = {
  direct_student: "师承",
  influence: "影响",
  school: "学派",
  shared_problem: "共同问题",
  critique: "批判",
  reception: "接受",
};

type PhilosopherPanelProps = {
  philosopher: Philosopher;
};

const excerptStatusLabels = {
  public_domain: "公版摘录",
  summary_only: "摘要",
  none: "无摘录",
} as const;

export function PhilosopherPanel({ philosopher }: PhilosopherPanelProps) {
  const selectPhilosopher = useAppStore((state) => state.selectPhilosopher);
  const works = useAppStore((state) => state.works);
  const selectedThoughtProblemId = useAppStore((state) => state.selectedThoughtProblemId);
  const selectedThoughtClaimId = useAppStore((state) => state.selectedThoughtClaimId);
  const selectThoughtProblem = useAppStore((state) => state.selectThoughtProblem);
  const selectThoughtClaim = useAppStore((state) => state.selectThoughtClaim);
  const argumentsIndex = useAppStore((state) => state.argumentsIndex);
  const relationships = useAppStore((state) => state.relationships);
  const philosophers = useAppStore((state) => state.philosophers);
  const repo = useMemo(() => createIndexedDbCollectionsRepository(), []);
  const workTitleById = useMemo(() => new Map(works.map((work) => [work.id, work.titleZh])), [works]);
  const philosopherNameById = useMemo(() => new Map(philosophers.map((p) => [p.id, p.names.zh])), [philosophers]);
  const [noteBody, setNoteBody] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const saveMessageTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  const philosopherWorks = useMemo(
    () => works.filter((w) => philosopher.works.includes(w.id)),
    [works, philosopher.works],
  );

  const philosopherArguments = useMemo(
    () => argumentsIndex.filter((a) => a.philosopherId === philosopher.id),
    [argumentsIndex, philosopher.id],
  );

  const relationshipsByType = useMemo(() => {
    const related = relationships.filter(
      (r) => r.from === philosopher.id || r.to === philosopher.id,
    );
    const grouped = new Map<string, typeof related>();
    for (const r of related) {
      const list = grouped.get(r.type) ?? [];
      list.push(r);
      grouped.set(r.type, list);
    }
    return grouped;
  }, [relationships, philosopher.id]);

  return (
    <aside className="panel" aria-label={`${philosopher.names.zh}详情`}>
      <button className="hud-button panel-close" type="button" onClick={() => selectPhilosopher(null)}>
        关闭
      </button>
      <h2 className="panel-title">{philosopher.names.zh}</h2>
      <p className="muted">
        {philosopher.names.en}
        {philosopher.names.native ? ` · ${philosopher.names.native}` : ""}
      </p>
      <div className="result-actions">
        <button
          className="hud-button"
          type="button"
          onClick={async () => {
            await repo.saveItem({
              targetType: "philosopher",
              targetId: philosopher.id,
              label: philosopher.names.zh,
            });
            showTransientMessage(setSaveMessage, saveMessageTimerRef, "已收藏哲人。");
          }}
        >
          收藏哲人
        </button>
      </div>
      {saveMessage && <p className="muted">{saveMessage}</p>}
      <p>{philosopher.life.display}</p>
      <p>
        <strong>{philosopher.oneLineZh}</strong>
      </p>
      <p>{philosopher.summaryZh}</p>
      <h3>关键词</h3>
      <p>{philosopher.keywordsZh.join(" · ")}</p>
      {philosopherWorks.length > 0 && (
        <section>
          <h3>代表作品</h3>
          <ul className="works-list">
            {philosopherWorks.map((work) => (
              <li key={work.id}>
                <span>{work.titleZh}</span>
                {work.titleEn && <span className="muted"> · {work.titleEn}</span>}
                {work.yearDisplay && <span className="muted"> · {work.yearDisplay}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
      {philosopherArguments.length > 0 && (
        <section>
          <h3>精选论证</h3>
          {philosopherArguments.map((arg) => (
            <div className="argument-item" key={arg.id}>
              <p className="argument-question muted">{arg.questionZh}</p>
              <p><strong>{arg.claimZh}</strong></p>
              <p className="argument-explanation">{arg.explanationZh}</p>
              {arg.source.workId && (
                <p className="muted argument-source">
                  <span>{workTitleById.get(arg.source.workId) ?? arg.source.workId}</span>
                  {arg.source.locator && <span> · {arg.source.locator}</span>}
                  <span> · {excerptStatusLabels[arg.source.excerptStatus]}</span>
                </p>
              )}
              <button
                className="hud-button"
                type="button"
                onClick={async () => {
                  await repo.saveItem({ targetType: "argument", targetId: arg.id, label: arg.claimZh });
                  showTransientMessage(setSaveMessage, saveMessageTimerRef, "已收藏论证。");
                }}
              >
                收藏论证
              </button>
            </div>
          ))}
        </section>
      )}
      {relationshipsByType.size > 0 && (
        <section>
          <h3>思想关系</h3>
          {[...relationshipsByType.entries()].map(([type, rels]) => (
            <div className="relationship-group" key={type}>
              <p className="relationship-type-label">{relationshipTypeLabels[type] ?? type}</p>
              <ul className="relationship-list">
                {rels.map((r) => {
                  const otherId = r.from === philosopher.id ? r.to : r.from;
                  const direction = r.from === philosopher.id ? "→" : "←";
                  return (
                    <li key={r.id}>
                      <span className="muted">{direction}</span>{" "}
                      {philosopherNameById.get(otherId) ?? otherId}
                      <span className="muted"> · {r.noteZh}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>
      )}
      {philosopher.thoughtSystem && (
        <section className="thought-system" aria-label={`${philosopher.names.zh}思想星系`}>
          <h3>思想星系</h3>
          {philosopher.thoughtSystem.problems.map((problem) => {
            const problemExpanded = selectedThoughtProblemId === problem.id;

            return (
              <article className="thought-problem" key={problem.id}>
                <button
                  className="thought-problem-button"
                  type="button"
                  aria-expanded={problemExpanded}
                  onClick={() => selectThoughtProblem(problemExpanded ? null : problem.id)}
                >
                  <span className="thought-problem-title">{problem.titleZh}</span>
                  <span className="muted">{problem.questionZh}</span>
                </button>
                {problemExpanded && (
                  <>
                    <p>{problem.summaryZh}</p>
                    {problem.claims.map((claim) => {
                      const claimExpanded = selectedThoughtClaimId === claim.id;

                      return (
                        <div className="thought-claim" key={claim.id}>
                          <button
                            className="thought-claim-button"
                            type="button"
                            aria-expanded={claimExpanded}
                            onClick={() => selectThoughtClaim(claimExpanded ? null : claim.id)}
                          >
                            <strong>{claim.titleZh}</strong>
                            <span>{claim.claimZh}</span>
                          </button>
                          {claimExpanded && (
                            <div className="thought-claim-detail">
                              <p>{claim.explanationZh}</p>
                              {claim.evidence.map((evidence) => {
                                const workTitle = evidence.source.workId
                                  ? workTitleById.get(evidence.source.workId) ?? evidence.source.workId
                                  : null;

                                return (
                                  <div className="thought-evidence" key={evidence.id}>
                                    <strong>{evidence.titleZh}</strong>
                                    <p>{evidence.summaryZh}</p>
                                    <p className="muted">
                                      {workTitle && <span>{workTitle}</span>}
                                      {evidence.source.locator && <span>{evidence.source.locator}</span>}
                                      <span>{excerptStatusLabels[evidence.source.excerptStatus]}</span>
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
              </article>
            );
          })}
        </section>
      )}
      <h3>数据状态</h3>
      <p>{philosopher.reviewStatus === "reviewed" ? "已审核" : "草稿，需人工审核"}</p>
      <h3>札记</h3>
      <textarea
        className="note-textarea"
        value={noteBody}
        onChange={(event) => setNoteBody(event.target.value)}
        placeholder="写一条本机札记..."
      />
      <button
        className="hud-button"
        type="button"
        onClick={async () => {
          if (!noteBody.trim()) return;
          await repo.saveNote({
            targetType: "philosopher",
            targetId: philosopher.id,
            body: noteBody.trim(),
          });
          setNoteBody("");
          showTransientMessage(setSaveMessage, saveMessageTimerRef, "札记已保存。");
        }}
      >
        保存札记
      </button>
    </aside>
  );
}
