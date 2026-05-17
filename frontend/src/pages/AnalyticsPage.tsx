import { useEffect, useMemo, useState } from 'react'
import {
    getPracticalAnalytics,
    getPracticalLabelAnalytics,
    getTestAnalytics,
    getTestLabelAnalytics,
} from '../features/analytics/analyticsApi'
import type {
    PracticalSkillAnalytics,
    PracticalSkillLabelAnalytics,
    TestAnalytics,
    TestLabelAnalytics,
} from '../types/analytics'
import { getLabels } from '../features/tests/testApi'
import type { LabelResponse } from '../types/test'

type AnalyticsState = {
    tests: TestAnalytics
    testLabels: TestLabelAnalytics[]
    practical: PracticalSkillAnalytics
    practicalLabels: PracticalSkillLabelAnalytics[]
}

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
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg">
            <p className="text-sm uppercase tracking-wide text-zinc-500">{title}</p>
            <p className="mt-3 text-3xl font-bold text-white">{value}</p>
            <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>
        </div>
    )
}

function ProgressBar({ value }: { value: number }) {
    const safeValue = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0))

    return (
        <div className="h-2 w-full rounded-full bg-zinc-800">
            <div className="h-2 rounded-full bg-red-500" style={{ width: `${safeValue}%` }} />
        </div>
    )
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsState | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [labels, setLabels] = useState<LabelResponse[]>([])

    useEffect(() => {
        Promise.all([
            getTestAnalytics(),
            getTestLabelAnalytics(),
            getPracticalAnalytics(),
            getPracticalLabelAnalytics(),
            getLabels(),
        ])
            .then(([tests, testLabels, practical, practicalLabels, labels]) => {
                setData({ tests, testLabels, practical, practicalLabels })
                setLabels(labels)
            })
            .catch(() => setError('Failed to load analytics data'))
            .finally(() => setLoading(false))
    }, [])

    const weakestTestLabels = useMemo(() => {
        return [...(data?.testLabels ?? [])]
            .sort((a, b) => a.averageScore - b.averageScore)
            .slice(0, 5)
    }, [data])

    const weakestPracticalLabels = useMemo(() => {
        return [...(data?.practicalLabels ?? [])]
            .sort((a, b) => a.averageScore - b.averageScore)
            .slice(0, 5)
    }, [data])

    if (loading) {
        return <div className="text-zinc-300">Loading analytics...</div>
    }

    if (error || !data) {
        return (
            <div className="rounded-2xl border border-red-900 bg-red-950/30 p-6 text-red-200">
                {error || 'Analytics unavailable'}
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <section>
                <h1 className="text-3xl font-bold text-white">Training Analytics</h1>
                <p className="mt-2 text-zinc-400">
                    Real statistics for knowledge tests, practical skills, pass rates, and weak training areas.
                </p>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Test Attempts"
                    value={data.tests.totalAttempts}
                    subtitle="Total knowledge test attempts"
                />
                <StatCard
                    title="Average Test Score"
                    value={formatPercent(data.tests.averageScore)}
                    subtitle="Mean result across test attempts"
                />
                <StatCard
                    title="Test Pass Rate"
                    value={formatPercent(data.tests.passRate)}
                    subtitle={`${data.tests.passedCount} passed / ${data.tests.failedCount} failed`}
                />
                <StatCard
                    title="Practical Evaluations"
                    value={data.practical.totalEvaluations}
                    subtitle="Total practical skill assessments"
                />
                <StatCard
                    title="Average Practical Score"
                    value={formatPercent(data.practical.averageScore)}
                    subtitle="Mean practical performance"
                />
                <StatCard
                    title="Practical Pass Rate"
                    value={formatPercent(data.practical.passRate)}
                    subtitle={`${data.practical.passedCount} passed / ${data.practical.failedCount} failed`}
                />
                <StatCard
                    title="Test Labels"
                    value={labels.length}
                    subtitle="Knowledge areas tracked"
                />
                <StatCard
                    title="Practical Labels"
                    value={labels.length}
                    subtitle="Skill categories tracked"
                />
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6">
                    <h2 className="text-xl font-semibold text-white">Test Performance by Label</h2>
                    <div className="mt-6 space-y-4">
                        {data.testLabels.length === 0 ? (
                            <p className="text-zinc-400">No test label analytics yet.</p>
                        ) : (
                            data.testLabels.map((label) => (
                                <div key={label.labelId} className="space-y-2">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-medium text-white">{label.labelName}</p>
                                            <p className="text-sm text-zinc-500">{label.attemptsCount} attempts</p>
                                        </div>
                                        <p className="font-semibold text-red-400">
                                            {formatPercent(label.averageScore)}
                                        </p>
                                    </div>
                                    <ProgressBar value={label.averageScore} />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6">
                    <h2 className="text-xl font-semibold text-white">Practical Performance by Label</h2>
                    <div className="mt-6 space-y-4">
                        {data.practicalLabels.length === 0 ? (
                            <p className="text-zinc-400">No practical skill analytics yet.</p>
                        ) : (
                            data.practicalLabels.map((label) => (
                                <div key={label.labelId} className="space-y-2">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-medium text-white">{label.labelName}</p>
                                            <p className="text-sm text-zinc-500">
                                                {label.evaluationsCount} evaluations
                                            </p>
                                        </div>
                                        <p className="font-semibold text-red-400">
                                            {formatPercent(label.averageScore)}
                                        </p>
                                    </div>
                                    <ProgressBar value={label.averageScore} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6">
                    <h2 className="text-xl font-semibold text-white">Weak Test Areas</h2>
                    <div className="mt-4 space-y-3">
                        {weakestTestLabels.length === 0 ? (
                            <p className="text-zinc-400">No weak test areas detected yet.</p>
                        ) : (
                            weakestTestLabels.map((label) => (
                                <div
                                    key={label.labelId}
                                    className="flex items-center justify-between rounded-xl bg-zinc-950/60 p-4"
                                >
                                    <span className="text-zinc-200">{label.labelName}</span>
                                    <span className="font-semibold text-red-400">
                    {formatPercent(label.averageScore)}
                  </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6">
                    <h2 className="text-xl font-semibold text-white">Weak Practical Areas</h2>
                    <div className="mt-4 space-y-3">
                        {weakestPracticalLabels.length === 0 ? (
                            <p className="text-zinc-400">No weak practical areas detected yet.</p>
                        ) : (
                            weakestPracticalLabels.map((label) => (
                                <div
                                    key={label.labelId}
                                    className="flex items-center justify-between rounded-xl bg-zinc-950/60 p-4"
                                >
                                    <span className="text-zinc-200">{label.labelName}</span>
                                    <span className="font-semibold text-red-400">
                    {formatPercent(label.averageScore)}
                  </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}