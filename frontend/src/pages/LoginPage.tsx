import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../auth/authApi'

export default function LoginPage() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')

        if (!username.trim() || !password.trim()) {
            setError('Username and password are required')
            return
        }

        try {
            setLoading(true)

            const response = await login({
                username: username.trim(),
                password,
            })

            localStorage.setItem('token', response.token)
            navigate('/dashboard')
        } catch (err) {
            console.error(err)
            setError('Login failed. Check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl">
                <div className="mb-8">
                    <p className="text-sm uppercase tracking-[0.35em] text-red-500">CombatMed</p>
                    <h1 className="mt-3 text-3xl font-bold">Sign in</h1>
                    <p className="mt-2 text-sm text-zinc-400">Tactical medicine training console</p>
                </div>

                {error && (
                    <div className="mb-5 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">Username</label>
                        <input
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            placeholder="username"
                            autoComplete="username"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">Password</label>
                        <input
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            placeholder="••••••••"
                            type="password"
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Authenticating...' : 'Enter Platform'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-400">
                    No account yet?{' '}
                    <Link to="/register" className="font-medium text-red-400 hover:text-red-300">
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    )
}