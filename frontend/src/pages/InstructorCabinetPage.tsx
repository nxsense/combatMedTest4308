import { useEffect, useMemo, useState } from 'react'
import {
    getCadetPracticalResults,
    getCadets,
    getCadetTestAnalytics,
    getCadetTestResults,
    getCadetWeakPracticalAreas,
    type CadetAnalyticsResponse,
    type CadetResponse,
    type WeakAreaResponse,
} from '../features/cadet/cadetApi'
import type { PracticalResultResponse } from '../types/practical'
import type { TestResultResponse } from '../types/test'

function formatPercent(value?: number) {
    return `${Number(value ?? 0).toFixed(1)}%`
}

function getCadetName(cadet: CadetResponse) {
    const fullName = `${cadet.firstName ?? ''} ${cadet.lastName ?? ''}`.trim()
    return fullName || cadet.username || `Cadet #${cadet.id}`
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

export default function InstructorCabinetPage() {
    const [cadets, setCadets] = useState<CadetResponse[]>([])
    const [selectedCadetId, setSelectedCadetId] = useState<number | null>(null)

    const [testAnalytics, setTestAnalytics] = useState<CadetAnalyticsResponse | null>(null)
    const [testResults, setTestResults] = useState<TestResultResponse[]>([])
    const [practicalResults, setPracticalResults] = useState<PracticalResultResponse[]>([])
    const [weakPracticalAreas, setWeakPracticalAreas] = useState<WeakAreaResponse[]>([])

    const [loading, setLoading] = useState(true)
    const [detailsLoading, setDetailsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        loadCadets()
    }, [])

    useEffect(() => {
        if (selectedCadetId) {
            loadCadetDetails(selectedCadetId)
        }
    }, [selectedCadetId])

    async function loadCadets() {
        try {
            setLoading(true)
            setError('')

            const data = await getCadets()
            setCadets(data)

            if (data.length > 0) {
                setSelectedCadetId(data[0].id)
            }
        } catch (error) {
            console.error(error)
            setError('Failed to load cadets.')
        } finally {
            setLoading(false)
        }
    }

    async function loadCadetDetails(cadetId: number) {
        try {
            setDetailsLoading(true)
            setError('')

            const [
                loadedTestAnalytics,
                loadedTestResults,
                loadedPracticalResults,
                loadedWeakPracticalAreas,
            ] = await Promise.all([
                getCadetTestAnalytics(cadetId),
                getCadetTestResults(cadetId),
                getCadetPracticalResults(cadetId),
                getCadetWeakPracticalAreas(cadetId).catch(() => []),
            ])

            setTestAnalytics(loadedTestAnalytics)
            setTestResults(loadedTestResults)
            setPracticalResults(loadedPracticalResults)
            setWeakPracticalAreas(loadedWeakPracticalAreas)
        } catch (error) {
            console.error(error)
            setError('Failed to load cadet analytics.')
        } finally {
            setDetailsLoading(false)
        }
    }

    const selectedCadet = useMemo(() => {
        return cadets.find((cadet) => cadet.id === selectedCadetId) ?? null
    }, [cadets, selectedCadetId])

    const practicalAverage = useMemo(() => {
        if (practicalResults.length === 0) return 0

        return (
            practicalResults.reduce((sum, result) => sum + Number(result.percentage ?? 0), 0) /
            practicalResults.length
        )
    }, [practicalResults])

    const practicalPassed = useMemo(() => {
        return practicalResults.filter((result) =>
            ['PASSED', 'GOOD', 'EXCELLENT'].includes(result.resultStatus ?? ''),
        ).length
    }, [practicalResults])

    const practicalPassRate = useMemo(() => {
        if (practicalResults.length === 0) return 0
        return (practicalPassed * 100) / practicalResults.length
    }, [practicalPassed, practicalResults.length])

    const weakTestAreas = testAnalytics?.weakLabels ?? []

    if (loading) {
        return <p className="text-zinc-300">Loading cadet analytics...</p>
    }

    return (
        <div className="space-y-8">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg">
                <p className="text-sm uppercase tracking-wide text-red-400">Instructor Cabinet</p>
                <h1 className="mt-3 text-3xl font-bold text-white">Cadet Progress Analytics</h1>
                <p className="mt-2 text-zinc-400">
                    Review cadet performance across tests, practical skills, weak areas, and training
                    outcomes.
                </p>
            </section>

            {error && (
                <div className="rounded-2xl border border-red-900 bg-red-950/30 p-4 text-red-200">
                    {error}
                </div>
            )}

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg">
                <label className="mb-2 block text-sm text-zinc-300">Select cadet</label>

                <select
                    value={selectedCadetId ?? ''}
                    onChange={(event) => setSelectedCadetId(Number(event.target.value))}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500 md:max-w-md"
                >
                    {cadets.map((cadet) => (
                        <option key={cadet.id} value={cadet.id}>
                            {getCadetName(cadet)} · ID {cadet.id}
                            {cadet.serviceNumber ? ` · ${cadet.serviceNumber}` : ''}
                        </option>
                    ))}
                </select>

                {selectedCadet && (
                    <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-300">
              Selected: {getCadetName(selectedCadet)}
            </span>
                        <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-300">
              Cadet ID: {selectedCadet.id}
            </span>
                    </div>
                )}
            </section>

            {detailsLoading ? (
                <p className="text-zinc-300">Loading selected cadet details...</p>
            ) : (
                <>
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
                            subtitle={`${practicalPassed} successful evaluations`}
                        />
                    </section>

                    <section className="grid gap-4 xl:grid-cols-2">
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg">
                            <h2 className="text-2xl font-bold text-white">Weak Test Areas</h2>

                            {weakTestAreas.length === 0 ? (
                                <p className="mt-4 text-zinc-400">No weak test areas detected.</p>
                            ) : (
                                <div className="mt-5 space-y-3">
                                    {weakTestAreas.map((area) => (
                                        <div
                                            key={area.labelName || area.name}
                                            className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <p className="font-semibold text-white">
                                                    {area.labelName || area.name || 'Unknown area'}
                                                </p>
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
                                <p className="mt-4 text-zinc-400">No weak practical areas detected.</p>
                            ) : (
                                <div className="mt-5 space-y-3">
                                    {weakPracticalAreas.map((area) => (
                                        <div
                                            key={area.labelName || area.name}
                                            className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <p className="font-semibold text-white">
                                                    {area.labelName || area.name || 'Unknown area'}
                                                </p>
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
                                    {testResults.slice(0, 8).map((result) => (
                                        <div
                                            key={result.id}
                                            className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="font-semibold text-white">
                                                        {result.testTitle || `Test #${result.testId ?? result.id}`}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        Score: {result.score} / {result.maxScore}
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
                                    {practicalResults.slice(0, 8).map((result) => (
                                        <div
                                            key={result.id}
                                            className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="font-semibold text-white">
                                                        {result.skillName || `Practical skill #${result.skillId ?? result.id}`}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        Score: {result.totalScore ?? 0} / {result.maxScore ?? 0}
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
                </>
            )}
        </div>
    )
}