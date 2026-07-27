import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getPhilosopher } from "../data/client";
import type { Philosopher, PhilosopherIndexEntry } from "../data/schemas";
import { pickName, pickText, useT } from "../i18n";
import { civilizationColors } from "../scene/PhilosopherStars";
import { useAppStore } from "../store/appStore";
import { fingerprintSvg } from "./fingerprint";

// 随机认识一位哲学家：一条三段动线。
//   riddle → 先只给这人真正在问的问题（thoughtSystem.problems[].questionZh），不给名字
//   card   → 翻面揭晓：思想指纹 + 姓名 + 一句话 + 关键词
//   出口   → 「带我去他的星」交回星图，由既有 selectPhilosopher 接管
//
// 钩子取 questionZh 而不是 oneLineZh，因为问题是最独一无二的字段——随机抽到谁都不会撞车。
// 但只有标准档有 thoughtSystem，种子档必须降级（见 pickHook）。

type Stage = "riddle" | "card";

type Hook = { text: string; kind: "question" | "keyword" | "oneline" };

/**
 * 遮掉钩子里的人名。库里的 questionZh 绝大多数以人名起句
 * （「商鞅为什么把民众的强弱…」「维柯为什么认为…」），照抄会在揭晓前剧透。
 * 中英文名都要遮：en locale 取的是 questionEn，但中文名偶尔混在英文句里。
 */
export function maskName(text: string, names: { zh: string; en: string }, locale: "zh" | "en"): string {
  const placeholder = locale === "en" ? "This thinker" : "这个人";
  let masked = text;
  // 长名先替换，避免「李贽」先匹配掉「李贽的老师」这类更长的写法
  for (const name of [names.zh, names.en].filter(Boolean).sort((a, b) => b.length - a.length)) {
    masked = masked.split(name).join(placeholder);
  }
  // 「这个人为什么…」读着别扭，句首连用时收敛成更自然的问法
  return masked.replace(/^这个人(为什么|如何|怎样|怎么)/, "$1");
}

/**
 * 挑一句钩子。优先级：真实提问 > 最具体的关键词 > 一句话简介。
 * 种子档（324/542）没有 thoughtSystem，用最长的关键词兜底——
 * 长词通常是学说名而非泛称（「随处体认天理」比「心学」更像一个钩子）。
 */
export function pickHook(
  philosopher: Philosopher | null,
  entry: PhilosopherIndexEntry,
  locale: "zh" | "en",
  seed: number,
): Hook {
  const problems = philosopher?.thoughtSystem?.problems ?? [];
  if (problems.length > 0) {
    const problem = problems[seed % problems.length];
    const text = pickText(problem as unknown as Record<string, unknown>, "question", locale);
    if (text) return { text: maskName(text, entry.names, locale), kind: "question" };
  }

  const keywords = locale === "en" && entry.keywordsEn?.length ? entry.keywordsEn : entry.keywordsZh;
  if (keywords?.length) {
    const longest = [...keywords].sort((a, b) => b.length - a.length)[0];
    return { text: longest, kind: "keyword" };
  }

  return { text: pickText(entry as unknown as Record<string, unknown>, "oneLine", locale), kind: "oneline" };
}

export function RandomEncounter() {
  const t = useT();
  const locale = useAppStore((state) => state.locale);
  const philosophers = useAppStore((state) => state.philosophers);
  const open = useAppStore((state) => state.randomEncounterOpen);
  const toggle = useAppStore((state) => state.toggleRandomEncounter);
  const selectPhilosopher = useAppStore((state) => state.selectPhilosopher);

  const [entry, setEntry] = useState<PhilosopherIndexEntry | null>(null);
  const [detail, setDetail] = useState<Philosopher | null>(null);
  const [stage, setStage] = useState<Stage>("riddle");
  const [seed, setSeed] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  const roll = useCallback(() => {
    if (philosophers.length === 0) return;
    const next = philosophers[Math.floor(Math.random() * philosophers.length)];
    setEntry(next);
    setDetail(null);
    setStage("riddle");
    setSeed(Math.floor(Math.random() * 1000));
  }, [philosophers]);

  // 打开时抽第一位；关闭时清空，避免下次打开闪现上一位。
  useEffect(() => {
    if (open) roll();
    else {
      setEntry(null);
      setDetail(null);
    }
  }, [open, roll]);

  // detail 只为拿 questionZh，独立加载：不碰 selectedPhilosopherId，
  // 否则会把右侧 PhilosopherPanel 一起顶开，两个面板叠在一起。
  useEffect(() => {
    if (!entry) return;
    let cancelled = false;
    getPhilosopher(entry.id)
      .then((loaded) => {
        if (!cancelled) setDetail(loaded);
      })
      .catch((error) => console.error("Failed to load philosopher for random encounter", error));
    return () => {
      cancelled = true;
    };
  }, [entry]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") toggle();
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, toggle]);

  const color = entry ? (civilizationColors[entry.civilization] ?? "#d8a24f") : "#d8a24f";
  const hook = useMemo(() => (entry ? pickHook(detail, entry, locale, seed) : null), [detail, entry, locale, seed]);
  const svg = useMemo(
    () => (entry ? fingerprintSvg({ ...entry, keywordsZh: entry.keywordsZh ?? [] }, { size: 148, color }) : ""),
    [entry, color],
  );

  if (!open) return null;

  const name = entry ? pickName(entry.names, locale) : "";
  const keywords = (locale === "en" && entry?.keywordsEn?.length ? entry.keywordsEn : entry?.keywordsZh) ?? [];

  const visit = () => {
    if (!entry) return;
    selectPhilosopher(entry.id);
    toggle();
  };

  return (
    <div className="random-encounter" role="dialog" aria-modal="true" aria-label={t("random.aria")}>
      <div className="random-encounter__stage">
        <button ref={closeRef} className="random-encounter__close" onClick={toggle} aria-label={t("common.close")}>
          ×
        </button>

        {!entry ? (
          <p className="random-encounter__dim">{t("random.loading")}</p>
        ) : stage === "riddle" ? (
          <>
            <p className="random-encounter__label">
              {hook?.kind === "question" ? t("random.asked") : t("random.knownFor")}
            </p>
            <p className="random-encounter__question">{hook?.text}</p>
            <div className="random-encounter__actions">
              <button className="random-encounter__chip" onClick={() => setStage("card")}>
                {t("random.reveal")}
              </button>
              <button className="random-encounter__chip" onClick={roll}>
                {t("random.again")}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="random-encounter__card">
              {/* 指纹是装饰：信息由右侧文本承担，SVG 自身 aria-hidden */}
              <div className="random-encounter__fp" dangerouslySetInnerHTML={{ __html: svg }} />
              <div>
                <h2 className="random-encounter__name" style={{ color }}>
                  {name}
                </h2>
                <p className="random-encounter__life">
                  {entry.names.en} · {entry.life.display}
                </p>
                <p className="random-encounter__one">
                  {pickText(entry as unknown as Record<string, unknown>, "oneLine", locale)}
                </p>
                <ul className="random-encounter__kw">
                  {keywords.slice(0, 5).map((keyword) => (
                    <li key={keyword}>{keyword}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="random-encounter__actions">
              <button className="random-encounter__chip random-encounter__chip--primary" onClick={visit}>
                {t("random.visit")}
              </button>
              <button className="random-encounter__chip" onClick={roll}>
                {t("random.again")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
