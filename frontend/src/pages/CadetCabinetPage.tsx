import { useEffect, useMemo, useState } from 'react'
import { getCurrentUser } from '../features/auth/authApi'
import {
    getCadetPracticalResults,
    getCadetRecommendedTests,
    getCadetTestAnalytics,
    getCadetTestResults,
    getCadetWeakPracticalAreas,
    type CadetAnalyticsResponse,
    type RecommendedTestResponse,
    type WeakAreaResponse,
} from '../features/cadet/cadetApi'
import type { TestResultResponse } from '../types/test'
import type { PracticalResultResponse } from '../types/practical'

function formatPercent(value?: number) {
    return `${Number(value ?? 0).toFixed(1)}%`
}

function formatScore(score?: number, maxScore?: number) {
    return `${score ?? 0} / ${maxScore ?? 0}`
}

function getLabelName(area: WeakAreaResponse) {
    return area.labelName || area.name || 'Unknown area'
}

function getTestTitle(result: TestResultResponse) {
    return result.testTitle || `Test #${result.testId ?? result.id}`
}

function getPracticalTitle(result: PracticalResultResponse) {
    return result.skillName || `Practical skill #${result.skillId ?? result.id}`
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
            <p className="mt-4 text-4xl font-bold text-white">{value}</p>
            <p className="mt-3 text-sm text-zinc-400">{subtitle}</p>
        </div>
    )
}

