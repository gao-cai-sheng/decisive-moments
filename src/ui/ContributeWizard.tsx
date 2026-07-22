import { useMemo, useState, type ReactNode } from "react";
import type { RelationshipType } from "../data/schemas";
import {
  buildIssueUrl,
  buildSubmissionFiles,
  validateContribution,
  type ContributionDraft,
  type ContributionIssue,
} from "../domain/contribution/validation";
import { useT, type MessageKey } from "../i18n";
import { useAppStore } from "../store/appStore";

const RELATIONSHIP_TYPES: RelationshipType[] = [
  "direct_student",
  "influence",
  "school",
  "shared_problem",
  "critique",
  "reception",
];

// periods 默认打 community 批次标；admit 时由维护者归入正式批次
function emptyDraft(): ContributionDraft {
  return {
    philosopher: {
      id: "",
      names: { zh: "", en: "" },
      life: { display: "" },
      civilization: "",
      traditions: [],
      periods: ["community"],
      themes: [],
      keywordsZh: [],
      oneLineZh: "",
      summaryZh: "",
    },
    works: [{ id: "", titleZh: "", noteZh: "" }],
    relationships: [
      { direction: "incoming", targetId: "", type: "influence", strength: 2, confidence: "medium", themeIds: [], noteZh: "" },
      { direction: "outgoing", targetId: "", type: "influence", strength: 2, confidence: "medium", themeIds: [], noteZh: "" },
    ],
    sourceNotes: [{ label: "", url: "", noteZh: "" }],
  };
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="contribute-field">
      <span className="muted">{label}</span>
      {children}
    </label>
  );
}

const STEP_FIELD_PREFIXES = ["philosopher", "works", "relationships", "sourceNotes"] as const;

