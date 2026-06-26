import { useState } from "react";

const storageKey = "qunxing-onboarded-v1";
const steps = [
  ["哲人如星", "每颗星代表一位哲人，文明、时代与主题共同塑造星图位置。"],
  ["搜命题", "搜索正义、死亡、自由等问题，可以看到相关哲人与精选论述。"],
  ["留札记", "收藏哲人和论述，在本机写下自己的思想札记。"],
];

export function Onboarding() {
  const [step, setStep] = useState(() => (localStorage.getItem(storageKey) ? -1 : 0));
  if (step < 0) return null;

  const close = () => {
    localStorage.setItem(storageKey, "1");
    setStep(-1);
  };
  const [title, body] = steps[step];

  return (
    <div className="onboarding-overlay">
      <section className="onboarding-card">
        <div className="muted">
          {step + 1} / {steps.length}
        </div>
        <h2>{title}</h2>
        <p>{body}</p>
        <button className="hud-button" type="button" onClick={close}>
          跳过
        </button>
        <button
          className="hud-button onboarding-primary"
          type="button"
          onClick={() => (step === steps.length - 1 ? close() : setStep(step + 1))}
        >
          {step === steps.length - 1 ? "开始漫游" : "下一步"}
        </button>
      </section>
    </div>
  );
}
