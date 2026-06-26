import { useAppStore } from "../store/appStore";

export function SettingsPanel() {
  const open = useAppStore((state) => state.settingsOpen);
  const quality = useAppStore((state) => state.quality);
  const setQuality = useAppStore((state) => state.setQuality);
  const toggleSettings = useAppStore((state) => state.toggleSettings);

  if (!open) return null;

  return (
    <aside className="panel" aria-label="设置">
      <button className="hud-button panel-close" type="button" onClick={toggleSettings}>
        关闭
      </button>
      <h2>设置</h2>
      <h3>画质</h3>
      <button className="hud-button" type="button" onClick={() => setQuality(quality === "high" ? "low" : "high")}>
        当前：{quality === "high" ? "高画质" : "低画质"}
      </button>
      <h3>数据说明</h3>
      <p className="muted">草稿内容用于产品验证，已审核内容才作为正式资料展示。</p>
    </aside>
  );
}
