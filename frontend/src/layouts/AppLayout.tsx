import { NavLink, Outlet } from 'react-router-dom'

const links = [
    ['Dashboard', '/dashboard', 'HOME'],
    ['TCCC Scenarios', '/scenarios', 'LIVE'],
    ['Tests', '/tests', 'CBT'],
    ['Practical Skills', '/practical', 'LAB'],
    ['Analytics', '/analytics', 'DATA'],
]

export default function AppLayout() {
    return (
        <div className="flex min-h-screen text-white">
            <aside className="fixed left-0 top-0 h-screen w-80 border-r border-zinc-800 bg-black/70 p-6 backdrop-blur-xl">
                <div className="mb-10">
                    <div className="text-3xl font-black tracking-tight text-red-600">
                        CombatMed
                    </div>
                    <div className="mt-1 text-sm text-zinc-500">
                        TCCC Training Platform
                    </div>
                </div>

                <nav className="space-y-2">
                    {links.map(([label, path, tag]) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                `flex items-center justify-between rounded-2xl border px-4 py-4 transition ${
                                    isActive
                                        ? 'border-red-800 bg-red-950/40 text-white'
                                        : 'border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800'
                                }`
                            }
                        >
                            <span className="font-medium">{label}</span>
                            <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                {tag}
              </span>
                        </NavLink>
                    ))}
                </nav>

                <button
                    onClick={() => {
                        localStorage.removeItem('token')
                        window.location.href = '/'
                    }}
                    className="absolute bottom-6 left-6 right-6 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 font-semibold text-zinc-300 hover:bg-zinc-800"
                >
                    Logout
                </button>
            </aside>

            <main className="ml-80 min-h-screen flex-1 p-8">
                <Outlet />
            </main>
        </div>
    )
}