export function ContributeWizard() {
  const t = useT();
  const open = useAppStore((state) => state.contributeOpen);
  const toggleContribute = useAppStore((state) => state.toggleContribute);
  const philosophers = useAppStore((state) => state.philosophers);
  const works = useAppStore((state) => state.works);
  const themes = useAppStore((state) => state.themes);

  const [draft, setDraft] = useState<ContributionDraft>(emptyDraft);
  const [step, setStep] = useState(0);
  const [checks, setChecks] = useState([false, false, false, false]);
  const [copied, setCopied] = useState(false);

  const context = useMemo(
    () => ({
      philosopherIds: new Set(philosophers.map((item) => item.id)),
      workIds: new Set(works.map((item) => item.id)),
      themeIds: new Set(themes.map((item) => item.id)),
    }),
    [philosophers, works, themes],
  );

  const issues = useMemo(() => validateContribution(draft, context), [draft, context]);

  if (!open) return null;

  const errors = issues.filter((issue) => issue.level === "error");
  const warnings = issues.filter((issue) => issue.level === "warning");
  const stepIssues = (list: ContributionIssue[]) =>
    list.filter((issue) => issue.field.startsWith(STEP_FIELD_PREFIXES[step]));
  const issueText = (issue: ContributionIssue) =>
    t(`contribute.issue.${issue.code}` as MessageKey, issue.params);
  const canSubmit = errors.length === 0 && checks.every(Boolean);

  const setPhilosopher = (patch: Partial<ContributionDraft["philosopher"]>) =>
    setDraft((current) => ({ ...current, philosopher: { ...current.philosopher, ...patch } }));
  const updateWork = (index: number, patch: Partial<ContributionDraft["works"][number]>) =>
    setDraft((current) => ({
      ...current,
      works: current.works.map((work, i) => (i === index ? { ...work, ...patch } : work)),
    }));
  const updateRelationship = (
    index: number,
    patch: Partial<ContributionDraft["relationships"][number]>,
  ) =>
    setDraft((current) => ({
      ...current,
      relationships: current.relationships.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  const updateSourceNote = (index: number, patch: Partial<ContributionDraft["sourceNotes"][number]>) =>
    setDraft((current) => ({
      ...current,
      sourceNotes: current.sourceNotes.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));

  const splitList = (value: string) =>
    value
      .split(/[,，、]/)
      .map((item) => item.trim())
      .filter(Boolean);

  const submissionJson = () => JSON.stringify(buildSubmissionFiles(draft), null, 2);

  const stepTitles: MessageKey[] = [
    "contribute.stepIdentity",
    "contribute.stepWorks",
    "contribute.stepRelationships",
    "contribute.stepSources",
  ];

  return (
    <aside className="panel drawer-left contribute-panel" aria-label={t("contribute.title")}>
      <button className="hud-button panel-close" type="button" onClick={toggleContribute}>
        {t("common.close")}
      </button>
      <h2>{t("contribute.title")}</h2>
      <p className="muted">{t("contribute.intro")}</p>
      <p className="contribute-steps">
        {stepTitles.map((key, index) => (
          <button
            key={key}
            className="hud-chip"
            aria-pressed={index === step}
            type="button"
            onClick={() => setStep(index)}
          >
            {index + 1}. {t(key)}
          </button>
        ))}
      </p>

      {step === 0 && (
        <section>
          <Field label={t("contribute.fieldId")}>
            <input
              className="search-input"
              value={draft.philosopher.id}
              onChange={(event) => setPhilosopher({ id: event.target.value.trim() })}
            />
          </Field>
          <Field label={t("contribute.fieldNameZh")}>
            <input
              className="search-input"
              value={draft.philosopher.names.zh}
              onChange={(event) =>
                setPhilosopher({ names: { ...draft.philosopher.names, zh: event.target.value } })
              }
            />
          </Field>
          <Field label={t("contribute.fieldNameEn")}>
            <input
              className="search-input"
              value={draft.philosopher.names.en}
              onChange={(event) =>
                setPhilosopher({ names: { ...draft.philosopher.names, en: event.target.value } })
              }
            />
          </Field>
          <Field label={t("contribute.fieldNameNative")}>
            <input
              className="search-input"
              value={draft.philosopher.names.native ?? ""}
              onChange={(event) =>
                setPhilosopher({
                  names: { ...draft.philosopher.names, native: event.target.value || undefined },
                })
              }
            />
          </Field>
          <div className="contribute-row">
            <Field label={t("contribute.fieldBirth")}>
              <input
                className="search-input"
                type="number"
                value={draft.philosopher.life.birth ?? ""}
                onChange={(event) =>
                  setPhilosopher({
                    life: {
                      ...draft.philosopher.life,
                      birth: event.target.value === "" ? undefined : Number(event.target.value),
                    },
                  })
                }
              />
            </Field>
            <Field label={t("contribute.fieldDeath")}>
              <input
                className="search-input"
                type="number"
                value={draft.philosopher.life.death ?? ""}
                onChange={(event) =>
                  setPhilosopher({
                    life: {
                      ...draft.philosopher.life,
                      death: event.target.value === "" ? undefined : Number(event.target.value),
                    },
                  })
                }
              />
            </Field>
          </div>
          <Field label={t("contribute.fieldLifeDisplay")}>
            <input
              className="search-input"
              value={draft.philosopher.life.display}
              onChange={(event) =>
                setPhilosopher({ life: { ...draft.philosopher.life, display: event.target.value } })
              }
            />
          </Field>
          <Field label={t("contribute.fieldCivilization")}>
            <input
              className="search-input"
              list="contribute-civilizations"
              value={draft.philosopher.civilization}
              onChange={(event) => setPhilosopher({ civilization: event.target.value.trim() })}
            />
          </Field>
          <datalist id="contribute-civilizations">
            {[...new Set(philosophers.map((item) => item.civilization))].sort().map((value) => (
              <option key={value} value={value} />
            ))}
          </datalist>
          <Field label={t("contribute.fieldTraditions")}>
            <input
              className="search-input"
              value={draft.philosopher.traditions.join(", ")}
              onChange={(event) => setPhilosopher({ traditions: splitList(event.target.value) })}
            />
          </Field>
          <Field label={t("contribute.fieldThemes")}>
            <span className="contribute-theme-chips">
              {themes.map((theme) => {
                const selected = draft.philosopher.themes.includes(theme.id);
                return (
                  <button
                    key={theme.id}
                    className="hud-chip"
                    aria-pressed={selected}
                    type="button"
                    onClick={() =>
                      setPhilosopher({
                        themes: selected
                          ? draft.philosopher.themes.filter((id) => id !== theme.id)
                          : [...draft.philosopher.themes, theme.id],
                      })
                    }
                  >
                    {theme.zh}
                  </button>
                );
              })}
            </span>
          </Field>
          <Field label={t("contribute.fieldKeywords")}>
            <input
              className="search-input"
              value={draft.philosopher.keywordsZh.join(", ")}
              onChange={(event) => setPhilosopher({ keywordsZh: splitList(event.target.value) })}
            />
          </Field>
          <Field label={t("contribute.fieldOneLine")}>
            <input
              className="search-input"
              value={draft.philosopher.oneLineZh}
              onChange={(event) => setPhilosopher({ oneLineZh: event.target.value })}
            />
          </Field>
          <Field label={t("contribute.fieldSummary")}>
            <textarea
              className="note-textarea"
              value={draft.philosopher.summaryZh}
              onChange={(event) => setPhilosopher({ summaryZh: event.target.value })}
            />
          </Field>
        </section>
      )}

      {step === 1 && (
        <section>
          {draft.works.map((work, index) => (
            <article className="result-card" key={index}>
              <Field label={t("contribute.workId")}>
                <input
                  className="search-input"
                  value={work.id}
                  placeholder={draft.philosopher.id ? `${draft.philosopher.id}-` : ""}
                  onChange={(event) => updateWork(index, { id: event.target.value.trim() })}
                />
              </Field>
              <Field label={t("contribute.workTitleZh")}>
                <input
                  className="search-input"
                  value={work.titleZh}
                  onChange={(event) => updateWork(index, { titleZh: event.target.value })}
                />
              </Field>
              <Field label={t("contribute.workTitleEn")}>
                <input
                  className="search-input"
                  value={work.titleEn ?? ""}
                  onChange={(event) => updateWork(index, { titleEn: event.target.value || undefined })}
                />
              </Field>
              <Field label={t("contribute.workOriginalTitle")}>
                <input
                  className="search-input"
                  value={work.originalTitle ?? ""}
                  onChange={(event) =>
                    updateWork(index, { originalTitle: event.target.value || undefined })
                  }
                />
              </Field>
              <Field label={t("contribute.workYear")}>
                <input
                  className="search-input"
                  value={work.yearDisplay ?? ""}
                  onChange={(event) => updateWork(index, { yearDisplay: event.target.value || undefined })}
                />
              </Field>
              <Field label={t("contribute.workNote")}>
                <textarea
                  className="note-textarea"
                  value={work.noteZh}
                  onChange={(event) => updateWork(index, { noteZh: event.target.value })}
                />
              </Field>
              {draft.works.length > 1 && (
                <button
                  className="hud-button"
                  type="button"
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      works: current.works.filter((_, i) => i !== index),
                    }))
                  }
                >
                  {t("contribute.remove")}
                </button>
              )}
            </article>
          ))}
          {draft.works.length < 2 && (
            <button
              className="hud-button"
              type="button"
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  works: [...current.works, { id: "", titleZh: "", noteZh: "" }],
                }))
              }
            >
              {t("contribute.addWork")}
            </button>
          )}
        </section>
      )}

      {step === 2 && (
        <section>
          <datalist id="contribute-philosophers">
            {philosophers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.names.zh}
              </option>
            ))}
          </datalist>
          {draft.relationships.map((relationship, index) => (
            <article className="result-card" key={index}>
              <div className="contribute-row">
                <button
                  className="hud-chip"
                  aria-pressed={relationship.direction === "outgoing"}
                  type="button"
                  onClick={() => updateRelationship(index, { direction: "outgoing" })}
                >
                  {t("contribute.relationshipDirectionOut")}
                </button>
                <button
                  className="hud-chip"
                  aria-pressed={relationship.direction === "incoming"}
                  type="button"
                  onClick={() => updateRelationship(index, { direction: "incoming" })}
                >
                  {t("contribute.relationshipDirectionIn")}
                </button>
              </div>
              <Field label={t("contribute.relationshipTarget")}>
                <input
                  className="search-input"
                  list="contribute-philosophers"
                  value={relationship.targetId}
                  onChange={(event) => updateRelationship(index, { targetId: event.target.value.trim() })}
                />
              </Field>
              <div className="contribute-row">
                <Field label={t("contribute.relationshipType")}>
                  <select
                    value={relationship.type}
                    onChange={(event) =>
                      updateRelationship(index, { type: event.target.value as RelationshipType })
                    }
                  >
                    {RELATIONSHIP_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {t(`relationshipType.${type}` as MessageKey)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t("contribute.relationshipStrength")}>
                  <select
                    value={relationship.strength}
                    onChange={(event) =>
                      updateRelationship(index, { strength: Number(event.target.value) as 1 | 2 | 3 })
                    }
                  >
                    {[1, 2, 3].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t("contribute.relationshipConfidence")}>
                  <select
                    value={relationship.confidence}
                    onChange={(event) =>
                      updateRelationship(index, {
                        confidence: event.target.value as "high" | "medium" | "low",
                      })
                    }
                  >
                    {["high", "medium", "low"].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label={t("contribute.relationshipThemes")}>
                <span className="contribute-theme-chips">
                  {themes.map((theme) => {
                    const selected = relationship.themeIds.includes(theme.id);
                    return (
                      <button
                        key={theme.id}
                        className="hud-chip"
                        aria-pressed={selected}
                        type="button"
                        onClick={() =>
                          updateRelationship(index, {
                            themeIds: selected
                              ? relationship.themeIds.filter((id) => id !== theme.id)
                              : [...relationship.themeIds, theme.id],
                          })
                        }
                      >
                        {theme.zh}
                      </button>
                    );
                  })}
                </span>
              </Field>
              <Field label={t("contribute.relationshipNote")}>
                <textarea
                  className="note-textarea"
                  value={relationship.noteZh}
                  onChange={(event) => updateRelationship(index, { noteZh: event.target.value })}
                />
              </Field>
              {draft.relationships.length > 2 && (
                <button
                  className="hud-button"
                  type="button"
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      relationships: current.relationships.filter((_, i) => i !== index),
                    }))
                  }
                >
                  {t("contribute.remove")}
                </button>
              )}
            </article>
          ))}
          {draft.relationships.length < 3 && (
            <button
              className="hud-button"
              type="button"
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  relationships: [
                    ...current.relationships,
                    {
                      direction: "outgoing",
                      targetId: "",
                      type: "influence",
                      strength: 2,
                      confidence: "medium",
                      themeIds: [],
                      noteZh: "",
                    },
                  ],
                }))
              }
            >
              {t("contribute.addRelationship")}
            </button>
          )}
        </section>
      )}

      {step === 3 && (
        <section>
          {draft.sourceNotes.map((note, index) => (
            <article className="result-card" key={index}>
              <Field label={t("contribute.sourceLabel")}>
                <input
                  className="search-input"
                  value={note.label}
                  onChange={(event) => updateSourceNote(index, { label: event.target.value })}
                />
              </Field>
              <Field label={t("contribute.sourceUrl")}>
                <input
                  className="search-input"
                  value={note.url ?? ""}
                  onChange={(event) => updateSourceNote(index, { url: event.target.value || undefined })}
                />
              </Field>
              <Field label={t("contribute.sourceNote")}>
                <textarea
                  className="note-textarea"
                  value={note.noteZh}
                  onChange={(event) => updateSourceNote(index, { noteZh: event.target.value })}
                />
              </Field>
              {draft.sourceNotes.length > 1 && (
                <button
                  className="hud-button"
                  type="button"
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      sourceNotes: current.sourceNotes.filter((_, i) => i !== index),
                    }))
                  }
                >
                  {t("contribute.remove")}
                </button>
              )}
            </article>
          ))}
          <button
            className="hud-button"
            type="button"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                sourceNotes: [...current.sourceNotes, { label: "", url: "", noteZh: "" }],
              }))
            }
          >
            {t("contribute.addSource")}
          </button>

          <h3>{t("contribute.checklistTitle")}</h3>
          {(["contribute.check1", "contribute.check2", "contribute.check3", "contribute.check4"] as MessageKey[]).map(
            (key, index) => (
              <label className="contribute-check" key={key}>
                <input
                  type="checkbox"
                  checked={checks[index]}
                  onChange={(event) =>
                    setChecks((current) => current.map((value, i) => (i === index ? event.target.checked : value)))
                  }
                />
                <span>{t(key)}</span>
              </label>
            ),
          )}

          {errors.length > 0 && (
            <>
              <h3>{t("contribute.errors")}</h3>
              <ul className="contribute-issues">
                {errors.map((issue, index) => (
                  <li key={`${issue.field}-${issue.code}-${index}`}>{issueText(issue)}</li>
                ))}
              </ul>
            </>
          )}
          {warnings.length > 0 && (
            <>
              <h3>{t("contribute.warnings")}</h3>
              <ul className="contribute-issues muted">
                {warnings.map((issue, index) => (
                  <li key={`${issue.field}-${issue.code}-${index}`}>{issueText(issue)}</li>
                ))}
              </ul>
            </>
          )}

          <div className="drawer-actions">
            <button
              className="hud-button"
              type="button"
              disabled={!canSubmit}
              onClick={async () => {
                await navigator.clipboard.writeText(submissionJson());
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              }}
            >
              {t("contribute.copyJson")}
            </button>
            <button
              className="hud-button"
              type="button"
              disabled={!canSubmit}
              onClick={() => {
                const blob = new Blob([submissionJson()], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = `contribution-${draft.philosopher.id || "draft"}.json`;
                anchor.click();
                URL.revokeObjectURL(url);
              }}
            >
              {t("contribute.downloadJson")}
            </button>
            <button
              className="hud-button"
              type="button"
              disabled={!canSubmit}
              onClick={() => window.open(buildIssueUrl(draft), "_blank", "noopener")}
            >
              {t("contribute.openIssue")}
            </button>
          </div>
          {copied && <p className="muted">{t("contribute.copied")}</p>}
          <p className="muted">{t("contribute.issueHint")}</p>
        </section>
      )}

      {stepIssues(errors).length > 0 && step < 3 && (
        <ul className="contribute-issues">
          {stepIssues(errors).map((issue, index) => (
            <li key={`${issue.field}-${issue.code}-${index}`}>{issueText(issue)}</li>
          ))}
        </ul>
      )}

      <div className="drawer-actions">
        {step > 0 && (
          <button className="hud-button" type="button" onClick={() => setStep(step - 1)}>
            {t("contribute.prev")}
          </button>
        )}
        {step < 3 && (
          <button className="hud-button" type="button" onClick={() => setStep(step + 1)}>
            {t("contribute.next")}
          </button>
        )}
      </div>
    </aside>
  );
}
