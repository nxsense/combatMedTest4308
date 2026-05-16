import { useState } from 'react'

import { generateScenario } from '../features/scenarios/scenarioApi'

import {
    applySessionPenalty,
    executeScenarioAction,
    getSessionSummary,
    startScenarioSession,
} from '../features/scenarios/sessionApi'

import type {
    ScenarioActionExecutionResponse,
    ScenarioExpectedAction,
    ScenarioResponse,
    ScenarioSessionResponse,
    ScenarioSessionSummaryResponse,
} from '../types/scenario'



export default function ScenariosPage() {
    const [scenario, setScenario] =
        useState<ScenarioResponse | null>(null)

    const [loading, setLoading] = useState(false)

    const [session, setSession] =
        useState<ScenarioSessionResponse | null>(null)

    const [summary, setSummary] =
        useState<ScenarioSessionSummaryResponse | null>(null)

    const [cadetId, setCadetId] =
        useState('1')

    const [executions, setExecutions] =
        useState<ScenarioActionExecutionResponse[]>([])

    async function handleGenerate() {
        try {
            setLoading(true)

            const response = await generateScenario()

            setScenario(response)

            setExecutions([])
            setSession(null)
            setSummary(null)

        } catch (error) {
            console.error(error)

            alert('Scenario generation failed')

        } finally {
            setLoading(false)
        }
    }

    async function applyPenalty(
        points: number,
        reason: string,
    ) {
        if (!session) return

        try {

            const updatedSession =
                await applySessionPenalty(
                    session.id,
                    {
                        points,
                        reason,
                    },
                )

            setSession(updatedSession)

        } catch (error) {

            console.error(error)

            alert('Penalty apply failed')
        }
    }
    async function handleStartSession() {
        if (!scenario) return

        try {
            const response =
                await startScenarioSession({
                    scenarioId: scenario.id,
                    cadetId: Number(cadetId),
                })

            setSession(response)

        } catch (error) {
            console.error(error)

            alert('Session start failed')
        }
    }

    async function handleExecuteAction(
        action: ScenarioExpectedAction,
    ) {
        if (!session) return

        try {
            const response =
                await executeScenarioAction(
                    session.id,
                    {
                        expectedActionId: action.id,
                        manipulationId: action.manipulationId,
                        executionMinute: 1,
                        notes: `Performed ${action.manipulationCode}`,
                    },
                )

            setExecutions((prev) => [...prev, response])

            setSession((prev) => {
                if (!prev) return prev

                const isCorrect =
                    response.correct === true

                return {
                    ...prev,
                    totalScore:
                        prev.totalScore + response.scoreDelta,
                    mistakes: isCorrect
                        ? prev.mistakes
                        : prev.mistakes + 1,
                }
            })

        } catch (error) {
            console.error(error)

            alert('Action execution failed')
        }
    }

    async function handleLoadSummary() {
        if (!session) return

        const response =
            await getSessionSummary(session.id)

        setSummary(response)
    }

    function isActionExecuted(
        actionId: number,
    ) {
        return executions.some(
            (execution) =>
                execution.expectedActionId === actionId,
        )
    }

    function getExecutionForAction(
        actionId: number,
    ) {
        return executions.find(
            (execution) =>
                execution.expectedActionId === actionId,
        )
    }

    return (
        <div>

            <div className="mb-8 flex items-center justify-between">

                <div>

                    <h1 className="text-5xl font-black">
                        TCCC Scenarios
                    </h1>

                    <p className="mt-3 text-zinc-400">
                        Tactical Combat Casualty Care simulation
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">

                        <div className="rounded-lg border border-red-900 bg-red-950 px-4 py-2 text-sm">
                            MARCH Protocol
                        </div>

                        <div className="rounded-lg border border-yellow-900 bg-yellow-950 px-4 py-2 text-sm">
                            Tactical Field Care
                        </div>

                        <div className="rounded-lg border border-cyan-900 bg-cyan-950 px-4 py-2 text-sm">
                            Live Simulation
                        </div>

                    </div>

                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="btn-primary"
                >
                    {loading
                        ? 'Generating...'
                        : 'Generate Scenario'}
                </button>

            </div>

            {!scenario && (

                <div className="card p-12 text-center">

                    <h2 className="text-2xl font-semibold">
                        No active scenario
                    </h2>

                    <p className="mt-4 text-zinc-400">
                        Generate a tactical casualty scenario
                    </p>

                </div>
            )}

            {scenario && (

                <div className="space-y-6">

                    <div className="card p-8">

                        <h2 className="mb-4 text-3xl font-bold">
                            {scenario.title}
                        </h2>

                        <p className="text-zinc-300">
                            {scenario.description}
                        </p>

                        <div className="mt-6 flex gap-3">

                            <input
                                className="input max-w-xs"
                                value={cadetId}
                                onChange={(e) =>
                                    setCadetId(e.target.value)
                                }
                                placeholder="Cadet ID"
                            />

                            <button
                                onClick={handleStartSession}
                                className="btn-primary"
                            >
                                Start Session
                            </button>

                        </div>

                        {session && (

                            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

                                <div className="card p-4">

                                    <div className="text-sm text-zinc-400">
                                        Session
                                    </div>

                                    <div className="mt-2 text-2xl font-bold">
                                        #{session.id}
                                    </div>

                                </div>

                                <div className="card p-4">

                                    <div className="text-sm text-zinc-400">
                                        Status
                                    </div>

                                    <div className="mt-2 text-2xl font-bold text-emerald-400">
                                        {session.status}
                                    </div>

                                </div>

                                <div className="card p-4">

                                    <div className="text-sm text-zinc-400">
                                        Score
                                    </div>

                                    <div className="mt-2 text-2xl font-bold">
                                        {session.totalScore}
                                    </div>

                                </div>

                                <div className="card p-4">

                                    <div className="text-sm text-zinc-400">
                                        Mistakes
                                    </div>

                                    <div className="mt-2 text-2xl font-bold text-red-400">
                                        {session.mistakes}
                                    </div>

                                </div>

                            </div>
                        )}

                        {session && (
                            <div className="mt-6 flex flex-wrap gap-3">

                                <button
                                    onClick={() =>
                                        applyPenalty(10, 'Critical mistake')
                                    }
                                    className="rounded-xl border border-red-900 bg-red-950/40 px-5 py-3 font-semibold text-red-300 transition hover:bg-red-900/50"
                                >
                                    Critical mistake -10
                                </button>

                                <button
                                    onClick={() =>
                                        applyPenalty(5, 'Manipulation inaccuracy')
                                    }
                                    className="rounded-xl border border-yellow-900 bg-yellow-950/40 px-5 py-3 font-semibold text-yellow-300 transition hover:bg-yellow-900/50"
                                >
                                    Manipulation inaccuracy -5
                                </button>

                                <button
                                    onClick={() =>
                                        applyPenalty(3, 'Wrong order')
                                    }
                                    className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-semibold text-zinc-300 transition hover:bg-zinc-800"
                                >
                                    Wrong order -3
                                </button>

                            </div>
                        )}

                        {session && (
                            <button
                                onClick={handleLoadSummary}
                                className="btn-secondary mt-4"
                            >
                                Load Session Summary
                            </button>
                        )}

                    </div>

                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

                        <div className="card p-5">
                            <div className="text-sm text-zinc-400">Heart Rate</div>
                            <div className="mt-2 text-3xl font-bold text-red-400">
                                {scenario.vitalSigns?.heartRate}
                            </div>
                            <div className="text-sm text-zinc-500">bpm</div>
                        </div>

                        <div className="card p-5">
                            <div className="text-sm text-zinc-400">Blood Pressure</div>
                            <div className="mt-2 text-3xl font-bold">
                                {scenario.vitalSigns?.systolicBp}/{scenario.vitalSigns?.diastolicBp}
                            </div>
                            <div className="text-sm text-zinc-500">mmHg</div>
                        </div>

                        <div className="card p-5">
                            <div className="text-sm text-zinc-400">Respiration</div>
                            <div className="mt-2 text-3xl font-bold">
                                {scenario.vitalSigns?.respiratoryRate}
                            </div>
                            <div className="text-sm text-zinc-500">/min</div>
                        </div>

                        <div className="card p-5">
                            <div className="text-sm text-zinc-400">SpO2</div>
                            <div className="mt-2 text-3xl font-bold text-cyan-400">
                                {scenario.vitalSigns?.spo2}%
                            </div>
                        </div>

                        <div className="card p-5">
                            <div className="text-sm text-zinc-400">AVPU</div>
                            <div className="mt-2 text-2xl font-bold text-yellow-400">
                                {scenario.vitalSigns?.consciousnessLevel}
                            </div>
                        </div>

                        <div className="card p-5">
                            <div className="text-sm text-zinc-400">Pain</div>
                            <div className="mt-2 text-3xl font-bold text-orange-400">
                                {scenario.vitalSigns?.painLevel}/10
                            </div>
                        </div>

                        <div className="card p-5 lg:col-span-2">
                            <div className="text-sm text-zinc-400">Skin Condition</div>
                            <div className="mt-2 text-xl font-semibold">
                                {scenario.vitalSigns?.skinCondition}
                            </div>
                        </div>

                    </div>
                    <div className="card p-8">

                        <h2 className="mb-6 text-2xl font-bold">
                            Expected Actions
                        </h2>
                        <div className="mb-8 flex flex-wrap gap-3">

                            {scenario.expectedActions?.map((action) => {

                                const executed =
                                    isActionExecuted(action.id)

                                const execution =
                                    getExecutionForAction(action.id)

                                return (

                                    <div
                                        key={action.id}
                                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                                            executed
                                                ? execution?.correct
                                                    ? 'border-emerald-700 bg-emerald-950 text-emerald-300'
                                                    : 'border-red-700 bg-red-950 text-red-300'
                                                : 'border-zinc-700 bg-zinc-900 text-zinc-400'
                                        }`}
                                    >

                                        #{action.priorityOrder}

                                        {' '}

                                        {action.title}

                                    </div>
                                )
                            })}

                        </div>

                        <div className="space-y-4">

                            {scenario.expectedActions?.map(
                                (action) => (

                                    <div
                                        key={action.id}
                                        className={`rounded-2xl border p-5 transition ${
                                            action.critical
                                                ? 'border-red-900 bg-red-950/30'
                                                : 'border-zinc-800 bg-zinc-900/80'
                                        }`}
                                    >

                                        <div className="mb-3 flex items-center justify-between">

                                            <div>

                                                <h3 className="text-xl font-semibold">
                                                    {action.title}
                                                </h3>

                                                <p className="text-sm text-zinc-400">
                                                    {action.manipulationTitle}
                                                </p>

                                            </div>

                                            <div className="flex gap-2">

                        <span className="rounded bg-red-900 px-3 py-1 text-sm">
                          {action.tcccStage}
                        </span>

                                                <span className="rounded bg-zinc-700 px-3 py-1 text-sm">
                          Priority #{action.priorityOrder}
                        </span>

                                                {action.critical && (
                                                    <span className="rounded bg-yellow-700 px-3 py-1 text-sm">
                            CRITICAL
                          </span>
                                                )}

                                            </div>

                                        </div>

                                        <p className="text-zinc-300">
                                            {action.description}
                                        </p>

                                        {getExecutionForAction(action.id) && (

                                            <div className="mt-4 flex items-center gap-3">

                        <span
                            className={`rounded px-3 py-1 text-sm font-semibold ${
                                getExecutionForAction(action.id)?.correct
                                    ? 'bg-emerald-700'
                                    : 'bg-red-700'
                            }`}
                        >
                          {getExecutionForAction(action.id)?.correct
                              ? 'SUCCESS'
                              : 'FAILED'}
                        </span>

                                                <span className="text-sm text-zinc-400">

                          Score:

                                                    {' '}

                                                    {(getExecutionForAction(action.id)?.scoreDelta ?? 0) > 0
                                                        ? '+'
                                                        : ''}

                                                    {getExecutionForAction(action.id)?.scoreDelta}

                        </span>

                                            </div>
                                        )}

                                        {session && !isActionExecuted(action.id) && (

                                            <>
                                                <button
                                                    onClick={() =>
                                                        handleExecuteAction(action)
                                                    }
                                                    className="btn-primary mt-4"
                                                >
                                                    Execute Manipulation
                                                </button>
                                            </>
                                        )}

                                    </div>
                                ),
                            )}

                        </div>

                    </div>


                    {summary && (

                        <div className="card p-8">

                            <h2 className="mb-6 text-2xl font-bold">
                                Session Summary
                            </h2>

                            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">

                                <div className="rounded-xl bg-zinc-800 p-4">

                                    <div className="text-sm text-zinc-400">
                                        Score
                                    </div>

                                    <div className="mt-2 text-3xl font-bold">
                                        {summary.totalScore}
                                        {' / '}
                                        {scenario.expectedActions.length * 10}
                                    </div>

                                </div>

                                <div className="rounded-xl bg-zinc-800 p-4">

                                    <div className="text-sm text-zinc-400">
                                        Accuracy
                                    </div>

                                    <div className="mt-2 text-3xl font-bold text-emerald-400">
                                        {Math.round((summary.totalScore / (scenario.expectedActions.length * 10)) * 100)}%
                                    </div>

                                </div>

                                <div className="rounded-xl bg-zinc-800 p-4">

                                    <div className="text-sm text-zinc-400">
                                        Correct
                                    </div>

                                    <div className="mt-2 text-3xl font-bold">
                                        {summary.correctActions}
                                    </div>

                                </div>

                                <div className="rounded-xl bg-zinc-800 p-4">

                                    <div className="text-sm text-zinc-400">
                                        Incorrect
                                    </div>

                                    <div className="mt-2 text-3xl font-bold text-red-400">
                                        {summary.incorrectActions}
                                    </div>

                                </div>

                                <div className="rounded-xl bg-zinc-800 p-4">

                                    <div className="text-sm text-zinc-400">
                                        Mistakes
                                    </div>

                                    <div className="mt-2 text-3xl font-bold text-yellow-400">
                                        {summary.mistakes}
                                    </div>

                                </div>

                            </div>

                        </div>
                    )}

                </div>
            )}

        </div>
    )
}