export default function CadetCabinetPage() {
    const [cadetId, setCadetId] = useState<number | null>(null)
    const [username, setUsername] = useState('')
    const [role, setRole] = useState('')

    const [testAnalytics, setTestAnalytics] = useState<CadetAnalyticsResponse | null>(null)
    const [testResults, setTestResults] = useState<TestResultResponse[]>([])
    const [practicalResults, setPracticalResults] = useState<PracticalResultResponse[]>([])
    const [weakPracticalAreas, setWeakPracticalAreas] = useState<WeakAreaResponse[]>([])
    const [recommendedTests, setRecommendedTests] = useState<RecommendedTestResponse[]>([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadCabinet()
    }, [])

    async function loadCabinet() {
        try {
            setLoading(true)
            setError('')

            const user = await getCurrentUser()

            setUsername(user.username)
            setRole(user.role)

            if (!user.cadetId) {
                setCadetId(null)
                setError('Current user is not linked to a cadet profile.')
                return
            }

            setCadetId(user.cadetId)

            const [
                loadedTestAnalytics,
                loadedTestResults,
                loadedPracticalResults,
                loadedWeakPracticalAreas,
                loadedRecommendedTests,
            ] = await Promise.all([
                getCadetTestAnalytics(user.cadetId),
                getCadetTestResults(user.cadetId),
                getCadetPracticalResults(user.cadetId),
                getCadetWeakPracticalAreas(user.cadetId).catch(() => []),
                getCadetRecommendedTests(user.cadetId).catch(() => []),
            ])

            setTestAnalytics(loadedTestAnalytics)
            setTestResults(loadedTestResults)
            setPracticalResults(loadedPracticalResults)
            setWeakPracticalAreas(loadedWeakPracticalAreas)
            setRecommendedTests(loadedRecommendedTests)
        } catch (error) {
            console.error(error)
            setError('Failed to load cadet cabinet.')
        } finally {
            setLoading(false)
        }
    }

    const practicalAverage = useMemo(() => {
        if (practicalResults.length === 0) return 0

        const total = practicalResults.reduce(
            (sum, result) => sum + Number(result.percentage ?? 0),
            0,
        )

        return total / practicalResults.length
    }, [practicalResults])

    const practicalPassedCount = useMemo(() => {
        return practicalResults.filter((result) =>
            ['PASSED', 'GOOD', 'EXCELLENT'].includes(result.resultStatus ?? ''),
        ).length
    }, [practicalResults])

    const practicalPassRate = useMemo(() => {
        if (practicalResults.length === 0) return 0
        return (practicalPassedCount * 100) / practicalResults.length
    }, [practicalPassedCount, practicalResults.length])

    const weakTestAreas = testAnalytics?.weakLabels ?? []

    if (loading) {
        return <p className="text-zinc-300">Loading cadet cabinet...</p>
    }

    return (
        <div className="space-y-8">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg">
                <p className="text-sm uppercase tracking-wide text-red-400">Cadet Cabinet</p>
                <h1 className="mt-3 text-3xl font-bold text-white">
                    {username || 'Cadet'} Progress Overview
                </h1>
                <p className="mt-2 text-zinc-400">
                    Personal learning progress across knowledge tests, practical skills, weak areas, and
                    recommendations.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-300">
            Role: {role || 'Unknown'}
          </span>
                    <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-300">
            Cadet ID: {cadetId ?? 'Not linked'}
          </span>
                </div>
            </section>

            {error && (
                <div className="rounded-2xl border border-red-900 bg-red-950/30 p-4 text-red-200">
                    {error}
                </div>
            )}

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Test Pass Rate"
                    value={formatPercent(testAnalytics?.passRate)}
                    subtitle={`${testAnalytics?.totalAttempts ?? testResults.length} test attempts`}
                />

                <StatCard
                    title="Test Average"
                    value={formatPercent(testAnalytics?.averageScore)}
                    subtitle={`${testAnalytics?.passedCount ?? 0} passed, ${
                        testAnalytics?.failedCount ?? 0
                    } failed`}
                />

                <StatCard
                    title="Practical Pass Rate"
                    value={formatPercent(practicalPassRate)}
                    subtitle={`${practicalResults.length} evaluations`}
                />

                <StatCard
                    title="Practical Average"
                    value={formatPercent(practicalAverage)}
                    subtitle={`${practicalPassedCount} successful evaluations`}
                />
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg">
                    <h2 className="text-2xl font-bold text-white">Weak Test Areas</h2>

                    {weakTestAreas.length === 0 ? (
                        <p className="mt-4 text-zinc-400">No weak test areas detected yet.</p>
                    ) : (
                        <div className="mt-5 space-y-3">
                            {weakTestAreas.map((area) => (
                                <div
                                    key={getLabelName(area)}
                                    className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="font-semibold text-white">{getLabelName(area)}</p>
                                        <span className="rounded-full bg-red-950/60 px-3 py-1 text-xs text-red-300">
                      {formatPercent(area.averageScore)}
                    </span>
                                    </div>
                                    <p className="mt-2 text-sm text-zinc-500">
                                        Attempts: {area.attemptsCount ?? 0}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg">
                    <h2 className="text-2xl font-bold text-white">Weak Practical Areas</h2>

                    {weakPracticalAreas.length === 0 ? (
                        <p className="mt-4 text-zinc-400">No weak practical areas detected yet.</p>
                    ) : (
                        <div className="mt-5 space-y-3">
                            {weakPracticalAreas.map((area) => (
                                <div
                                    key={getLabelName(area)}
                                    className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="font-semibold text-white">{getLabelName(area)}</p>
                                        <span className="rounded-full bg-red-950/60 px-3 py-1 text-xs text-red-300">
                      {formatPercent(area.averageScore)}
                    </span>
                                    </div>
                                    <p className="mt-2 text-sm text-zinc-500">
                                        Evaluations: {area.evaluationsCount ?? 0}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg">
                    <h2 className="text-2xl font-bold text-white">Recent Test Results</h2>

                    {testResults.length === 0 ? (
                        <p className="mt-4 text-zinc-400">No test attempts yet.</p>
                    ) : (
                        <div className="mt-5 space-y-3">
                            {testResults.slice(0, 6).map((result) => (
                                <div
                                    key={result.id}
                                    className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-semibold text-white">{getTestTitle(result)}</p>
                                            <p className="mt-1 text-sm text-zinc-500">
                                                Score: {formatScore(result.score, result.maxScore)}
                                            </p>
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                result.passed
                                                    ? 'bg-emerald-950/60 text-emerald-300'
                                                    : 'bg-red-950/60 text-red-300'
                                            }`}
                                        >
                      {result.passed ? 'PASSED' : 'FAILED'} ·{' '}
                                            {formatPercent(result.percentage)}
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg">
                    <h2 className="text-2xl font-bold text-white">Recent Practical Results</h2>

                    {practicalResults.length === 0 ? (
                        <p className="mt-4 text-zinc-400">No practical evaluations yet.</p>
                    ) : (
                        <div className="mt-5 space-y-3">
                            {practicalResults.slice(0, 6).map((result) => (
                                <div
                                    key={result.id}
                                    className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-semibold text-white">{getPracticalTitle(result)}</p>
                                            <p className="mt-1 text-sm text-zinc-500">
                                                Score: {formatScore(result.totalScore, result.maxScore)}
                                            </p>
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                result.resultStatus === 'FAILED'
                                                    ? 'bg-red-950/60 text-red-300'
                                                    : 'bg-emerald-950/60 text-emerald-300'
                                            }`}
                                        >
                      {result.resultStatus ?? 'SAVED'} · {formatPercent(result.percentage)}
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg">
                <h2 className="text-2xl font-bold text-white">Recommended Tests</h2>

                {recommendedTests.length === 0 ? (
                    <p className="mt-4 text-zinc-400">
                        No recommendations yet. Complete more tests to generate personalized recommendations.
                    </p>
                ) : (
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {recommendedTests.map((test) => (
                            <article
                                key={test.id}
                                className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                            >
                                <h3 className="font-semibold text-white">{test.title}</h3>
                                <p className="mt-2 text-sm text-zinc-400">{test.description}</p>
                                <p className="mt-3 text-sm text-zinc-500">Max score: {test.maxScore ?? 0}</p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {test.labels?.map((label) => (
                                        <span
                                            key={label}
                                            className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300"
                                        >
                      {label}
                    </span>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}