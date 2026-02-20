export default function ProgressBar({ stats, challengeTitle }) {
  const percentage = stats ? Math.round(((stats.completed + stats.compensated) / 30) * 100) : 0;

  return (
    <div
      className="bg-white/80 backdrop-blur-sm border-b border-sand-200 px-4 py-3 sticky top-0 z-30"
    >
      <div className="max-w-2xl mx-auto">
        {/* Title row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🗺️</span>
            <span className="font-display font-bold text-warm-700 text-sm truncate max-w-[160px]">
              {challengeTitle}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-nature-600 font-semibold">
              <span>✅</span> {stats?.completed || 0}
            </span>
            <span className="flex items-center gap-1 text-red-400 font-semibold">
              <span>❌</span> {stats?.missed || 0}
            </span>
            <span className="flex items-center gap-1 text-calm-500 font-semibold">
              <span>🔁</span> {stats?.compensated || 0}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-sand-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-nature-400 to-nature-600 rounded-full relative"
              style={{ width: `${percentage}%` }}
            >
              {percentage > 0 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-nature-500 translate-x-1/2" />
              )}
            </div>
          </div>
          <span className="text-xs font-bold text-warm-600 min-w-[40px] text-right">
            {percentage}%
          </span>
        </div>

        {/* Day count */}
        <div className="flex justify-between text-xs text-warm-400 mt-1">
          <span>اليوم الأول</span>
          <span>{stats?.completed + stats?.compensated || 0} / 30 يوم</span>
          <span>اليوم الثلاثون</span>
        </div>
      </div>
    </div>
  );
}
