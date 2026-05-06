function ErrorState({ message, onRetry }) {
  return (
    <div className="mx-auto mt-10 w-full max-w-xl rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center shadow-lg shadow-rose-100">
      <h3 className="font-display text-2xl font-bold text-rose-700">Ops, algo deu errado</h3>
      <p className="mt-2 text-rose-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 rounded-xl bg-rose-600 px-5 py-2 font-semibold text-white transition hover:bg-rose-700"
        >
          Tentar novamente
        </button>
      )}
    </div>
  )
}

export default ErrorState

