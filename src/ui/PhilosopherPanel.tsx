import { useEffect, useMemo, useRef, useState } from "react";
import type { Philosopher } from "../data/schemas";
import { createIndexedDbCollectionsRepository } from "../domain/collections/localCollections";
import { pickName, useT, type MessageKey } from "../i18n";
import { useAppStore } from "../store/appStore";
import { showTransientMessage } from "./transientMessage";

type PhilosopherPanelProps = {
  philosopher: Philosopher;
};

export function PhilosopherPanel({ philosopher }: PhilosopherPanelProps) {
  const t = useT();
  const locale = useAppStore((state) => state.locale);
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
  // 作品名/主题名/人名按 locale 取；En 缺失回退 Zh（内容翻译渐进推进）
  const workTitleById = useMemo(
    () => new Map(works.map((work) => [work.id, locale === "en" && work.titleEn ? work.titleEn : work.titleZh])),
    [works, locale],
  );
  const philosopherNameById = useMemo(
    () => new Map(philosophers.map((p) => [p.id, pickName(p.names, locale)])),
    [philosophers, locale],
  );
  const themes = useAppStore((state) => state.themes);
  const themeNameById = useMemo(
    () => new Map(themes.map((theme) => [theme.id, locale === "en" ? theme.en : theme.zh])),
    [themes, locale],
  );
  const claimDetailRefs = useRef(new Map<string, HTMLDivElement>());

  const problemRefs = useRef(new Map<string, HTMLElement>());

  const displayName = pickName(philosopher.names, locale);

  // 3D 场景点击行星/卫星后，侧栏自动滚动到对应问题/观点
  useEffect(() => {
    if (!selectedThoughtClaimId) return;
    const element = claimDetailRefs.current.get(selectedThoughtClaimId);
    element?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedThoughtClaimId]);

  useEffect(() => {
    if (!selectedThoughtProblemId || selectedThoughtClaimId) return;
    const element = problemRefs.current.get(selectedThoughtProblemId);
    element?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedThoughtProblemId, selectedThoughtClaimId]);

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
    <aside className="panel" aria-label={t("panel.detailAria", { name: displayName })}>
      <button className="hud-button panel-close" type="button" onClick={() => selectPhilosopher(null)}>
        {t("common.close")}
      </button>
      <h2 className="panel-title">{displayName}</h2>
      <p className="muted">
        {locale === "en" ? philosopher.names.zh : philosopher.names.en}
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
            showTransientMessage(setSaveMessage, saveMessageTimerRef, t("panel.philosopherSaved"));
          }}
        >
          {t("panel.savePhilosopher")}
        </button>
      </div>
      {saveMessage && <p className="muted">{saveMessage}</p>}
      <p>{philosopher.life.display}</p>
      <p>
        <strong>{philosopher.oneLineZh}</strong>
      </p>
      <p>{philosopher.summaryZh}</p>
      <h3>{t("panel.keywords")}</h3>
      <p>{philosopher.keywordsZh.join(" · ")}</p>
      {philosopherWorks.length > 0 && (
        <section>
          <h3>{t("panel.works")}</h3>
          <ul className="works-list">
            {philosopherWorks.map((work) => (
              <li key={work.id}>
                <span>{locale === "en" && work.titleEn ? work.titleEn : work.titleZh}</span>
                {locale === "en" ? (
                  <span className="muted"> · {work.titleZh}</span>
                ) : (
                  work.titleEn && <span className="muted"> · {work.titleEn}</span>
                )}
                {work.yearDisplay && <span className="muted"> · {work.yearDisplay}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
      {philosopherArguments.length > 0 && (
        <section>
          <h3>{t("panel.selectedArguments")}</h3>
          {philosopherArguments.map((arg) => (
            <div className="argument-item" key={arg.id}>
              <p className="argument-question muted">{arg.questionZh}</p>
              <p><strong>{arg.claimZh}</strong></p>
              <p className="argument-explanation">{arg.explanationZh}</p>
              {arg.source.workId && (
                <p className="muted argument-source">
                  <span>{workTitleById.get(arg.source.workId) ?? arg.source.workId}</span>
                  {arg.source.locator && <span> · {arg.source.locator}</span>}
                  <span> · {t(`excerptStatus.${arg.source.excerptStatus}` as MessageKey)}</span>
                </p>
              )}
              <button
                className="hud-button"
                type="button"
                onClick={async () => {
                  await repo.saveItem({ targetType: "argument", targetId: arg.id, label: arg.claimZh });
                  showTransientMessage(setSaveMessage, saveMessageTimerRef, t("search.argumentSaved"));
                }}
              >
                {t("search.saveArgument")}
              </button>
            </div>
          ))}
        </section>
      )}
      {relationshipsByType.size > 0 && (
        <section>
          <h3>{t("panel.relationships")}</h3>
          {[...relationshipsByType.entries()].map(([type, rels]) => (
            <div className="relationship-group" key={type}>
              <p className="relationship-type-label">{t(`relationshipType.${type}` as MessageKey)}</p>
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
        <section className="thought-system" aria-label={t("panel.thoughtSystemAria", { name: displayName })}>
          <h3>{t("panel.thoughtSystem")}</h3>
          {philosopher.thoughtSystem.problems.map((problem) => {
            const problemExpanded = selectedThoughtProblemId === problem.id;

            return (
              <article
                className="thought-problem"
                key={problem.id}
                ref={(element) => {
                  if (element) problemRefs.current.set(problem.id, element);
                  else problemRefs.current.delete(problem.id);
                }}
              >
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
                            <div
                              className="thought-claim-detail"
                              ref={(element) => {
                                if (element) claimDetailRefs.current.set(claim.id, element);
                                else claimDetailRefs.current.delete(claim.id);
                              }}
                            >
                              <p>{claim.explanationZh}</p>
                              {claim.evidence.map((evidence) => {
                                const workTitle = evidence.source.workId
                                  ? workTitleById.get(evidence.source.workId) ?? evidence.source.workId
                                  : null;

                                return (
                                  <div className="thought-evidence" key={evidence.id}>
                                    <strong>{evidence.titleZh}</strong>
                                    <p>{evidence.summaryZh}</p>
                                    {evidence.source.publicDomainExcerptZh && (
                                      <blockquote className="thought-excerpt">
                                        {evidence.source.publicDomainExcerptZh}
                                      </blockquote>
                                    )}
                                    <p className="muted">
                                      {workTitle && <span>{workTitle}</span>}
                                      {evidence.source.locator && <span>{evidence.source.locator}</span>}
                                      <span>{t(`excerptStatus.${evidence.source.excerptStatus}` as MessageKey)}</span>
                                    </p>
                                  </div>
                                );
                              })}
                              {(claim.themeIds?.length ?? 0) > 0 && (() => {
                                const claimThemes = claim.themeIds ?? [];
                                const extensions = relationships.filter(
                                  (r) =>
                                    (r.from === philosopher.id || r.to === philosopher.id) &&
                                    r.themeIds?.some((themeId) => claimThemes.includes(themeId)),
                                );
                                return (
                                  <div className="thought-claim-extension">
                                    <p className="muted">
                                      {t("panel.extensionThemes", {
                                        themes: claimThemes
                                          .map((themeId) => themeNameById.get(themeId) ?? themeId)
                                          .join(" · "),
                                      })}
                                    </p>
                                    {extensions.length > 0 && (
                                      <ul className="thought-extension-list">
                                        {extensions.map((r) => {
                                          const otherId = r.from === philosopher.id ? r.to : r.from;
                                          const direction = r.from === philosopher.id ? "→" : "←";
                                          return (
                                            <li key={r.id} className="muted">
                                              {direction} {philosopherNameById.get(otherId) ?? otherId}（
                                              {t(`relationshipType.${r.type}` as MessageKey)}）
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    )}
                                  </div>
                                );
                              })()}
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
      <h3>{t("panel.dataStatus")}</h3>
      <p>{philosopher.reviewStatus === "reviewed" ? t("panel.reviewed") : t("panel.draft")}</p>
      <h3>{t("panel.notes")}</h3>
      <textarea
        className="note-textarea"
        value={noteBody}
        onChange={(event) => setNoteBody(event.target.value)}
        placeholder={t("panel.notePlaceholder")}
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
          showTransientMessage(setSaveMessage, saveMessageTimerRef, t("panel.noteSaved"));
        }}
      >
        {t("panel.saveNote")}
      </button>
    </aside>
  );
}
