import { useMemo, useState, type CSSProperties } from "react";
import type { Philosopher } from "../data/schemas";
import { pickName, useT, type MessageKey } from "../i18n";
import { civilizationColors } from "../scene/PhilosopherStars";
import { useAppStore } from "../store/appStore";

type ThoughtInfographicProps = {
  philosopher: Philosopher;
};

// 全屏信息图：一颗思想行星（问题）的完整子树铺开——主张、证据、逐字引文、外延。
export function ThoughtInfographic({ philosopher }: ThoughtInfographicProps) {
  const t = useT();
  const locale = useAppStore((state) => state.locale);
  const problemId = useAppStore((state) => state.selectedThoughtProblemId);
  const selectThoughtProblem = useAppStore((state) => state.selectThoughtProblem);
  const selectedClaimId = useAppStore((state) => state.selectedThoughtClaimId);
  const selectThoughtClaim = useAppStore((state) => state.selectThoughtClaim);
  const works = useAppStore((state) => state.works);
  const themes = useAppStore((state) => state.themes);
  const relationships = useAppStore((state) => state.relationships);
  const philosophers = useAppStore((state) => state.philosophers);

  const selectPhilosopher = useAppStore((state) => state.selectPhilosopher);
  const workTitleById = useMemo(
    () => new Map(works.map((work) => [work.id, locale === "en" && work.titleEn ? work.titleEn : work.titleZh])),
    [works, locale],
  );
  const themeNameById = useMemo(
    () => new Map(themes.map((theme) => [theme.id, locale === "en" ? theme.en : theme.zh])),
    [themes, locale],
  );
  const themeById = useMemo(() => new Map(themes.map((theme) => [theme.id, theme])), [themes]);
  const nameById = useMemo(
    () => new Map(philosophers.map((p) => [p.id, pickName(p.names, locale)])),
    [philosophers, locale],
  );

  // 外延详情条：{ claimId, kind: 主题 | 关系, key }
  const [ext, setExt] = useState<{ claimId: string; kind: "theme" | "relation"; key: string } | null>(null);
  const toggleExt = (claimId: string, kind: "theme" | "relation", key: string) => {
    setExt((current) =>
      current && current.claimId === claimId && current.kind === kind && current.key === key
        ? null
        : { claimId, kind, key },
    );
  };

  const problem = philosopher.thoughtSystem?.problems.find((item) => item.id === problemId);
  if (!problem) return null;

  const accent = civilizationColors[philosopher.civilization] ?? "#d8a24f";
  const close = () => selectThoughtProblem(null);

  return (
    <div
      className="infographic-overlay"
      style={{ "--accent": accent } as CSSProperties}
      onClick={close}
      role="dialog"
      aria-label={t("infographic.aria", { title: problem.titleZh })}
    >
      <div className="infographic-frame" onClick={(event) => event.stopPropagation()}>
        <button className="hud-button infographic-close" type="button" onClick={close}>
          {t("infographic.back")}
        </button>

        <aside className="infographic-planet">
          <p className="infographic-philosopher">
            {t("infographic.planetTag", { name: pickName(philosopher.names, locale) })}
          </p>
          <h1>{problem.titleZh}</h1>
          <p className="infographic-question">{problem.questionZh}</p>
          <p className="infographic-summary">{problem.summaryZh}</p>
          {(problem.themeIds?.length ?? 0) > 0 && (
            <p className="infographic-planet-themes">
              {(problem.themeIds ?? []).map((themeId) => themeNameById.get(themeId) ?? themeId).join(" · ")}
            </p>
          )}
        </aside>

        <section className="infographic-claims">
          {problem.claims.map((claim, claimIndex) => {
            const claimThemes = claim.themeIds ?? [];
            const extensions = relationships.filter(
              (r) =>
                (r.from === philosopher.id || r.to === philosopher.id) &&
                r.themeIds?.some((themeId) => claimThemes.includes(themeId)),
            );

            return (
              <article
                key={claim.id}
                className={`infographic-claim${selectedClaimId === claim.id ? " is-active" : ""}`}
                onClick={() => selectThoughtClaim(selectedClaimId === claim.id ? null : claim.id)}
              >
                <header className="infographic-claim-header">
                  <span className="infographic-claim-index">{String(claimIndex + 1).padStart(2, "0")}</span>
                  <h2>{claim.titleZh}</h2>
                </header>
                <p className="infographic-claim-text">{claim.claimZh}</p>
                <p className="infographic-claim-explanation">{claim.explanationZh}</p>

                <div className="infographic-evidence-row">
                  {claim.evidence.map((evidence) => (
                    <div key={evidence.id} className="infographic-evidence">
                      <p className="infographic-evidence-title">{evidence.titleZh}</p>
                      <p className="infographic-evidence-summary">{evidence.summaryZh}</p>
                      {evidence.source.publicDomainExcerptZh && (
                        <blockquote className="infographic-excerpt">{evidence.source.publicDomainExcerptZh}</blockquote>
                      )}
                      <p className="infographic-source">
                        {evidence.source.workId && (
                          <span>{workTitleById.get(evidence.source.workId) ?? evidence.source.workId}</span>
                        )}
                        {evidence.source.locator && <span>{evidence.source.locator}</span>}
                        <span>{t(`excerptStatus.${evidence.source.excerptStatus}` as MessageKey)}</span>
                      </p>
                    </div>
                  ))}
                </div>

                {claimThemes.length > 0 && (
                  <footer className="infographic-extension">
                    <span className="infographic-extension-label">{t("infographic.extension")}</span>
                    {claimThemes.map((themeId) => (
                      <em
                        key={themeId}
                        className={ext?.claimId === claim.id && ext.kind === "theme" && ext.key === themeId ? "is-open" : ""}
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleExt(claim.id, "theme", themeId);
                        }}
                      >
                        {themeNameById.get(themeId) ?? themeId}
                      </em>
                    ))}
                    {extensions.map((r) => {
                      const otherId = r.from === philosopher.id ? r.to : r.from;
                      return (
                        <span
                          key={r.id}
                          className={`infographic-extension-link${ext?.claimId === claim.id && ext.kind === "relation" && ext.key === r.id ? " is-open" : ""}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleExt(claim.id, "relation", r.id);
                          }}
                        >
                          {r.from === philosopher.id ? "→" : "←"} {nameById.get(otherId) ?? otherId}（
                          {t(`relationshipType.${r.type}` as MessageKey)}）
                        </span>
                      );
                    })}
                  </footer>
                )}
                {ext && ext.claimId === claim.id && (
                  <div className="infographic-ext-detail" onClick={(event) => event.stopPropagation()}>
                    {ext.kind === "theme" && (() => {
                      const theme = themeById.get(ext.key);
                      const related = relationships.filter((r) => r.themeIds?.includes(ext.key));
                      const involved = [...new Set(related.flatMap((r) => [r.from, r.to]))]
                        .filter((id) => id !== philosopher.id)
                        .map((id) => nameById.get(id) ?? id)
                        .slice(0, 14);
                      return (
                        <>
                          <p className="infographic-ext-detail-title">
                            {t("infographic.themeDetailTitle", { name: themeNameById.get(ext.key) ?? ext.key })}
                            {theme?.aliasesZh?.length ? <span className="muted">（{theme.aliasesZh.join(" / ")}）</span> : null}
                          </p>
                          <p>
                            {involved.length > 0
                              ? t("infographic.themeRelatedNames", {
                                  count: related.length,
                                  names: involved.join("、"),
                                }) + (related.length > 14 ? t("infographic.andMore") : "")
                              : t("infographic.themeRelated", { count: related.length })}
                          </p>
                        </>
                      );
                    })()}
                    {ext.kind === "relation" && (() => {
                      const r = relationships.find((item) => item.id === ext.key);
                      if (!r) return null;
                      const otherId = r.from === philosopher.id ? r.to : r.from;
                      return (
                        <>
                          <p className="infographic-ext-detail-title">
                            {nameById.get(r.from) ?? r.from} ─{t(`relationshipType.${r.type}` as MessageKey)}→{" "}
                            {nameById.get(r.to) ?? r.to}
                          </p>
                          <p>
                            {t("infographic.strength")} {"★".repeat(r.strength ?? 1)} · {t("infographic.confidence")}{" "}
                            {r.confidence ?? "—"} · {t("infographic.sharedThemes")}
                            {(r.themeIds ?? []).map((themeId) => themeNameById.get(themeId) ?? themeId).join("、") || "—"}
                          </p>
                          <button
                            className="hud-button infographic-ext-goto"
                            type="button"
                            onClick={() => selectPhilosopher(otherId)}
                          >
                            {t("infographic.goto", { name: nameById.get(otherId) ?? otherId })}
                          </button>
                        </>
                      );
                    })()}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
