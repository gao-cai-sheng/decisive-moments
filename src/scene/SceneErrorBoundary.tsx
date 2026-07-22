import { Component, Fragment, type ReactNode } from "react";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 600;

type SceneErrorBoundaryProps = { children: ReactNode };
type SceneErrorBoundaryState = { failed: boolean; generation: number };

// WebGL 上下文丢失（GPU 内存压力下浏览器会主动回收）会让 r3f 的 CanvasImpl 抛错；
// 没有边界时 React 卸载整棵树、应用变黑屏且无法恢复。
// 这里捕获后以新 key 重挂场景，让 three 重建上下文；连续失败超过上限则提示刷新。
export class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, SceneErrorBoundaryState> {
  state: SceneErrorBoundaryState = { failed: false, generation: 0 };
  private retryTimer: ReturnType<typeof setTimeout> | null = null;

  static getDerivedStateFromError(): Partial<SceneErrorBoundaryState> {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("StarScene 渲染崩溃，准备重挂", error);
    if (this.state.generation >= MAX_RETRIES) return;
    this.retryTimer = setTimeout(() => {
      this.setState((state) => ({ failed: false, generation: state.generation + 1 }));
    }, RETRY_DELAY_MS);
  }

  componentWillUnmount() {
    if (this.retryTimer !== null) clearTimeout(this.retryTimer);
  }

  render() {
    if (this.state.failed) {
      return this.state.generation >= MAX_RETRIES ? (
        <div className="loading-screen">
          <p>星图渲染多次失败，请刷新页面重试。</p>
        </div>
      ) : null;
    }
    return <Fragment key={this.state.generation}>{this.props.children}</Fragment>;
  }
}
