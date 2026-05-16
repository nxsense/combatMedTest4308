import { useEffect, useState } from 'react'
import { getDashboardAnalytics } from '../features/analytics/analyticsApi'
import type { DashboardAnalytics } from '../types/analytics'

function formatPercent(value: number) {
    return `${Number.isFinite(value) ? value.toFixed(1) : '0.0'}%`
}

function StatCard({
                      title,
                      value,
                      subtitle,
                  }: {
    title: string
    value: string | number
    subtitle: string
}) {
    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-md">
            <p className="text-xs uppercase tracking-wide text-zinc-500">{title}</p>
            <p className="mt-2 text-2xl font-bold text-white">{value}</p>
            <p className="mt-1 text-xs text-zinc-400">{subtitle}</p>
        </div>
    )
}

export default function DashboardPage() {
    const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        getDashboardAnalytics()
            .then(setAnalytics)
            .catch(() => setError('Failed to load dashboard analytics'))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <div className="text-zinc-300">Loading dashboard...</div>
    }

    if (error || !analytics) {
        return (
            <div className="rounded-2xl border border-red-900 bg-red-950/30 p-6 text-red-200">
                {error || 'Dashboard analytics unavailable'}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-3xl font-bold text-white">CombatMed Dashboard</h1>
                <p className="mt-2 text-zinc-400">
                    Tactical Combat Casualty Care training platform with real simulator statistics.
                </p>
            </section>

            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <StatCard
                    title="Cadets"
                    value={analytics.totalCadets}
                    subtitle="Registered trainees"
                />

                <StatCard
                    title="Instructors"
                    value={analytics.totalInstructors}
                    subtitle="Training supervisors"
                />

                <StatCard
                    title="Scenarios"
                    value={analytics.totalScenarios}
                    subtitle="Available TCCC scenarios"
                />

                <StatCard
                    title="Active Sessions"
                    value={analytics.activeSessions}
                    subtitle="Currently running simulations"
                />

                <StatCard
                    title="Completed Sessions"
                    value={analytics.completedSessions}
                    subtitle="Finished scenario attempts"
                />

                <StatCard
                    title="Scenario Score"
                    value={formatPercent(analytics.averageScenarioScore)}
                    subtitle="Average simulator result"
                />

                <StatCard
                    title="Test Pass Rate"
                    value={formatPercent(analytics.testPassRate)}
                    subtitle={`${analytics.completedTests} completed tests`}
                />

                <StatCard
                    title="Practical Pass Rate"
                    value={formatPercent(analytics.practicalPassRate)}
                    subtitle={`${analytics.practicalEvaluations} evaluations`}
                />
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                    <h2 className="text-lg font-semibold text-white">Scenario Performance</h2>
                    <p className="mt-3 text-3xl font-bold text-red-400">
                        {formatPercent(analytics.averageScenarioScore)}
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">Average completed scenario score</p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                    <h2 className="text-lg font-semibold text-white">Knowledge Tests</h2>
                    <p className="mt-3 text-3xl font-bold text-red-400">
                        {formatPercent(analytics.averageTestScore)}
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">Average test score</p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                    <h2 className="text-lg font-semibold text-white">Practical Skills</h2>
                    <p className="mt-3 text-3xl font-bold text-red-400">
                        {formatPercent(analytics.averagePracticalScore)}
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">Average practical evaluation score</p>
                </div>
            </section>
        </div>
    )
}