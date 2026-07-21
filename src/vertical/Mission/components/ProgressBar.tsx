export function ProgressBar({ progress }: { progress: number }) {
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <section className="progress-bar">
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${safeProgress}%` }}
        />
      </div>
      <span>{Math.round(safeProgress)}%</span>
    </section>
  );
}
