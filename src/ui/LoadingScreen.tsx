import { useT } from "../i18n";

type LoadingScreenProps = {
  error?: string | null;
};

export function LoadingScreen({ error }: LoadingScreenProps) {
  const t = useT();
  return (
    <div className="loading-screen" role={error ? "alert" : "status"}>
      <div className="loading-card">
        <div className="loading-title">{t("brand.title")}</div>
        <div>{error ? t("loading.error", { error }) : t("loading.progress")}</div>
      </div>
    </div>
  );
}
