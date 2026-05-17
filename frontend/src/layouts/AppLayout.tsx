import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { getCurrentUser } from '../features/auth/authApi'

type LinkItem = [string, string, string]

function isCadetRole(role: string) {
    return role === 'CADET' || role === 'COMBAT MEDIC'
}

function isInstructorRole(role: string) {
    return role === 'INSTRUCTOR' || role === 'ADMIN'
}

export default function AppLayout() {
    const navigate = useNavigate()
    const [role, setRole] = useState('')
    const [username, setUsername] = useState('')

    useEffect(() => {
        getCurrentUser()
            .then((user) => {
                setRole(user.role)
                setUsername(user.username)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    const links = useMemo<LinkItem[]>(() => {
        const cadet = isCadetRole(role)
        const instructor = isInstructorRole(role)

        const baseLinks: LinkItem[] = [
            ['Dashboard', '/dashboard', 'HOME'],
            ['TCCC Scenarios', '/scenarios', 'LIVE'],
            ['Tests', '/tests', 'CBT'],
            ['Practical Skills', '/practical', 'LAB'],
            ['Analytics', '/analytics', 'DATA'],
        ]

        const filteredLinks = baseLinks.filter(([, path]) => {
            if (cadet && (path === '/dashboard' || path === '/analytics')) {
                return false
            }

            return true
        })

        filteredLinks.push([
            cadet ? 'My Progress' : instructor ? 'Cadet Analytics' : 'Profile',
            '/profile',
            cadet ? 'CADET' : instructor ? 'GROUP' : 'USER',
        ])

        return filteredLinks
    }, [role])

    function handleLogout() {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-[360px] border-r border-zinc-800 bg-black px-6 py-8 lg:flex lg:flex-col">
                <div className="shrink-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.45em] text-red-500">
                        CombatMed
                    </p>
                    <h1 className="mt-4 text-3xl font-black tracking-tight text-white">
                        CombatMed
                    </h1>
                    <p className="mt-2 text-sm text-zinc-500">TCCC Training Platform</p>
                </div>

                <nav className="mt-10 flex-1 space-y-3 overflow-y-auto pr-1">
                    {links.map(([label, path, badge]) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                `group flex items-center justify-between rounded-2xl border px-5 py-4 text-base font-semibold transition ${
                                    isActive
                                        ? 'border-red-700 bg-red-950/25 text-white shadow-[0_0_35px_rgba(185,28,28,0.18)]'
                                        : 'border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900 hover:text-white'
                                }`
                            }
                        >
                            <span>{label}</span>
                            <span className="rounded-full bg-zinc-800 px-4 py-1 text-xs font-semibold text-zinc-400 group-hover:text-zinc-200">
                {badge}
              </span>
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-6 shrink-0 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5">
                    <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Current user</p>
                    <p className="mt-3 truncate text-lg font-bold text-white">
                        {username || 'Authenticated user'}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">{role || 'Loading role...'}</p>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-5 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:border-red-800 hover:bg-red-950/30 hover:text-white"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            <div className="lg:pl-[360px]">
                <header className="sticky top-0 z-20 border-b border-zinc-800 bg-black/90 px-4 py-4 backdrop-blur lg:hidden">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
                                CombatMed
                            </p>
                            <p className="mt-1 text-sm text-zinc-400">{role || 'Loading role...'}</p>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-300"
                        >
                            Logout
                        </button>
                    </div>

                    <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">
                        {links.map(([label, path]) => (
                            <NavLink
                                key={path}
                                to={path}
                                className={({ isActive }) =>
                                    `whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold ${
                                        isActive ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-400'
                                    }`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                    </nav>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-8 lg:px-10">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}