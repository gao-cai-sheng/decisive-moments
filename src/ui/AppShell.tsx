import { useEffect } from "react";
import {
  getArgumentIndex,
  getPhilosopher,
  getPhilosopherIndex,
  getRelationships,
  getThemes,
  getWorks,
} from "../data/client";
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
    getPhilosopher(selectedPhilosopherId)
      .then(setSelectedPhilosopher)
      .catch((error) => console.error("Failed to load philosopher", error));
  }, [selectedPhilosopherId, setSelectedPhilosopher]);

  if (loadError) return <LoadingScreen error={loadError} />;
  if (!loaded) return <LoadingScreen />;
  if (!hasWebGlSupport()) return <LoadingScreen error="此设备或浏览器没有可用的 WebGL，无法渲染思想星图。" />;

  return (
    <main className="app">
      <StarScene />
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
