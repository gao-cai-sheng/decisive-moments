import { useEffect } from "react";
import {
  getArgumentIndex,
  getPhilosopher,
  getPhilosopherIndex,
  getRelationships,
  getThemes,
  getWorks,
} from "../data/client";
import { useT } from "../i18n";
import { SceneErrorBoundary } from "../scene/SceneErrorBoundary";
import { StarScene } from "../scene/StarScene";
import { hasWebGlSupport } from "../scene/webglSupport";
import { useAppStore } from "../store/appStore";
import { CollectionsDrawer } from "./CollectionsDrawer";
import { LoadingScreen } from "./LoadingScreen";
import { Onboarding } from "./Onboarding";
import { PhilosopherPanel } from "./PhilosopherPanel";
import { SearchPanel } from "./SearchPanel";
import { SettingsPanel } from "./SettingsPanel";
import { ThoughtInfographic } from "./ThoughtInfographic";
import { TopHud } from "./TopHud";

export function AppShell() {
  const t = useT();
  const loaded = useAppStore((state) => state.loaded);
  const loadError = useAppStore((state) => state.loadError);
  const selectedPhilosopherId = useAppStore((state) => state.selectedPhilosopherId);
  const selectedPhilosopher = useAppStore((state) => state.selectedPhilosopher);
  const selectedThoughtProblemId = useAppStore((state) => state.selectedThoughtProblemId);
  const setBootstrapData = useAppStore((state) => state.setBootstrapData);
  const setLoadError = useAppStore((state) => state.setLoadError);
  const setSelectedPhilosopher = useAppStore((state) => state.setSelectedPhilosopher);

  useEffect(() => {
    Promise.all([getPhilosopherIndex(), getThemes(), getRelationships(), getArgumentIndex(), getWorks()])
      .then(([philosophers, themes, relationships, argumentsIndex, works]) =>
        setBootstrapData({ philosophers, themes, relationships, argumentsIndex, works }),
      )
      .catch((error) => setLoadError(error instanceof Error ? error.message : String(error)));
  }, [setBootstrapData, setLoadError]);

  useEffect(() => {
    if (!selectedPhilosopherId) {
      setSelectedPhilosopher(null);
      return;
    }
    // 竞态守卫：快速切换/取消选中时，迟到的 detail 响应不得复活已关闭的面板
    let cancelled = false;
    getPhilosopher(selectedPhilosopherId)
      .then((philosopher) => {
        if (!cancelled) setSelectedPhilosopher(philosopher);
      })
      .catch((error) => console.error("Failed to load philosopher", error));
    return () => {
      cancelled = true;
    };
  }, [selectedPhilosopherId, setSelectedPhilosopher]);

  if (loadError) return <LoadingScreen error={loadError} />;
  if (!loaded) return <LoadingScreen />;
  if (!hasWebGlSupport()) return <LoadingScreen error={t("loading.noWebgl")} />;

  return (
    <main className="app">
      <SceneErrorBoundary>
        <StarScene />
      </SceneErrorBoundary>
      <TopHud />
      <SearchPanel />
      {/* 信息图打开时隐藏右栏面板，防止其透过半透明遮罩形成鬼影叠字 */}
      {selectedPhilosopher && !selectedThoughtProblemId && <PhilosopherPanel philosopher={selectedPhilosopher} />}
      {selectedPhilosopher && <ThoughtInfographic philosopher={selectedPhilosopher} />}
      <CollectionsDrawer />
      <SettingsPanel />
      <Onboarding />
    </main>
  );
}
