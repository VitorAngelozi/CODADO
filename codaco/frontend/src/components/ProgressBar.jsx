function ProgressBar({ current, total, colorClass }) {
  const progress = total > 0 ? (current / total) * 100 : 0

  return (
    <div>
      <div className="mb-2 flex justify-between text-sm font-semibold text-slate-600">
        <span>{`Pergunta ${current} de ${total}`}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar

