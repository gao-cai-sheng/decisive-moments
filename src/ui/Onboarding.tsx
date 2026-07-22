import { useState } from "react";
import { useT, type MessageKey } from "../i18n";

const storageKey = "qunxing-onboarded-v1";
const steps: [MessageKey, MessageKey][] = [
  ["onboarding.step1.title", "onboarding.step1.body"],
  ["onboarding.step2.title", "onboarding.step2.body"],
  ["onboarding.step3.title", "onboarding.step3.body"],
];

export function Onboarding() {
  const t = useT();
  const [step, setStep] = useState(() => (localStorage.getItem(storageKey) ? -1 : 0));
  if (step < 0) return null;

  const close = () => {
    localStorage.setItem(storageKey, "1");
    setStep(-1);
  };
  const [titleKey, bodyKey] = steps[step];

  return (
    <div className="onboarding-overlay">
      <section className="onboarding-card">
        <div className="muted">
          {step + 1} / {steps.length}
        </div>
        <h2>{t(titleKey)}</h2>
        <p>{t(bodyKey)}</p>
        <button className="hud-button" type="button" onClick={close}>
          {t("onboarding.skip")}
        </button>
        <button
          className="hud-button onboarding-primary"
          type="button"
          onClick={() => (step === steps.length - 1 ? close() : setStep(step + 1))}
        >
          {step === steps.length - 1 ? t("onboarding.start") : t("onboarding.next")}
        </button>
      </section>
    </div>
  );
}
