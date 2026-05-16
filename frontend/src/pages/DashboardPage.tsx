export default function DashboardPage() {

    return (
        <div>

            <div className="mb-10">

                <h1 className="text-5xl font-bold">
                    CombatMed Dashboard
                </h1>

                <p className="mt-3 text-zinc-400">
                    Tactical Combat Casualty Care training platform
                </p>

            </div>

            <div className="grid gap-6 lg:grid-cols-4">

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

                    <div className="text-sm text-zinc-400">
                        Active Scenarios
                    </div>

                    <div className="mt-3 text-5xl font-bold text-red-500">
                        12
                    </div>

                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

                    <div className="text-sm text-zinc-400">
                        Cadets
                    </div>

                    <div className="mt-3 text-5xl font-bold">
                        48
                    </div>

                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

                    <div className="text-sm text-zinc-400">
                        Average Accuracy
                    </div>

                    <div className="mt-3 text-5xl font-bold text-emerald-400">
                        84%
                    </div>

                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

                    <div className="text-sm text-zinc-400">
                        Critical Mistakes
                    </div>

                    <div className="mt-3 text-5xl font-bold text-yellow-400">
                        7
                    </div>

                </div>

            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

                    <h2 className="mb-6 text-2xl font-bold">
                        Training Modules
                    </h2>

                    <div className="space-y-4">

                        <div className="rounded-xl bg-zinc-800 p-5">
                            TCCC Scenarios
                        </div>

                        <div className="rounded-xl bg-zinc-800 p-5">
                            Practical Skills
                        </div>

                        <div className="rounded-xl bg-zinc-800 p-5">
                            Knowledge Tests
                        </div>

                        <div className="rounded-xl bg-zinc-800 p-5">
                            Group Analytics
                        </div>

                    </div>

                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

                    <h2 className="mb-6 text-2xl font-bold">
                        System Status
                    </h2>

                    <div className="space-y-5">

                        <div className="flex items-center justify-between">

              <span className="text-zinc-400">
                Backend API
              </span>

                            <span className="rounded bg-emerald-700 px-3 py-1 text-sm">
                ONLINE
              </span>

                        </div>

                        <div className="flex items-center justify-between">

              <span className="text-zinc-400">
                Scenario Engine
              </span>

                            <span className="rounded bg-emerald-700 px-3 py-1 text-sm">
                ACTIVE
              </span>

                        </div>

                        <div className="flex items-center justify-between">

              <span className="text-zinc-400">
                PostgreSQL
              </span>

                            <span className="rounded bg-emerald-700 px-3 py-1 text-sm">
                CONNECTED
              </span>

                        </div>

                        <div className="flex items-center justify-between">

              <span className="text-zinc-400">
                Simulation Runtime
              </span>

                            <span className="rounded bg-emerald-700 px-3 py-1 text-sm">
                READY
              </span>

                        </div>

                    </div>

                </div>

            </div>

            <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

                <div className="mb-6 flex items-center justify-between">

                    <h2 className="text-2xl font-bold">
                        Recent Training Activity
                    </h2>

                    <span className="rounded bg-zinc-800 px-3 py-1 text-sm text-zinc-400">
      LIVE FEED
    </span>

                </div>

                <div className="space-y-4">

                    <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-800/50 p-4">

                        <div>
                            <div className="font-semibold">
                                Blast Injury Scenario
                            </div>

                            <div className="mt-1 text-sm text-zinc-400">
                                Cadet #12 completed TCCC intervention
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-lg font-bold text-emerald-400">
                                92%
                            </div>

                            <div className="text-xs text-zinc-500">
                                accuracy
                            </div>
                        </div>

                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-800/50 p-4">

                        <div>
                            <div className="font-semibold">
                                Airway Management Drill
                            </div>

                            <div className="mt-1 text-sm text-zinc-400">
                                Practical skill evaluation completed
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-lg font-bold text-yellow-400">
                                3
                            </div>

                            <div className="text-xs text-zinc-500">
                                mistakes
                            </div>
                        </div>

                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-800/50 p-4">

                        <div>
                            <div className="font-semibold">
                                Hemorrhage Control Test
                            </div>

                            <div className="mt-1 text-sm text-zinc-400">
                                Group Bravo knowledge assessment
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-lg font-bold text-cyan-400">
                                48
                            </div>

                            <div className="text-xs text-zinc-500">
                                cadets
                            </div>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}