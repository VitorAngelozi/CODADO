interface LoadingStateProps {
  label?: string
}

function LoadingState({ label = 'Carregando...' }: LoadingStateProps) {
  return (
    <div className="mx-auto mt-10 w-full max-w-xl rounded-3xl border border-white/70 bg-white p-8 text-center shadow-lg shadow-slate-200/70">
      <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
      <p className="font-semibold text-slate-700">{label}</p>
    </div>
  )
}

export default LoadingState
