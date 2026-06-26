type LoadingScreenProps = {
  error?: string | null;
};

export function LoadingScreen({ error }: LoadingScreenProps) {
  return (
    <div className="loading-screen" role={error ? "alert" : "status"}>
      <div className="loading-card">
        <div className="loading-title">群星闪耀时</div>
        <div>{error ? `数据载入失败：${error}` : "正在点亮思想星图..."}</div>
      </div>
    </div>
  );
}
