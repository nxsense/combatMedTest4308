import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { login } from '../auth/authApi'

export default function LoginPage() {

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)

    async function handleLogin() {

        try {

            setLoading(true)

            const response = await login({
                username,
                password,
            })

            localStorage.setItem(
                'token',
                response.token,
            )

            navigate('/dashboard')

        } catch (error) {

            console.error(error)

            alert('Login failed')

        } finally {

            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-6 text-white">
            <div className="card w-full max-w-md p-8">
                <div className="mb-8">
                    <h1 className="text-5xl font-black text-red-600">
                        CombatMed
                    </h1>
                    <p className="mt-2 text-zinc-400">
                        Tactical medicine training console
                    </p>
                </div>

                <div className="space-y-4">
                    <input
                        className="input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        className="input"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="btn-primary w-full"
                    >
                        {loading ? 'Authenticating...' : 'Enter Platform'}
                    </button>
                </div>
            </div>
        </div>
    )
}