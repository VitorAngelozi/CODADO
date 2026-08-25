import { useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import { login, register, type AuthUser } from '../lib/api'

interface AuthPageProps {
  onAuthenticated: (user: AuthUser) => void
}

function AuthPage({ onAuthenticated }: AuthPageProps) {
  const [isRegistering, setIsRegistering] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const user = isRegistering ? await register(name, email, password) : await login(email, password)
      onAuthenticated(user)
    } catch (requestError: unknown) {
      const message = axios.isAxiosError(requestError)
        ? requestError.response?.data?.error ?? 'falha na autenticacao'
        : 'falha na autenticacao'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <section className="terminal-panel scanline w-full max-w-md px-6 py-7">
        <p className="ascii-muted text-xs tracking-[0.22em]">[ CODADO AUTH ]</p>
        <h1 className="mt-3 font-display text-4xl tracking-[0.1em] text-[var(--text)]">{isRegistering ? 'CRIAR ACESSO' : 'ENTRAR NO SISTEMA'}</h1>
        <p className="ascii-muted mt-2 text-xs tracking-[0.12em]">sessao protegida por PostgreSQL</p>

        <form className="mt-7 space-y-4" onSubmit={submit}>
          {isRegistering && (
            <label className="block text-xs tracking-[0.1em] text-[var(--muted)]">
              NOME
              <input className="mt-2 w-full border border-[var(--border)] bg-black/30 px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" value={name} onChange={(event) => setName(event.target.value)} required />
            </label>
          )}
          <label className="block text-xs tracking-[0.1em] text-[var(--muted)]">
            EMAIL
            <input type="email" className="mt-2 w-full border border-[var(--border)] bg-black/30 px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="block text-xs tracking-[0.1em] text-[var(--muted)]">
            SENHA
            <input type="password" minLength={8} className="mt-2 w-full border border-[var(--border)] bg-black/30 px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full border border-[var(--accent)] px-4 py-3 text-xs font-bold tracking-[0.14em] text-[var(--accent)] transition hover:bg-[rgba(162,247,193,0.1)] disabled:opacity-50">
            {isSubmitting ? 'PROCESSANDO...' : isRegistering ? 'CRIAR CONTA' : 'AUTENTICAR'}
          </button>
        </form>

        <button type="button" className="mt-5 text-xs tracking-[0.08em] text-[var(--muted)] underline underline-offset-4 hover:text-[var(--text)]" onClick={() => { setIsRegistering((value) => !value); setError('') }}>
          {isRegistering ? 'Ja possui acesso? Entrar' : 'Primeiro acesso? Criar conta'}
        </button>
      </section>
    </main>
  )
}

export default AuthPage