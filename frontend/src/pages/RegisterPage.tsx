import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../auth/authApi'
import type { RegisterRequest } from '../types/auth'

export default function RegisterPage() {
    const navigate = useNavigate()

    const [form, setForm] = useState<RegisterRequest>({
        username: '',
        email: '',
        password: '',
        role: 'CADET',
    })

    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    function updateField<K extends keyof RegisterRequest>(
        field: K,
        value: RegisterRequest[K],
    ) {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')

        if (!form.username.trim()) {
            setError('Username is required')
            return
        }

        if (!form.email.trim()) {
            setError('Email is required')
            return
        }

        if (form.password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        if (form.password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        try {
            setLoading(true)

            const response = await register({
                username: form.username.trim(),
                email: form.email.trim(),
                password: form.password,
                role: form.role,
            })

            localStorage.setItem('token', response.token)
            navigate('/dashboard')
        } catch (err) {
            console.error(err)
            setError('Registration failed. Check your data and try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl">
                <div className="mb-8">
                    <p className="text-sm uppercase tracking-[0.35em] text-red-500">CombatMed</p>
                    <h1 className="mt-3 text-3xl font-bold">Create account</h1>
                    <p className="mt-2 text-sm text-zinc-400">
                        Register as a cadet or instructor for tactical medicine training.
                    </p>
                </div>

                {error && (
                    <div className="mb-5 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">Username</label>
                        <input
                            value={form.username}
                            onChange={(event) => updateField('username', event.target.value)}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            placeholder="cadet01"
                            autoComplete="username"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">Email</label>
                        <input
                            value={form.email}
                            onChange={(event) => updateField('email', event.target.value)}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            placeholder="cadet@example.com"
                            type="email"
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">Role</label>
                        <select
                            value={form.role}
                            onChange={(event) =>
                                updateField('role', event.target.value as RegisterRequest['role'])
                            }
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                        >
                            <option value="CADET">Cadet</option>
                            <option value="INSTRUCTOR">Instructor</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">Password</label>
                        <input
                            value={form.password}
                            onChange={(event) => updateField('password', event.target.value)}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            placeholder="••••••••"
                            type="password"
                            autoComplete="new-password"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">Confirm password</label>
                        <input
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            placeholder="••••••••"
                            type="password"
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-red-400 hover:text-red-300">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}