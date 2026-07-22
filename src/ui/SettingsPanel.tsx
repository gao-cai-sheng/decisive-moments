import { useT } from "../i18n";
import { useAppStore } from "../store/appStore";

export function SettingsPanel() {
  const t = useT();
  const open = useAppStore((state) => state.settingsOpen);
  const quality = useAppStore((state) => state.quality);
  const setQuality = useAppStore((state) => state.setQuality);
  const locale = useAppStore((state) => state.locale);
  const setLocale = useAppStore((state) => state.setLocale);
  const toggleSettings = useAppStore((state) => state.toggleSettings);

  if (!open) return null;

  return (
    <aside className="panel" aria-label={t("settings.title")}>
      <button className="hud-button panel-close" type="button" onClick={toggleSettings}>
        {t("common.close")}
      </button>
      <h2>{t("settings.title")}</h2>
      <h3>{t("settings.quality")}</h3>
      <button className="hud-button" type="button" onClick={() => setQuality(quality === "high" ? "low" : "high")}>
        {t("settings.qualityCurrent", {
          quality: quality === "high" ? t("settings.qualityHigh") : t("settings.qualityLow"),
        })}
      </button>
      <h3>{t("settings.language")}</h3>
      <div className="result-actions">
        {/* 语言名用各自母语显示，不随界面语言翻译 */}
        <button className="hud-button" type="button" aria-pressed={locale === "zh"} onClick={() => setLocale("zh")}>
          中文
        </button>
        <button className="hud-button" type="button" aria-pressed={locale === "en"} onClick={() => setLocale("en")}>
          English
        </button>
      </div>
      <h3>{t("settings.dataNote")}</h3>
      <p className="muted">{t("settings.dataNoteBody")}</p>
    </aside>
  );
}
