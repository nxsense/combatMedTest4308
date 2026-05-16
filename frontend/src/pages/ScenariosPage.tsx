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
    ScenarioGenerateRequest,
    ScenarioInjuryRequest,
    ScenarioResponse,
    ScenarioSessionResponse,
    ScenarioSessionSummaryResponse,
} from '../types/scenario'

const injuryMechanisms = [
    'GUNSHOT_WOUND',
    'FRAGMENTATION_WOUND',
    'BLAST_INJURY',
    'PENETRATING_TRAUMA',
    'BLUNT_TRAUMA',
    'THERMAL_BURN',
    'INHALATION_BURN',
    'FALL_INJURY',
    'VEHICLE_ACCIDENT',
    'CRUSH_INJURY',
    'AMPUTATION',
    'MULTIPLE_TRAUMA',
] as const

const injuryRegions = [
    'HEAD',
    'NECK',
    'CHEST',
    'ABDOMEN',
    'UPPER_LIMB',
    'LOWER_LIMB',
] as const

const injurySeverities = ['MINOR', 'MODERATE', 'SEVERE', 'CRITICAL'] as const

function formatEnum(value: string) {
    return value
        .toLowerCase()
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
}

function createDefaultInjury(): ScenarioInjuryRequest {
    return {
        mechanism: 'BLAST_INJURY',
        region: 'LOWER_LIMB',
        severity: 'CRITICAL',
        activeBleeding: true,
        airwayCompromised: false,
        breathingCompromised: false,
        consciousnessAffected: true,
        description: 'Training injury with priority TCCC assessment requirements',
    }
}

export default function ScenariosPage() {
    const [scenario, setScenario] = useState<ScenarioResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [session, setSession] = useState<ScenarioSessionResponse | null>(null)
    const [summary, setSummary] = useState<ScenarioSessionSummaryResponse | null>(null)
    const [cadetId, setCadetId] = useState('1')
    const [executions, setExecutions] = useState<ScenarioActionExecutionResponse[]>([])

    const [generateForm, setGenerateForm] = useState<ScenarioGenerateRequest>({
        title: 'TCCC multi-trauma training scenario',
        difficultyLevel: 'HARD',
        labelIds: [],
        injuries: [
            {
                mechanism: 'BLAST_INJURY',
                region: 'LOWER_LIMB',
                severity: 'CRITICAL',
                activeBleeding: true,
                airwayCompromised: false,
                breathingCompromised: false,
                consciousnessAffected: true,
                description: 'Lower limb injury with priority bleeding control requirement',
            },
            {
                mechanism: 'PENETRATING_TRAUMA',
                region: 'CHEST',
                severity: 'SEVERE',
                activeBleeding: false,
                airwayCompromised: false,
                breathingCompromised: true,
                consciousnessAffected: false,
                description: 'Chest injury with respiratory compromise signs',
            },
        ],
    })

    function updateGenerateField<K extends keyof ScenarioGenerateRequest>(
        field: K,
        value: ScenarioGenerateRequest[K],
    ) {
        setGenerateForm((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    function addInjury() {
        setGenerateForm((prev) => ({
            ...prev,
            injuries: [...prev.injuries, createDefaultInjury()],
        }))
    }

    function removeInjury(index: number) {
        setGenerateForm((prev) => ({
            ...prev,
            injuries: prev.injuries.filter((_, injuryIndex) => injuryIndex !== index),
        }))
    }

    function updateInjury<K extends keyof ScenarioInjuryRequest>(
        index: number,
        field: K,
        value: ScenarioInjuryRequest[K],
    ) {
        setGenerateForm((prev) => ({
            ...prev,
            injuries: prev.injuries.map((injury, injuryIndex) =>
                injuryIndex === index
                    ? {
                        ...injury,
                        [field]: value,
                    }
                    : injury,
            ),
        }))
    }

    async function handleGenerate() {
        if (!generateForm.title.trim()) {
            alert('Scenario title is required')
            return
        }

        if (generateForm.injuries.length === 0) {
            alert('At least one injury is required')
            return
        }

        try {
            setLoading(true)

            const response = await generateScenario({
                ...generateForm,
                title: generateForm.title.trim(),
                injuries: generateForm.injuries.map((injury) => ({
                    ...injury,
                    description: injury.description.trim(),
                })),
            })

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

    async function applyPenalty(points: number, reason: string) {
        if (!session) return

        try {
            const updatedSession = await applySessionPenalty(session.id, {
                points,
                reason,
            })

            setSession(updatedSession)
        } catch (error) {
            console.error(error)
            alert('Penalty apply failed')
        }
    }

    async function handleStartSession() {
        if (!scenario) return

        try {
            const response = await startScenarioSession({
                scenarioId: scenario.id,
                cadetId: Number(cadetId),
            })

            setSession(response)
            setSummary(null)
            setExecutions([])
        } catch (error) {
            console.error(error)
            alert('Session start failed')
        }
    }

    async function handleExecuteAction(action: ScenarioExpectedAction) {
        if (!session) return

        try {
            const response = await executeScenarioAction(session.id, {
                expectedActionId: action.id,
                manipulationId: action.manipulationId,
                executionMinute: Math.max(1, executions.length + 1),
                notes: `Performed ${action.manipulationCode}`,
            })

            setExecutions((prev) => [...prev, response])

            setSession((prev) => {
                if (!prev) return prev

                const nextScore = Math.max(0, prev.totalScore + response.scoreDelta)

                return {
                    ...prev,
                    totalScore: nextScore,
                    mistakes: response.correct ? prev.mistakes : prev.mistakes + 1,
                }
            })
        } catch (error) {
            console.error(error)
            alert('Action execution failed')
        }
    }

    async function handleLoadSummary() {
        if (!session) return

        try {
            const response = await getSessionSummary(session.id)
            setSummary(response)
        } catch (error) {
            console.error(error)
            alert('Summary load failed')
        }
    }

    function isActionExecuted(actionId: number) {
        return executions.some((execution) => execution.expectedActionId === actionId)
    }

    function getExecutionForAction(actionId: number) {
        return executions.find((execution) => execution.expectedActionId === actionId)
    }

    return (
        <div className="space-y-8">
            <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">TCCC Scenarios</h1>
                    <p className="mt-2 text-zinc-400">
                        Tactical Combat Casualty Care simulation with configurable multi-injury scenario
                        generation.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-zinc-400">
          <span className="rounded-full border border-red-900 bg-red-950/30 px-3 py-1">
            MARCH Protocol
          </span>
                    <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">
            Tactical Field Care
          </span>
                    <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">
            Live Simulation
          </span>
                </div>
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg">
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Generate Scenario</h2>
                        <p className="mt-1 text-sm text-zinc-400">
                            Configure one or more injuries. Each injury can have its own mechanism, region,
                            severity, and clinical flags.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={loading}
                        className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Generating...' : 'Generate Scenario'}
                    </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm text-zinc-300">Scenario title</label>
                        <input
                            value={generateForm.title}
                            onChange={(event) => updateGenerateField('title', event.target.value)}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            placeholder="Scenario title"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">Difficulty</label>
                        <select
                            value={generateForm.difficultyLevel}
                            onChange={(event) =>
                                updateGenerateField(
                                    'difficultyLevel',
                                    event.target.value as ScenarioGenerateRequest['difficultyLevel'],
                                )
                            }
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                        >
                            <option value="EASY">Easy</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HARD">Hard</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">Cadet ID for session</label>
                        <input
                            value={cadetId}
                            onChange={(event) => setCadetId(event.target.value)}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            placeholder="Cadet ID"
                        />
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Injuries</h3>
                            <p className="mt-1 text-sm text-zinc-500">
                                Add multiple trauma sources to create a more realistic training case.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={addInjury}
                            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800"
                        >
                            Add injury
                        </button>
                    </div>

                    {generateForm.injuries.map((injury, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4"
                        >
                            <div className="mb-4 flex items-center justify-between gap-4">
                                <p className="font-semibold text-white">Injury #{index + 1}</p>

                                {generateForm.injuries.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeInjury(index)}
                                        className="text-sm font-medium text-red-400 transition hover:text-red-300"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-sm text-zinc-300">Mechanism</label>
                                    <select
                                        value={injury.mechanism}
                                        onChange={(event) =>
                                            updateInjury(
                                                index,
                                                'mechanism',
                                                event.target.value as ScenarioInjuryRequest['mechanism'],
                                            )
                                        }
                                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                                    >
                                        {injuryMechanisms.map((mechanism) => (
                                            <option key={mechanism} value={mechanism}>
                                                {formatEnum(mechanism)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-zinc-300">Region</label>
                                    <select
                                        value={injury.region}
                                        onChange={(event) =>
                                            updateInjury(
                                                index,
                                                'region',
                                                event.target.value as ScenarioInjuryRequest['region'],
                                            )
                                        }
                                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                                    >
                                        {injuryRegions.map((region) => (
                                            <option key={region} value={region}>
                                                {formatEnum(region)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-zinc-300">Severity</label>
                                    <select
                                        value={injury.severity}
                                        onChange={(event) =>
                                            updateInjury(
                                                index,
                                                'severity',
                                                event.target.value as ScenarioInjuryRequest['severity'],
                                            )
                                        }
                                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                                    >
                                        {injurySeverities.map((severity) => (
                                            <option key={severity} value={severity}>
                                                {formatEnum(severity)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-3 md:grid-cols-4">
                                <label className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-3 text-sm text-zinc-300">
                                    <input
                                        type="checkbox"
                                        checked={injury.activeBleeding}
                                        onChange={(event) =>
                                            updateInjury(index, 'activeBleeding', event.target.checked)
                                        }
                                    />
                                    Active bleeding
                                </label>

                                <label className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-3 text-sm text-zinc-300">
                                    <input
                                        type="checkbox"
                                        checked={injury.airwayCompromised}
                                        onChange={(event) =>
                                            updateInjury(index, 'airwayCompromised', event.target.checked)
                                        }
                                    />
                                    Airway compromised
                                </label>

                                <label className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-3 text-sm text-zinc-300">
                                    <input
                                        type="checkbox"
                                        checked={injury.breathingCompromised}
                                        onChange={(event) =>
                                            updateInjury(index, 'breathingCompromised', event.target.checked)
                                        }
                                    />
                                    Breathing compromised
                                </label>

                                <label className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-3 text-sm text-zinc-300">
                                    <input
                                        type="checkbox"
                                        checked={injury.consciousnessAffected}
                                        onChange={(event) =>
                                            updateInjury(index, 'consciousnessAffected', event.target.checked)
                                        }
                                    />
                                    Consciousness affected
                                </label>
                            </div>

                            <div className="mt-4">
                                <label className="mb-2 block text-sm text-zinc-300">Description</label>
                                <textarea
                                    value={injury.description}
                                    onChange={(event) => updateInjury(index, 'description', event.target.value)}
                                    className="min-h-20 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                                    placeholder="Short training description"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {!scenario && (
                <section className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 p-8 text-center">
                    <h2 className="text-xl font-semibold text-white">No active scenario</h2>
                    <p className="mt-2 text-zinc-400">Generate a tactical casualty scenario to begin.</p>
                </section>
            )}

            {scenario && (
                <>
                    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white">{scenario.title}</h2>
                                <p className="mt-2 max-w-3xl text-zinc-400">
                                    {scenario.description || scenario.legend || scenario.narrative}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleStartSession}
                                disabled={Boolean(session)}
                                className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {session ? 'Session Started' : 'Start Session'}
                            </button>
                        </div>

                        {session && (
                            <div className="mt-6 grid gap-4 md:grid-cols-4">
                                <div className="rounded-xl bg-zinc-950/70 p-4">
                                    <p className="text-sm text-zinc-500">Session</p>
                                    <p className="mt-1 text-xl font-semibold text-white">#{session.id}</p>
                                </div>

                                <div className="rounded-xl bg-zinc-950/70 p-4">
                                    <p className="text-sm text-zinc-500">Status</p>
                                    <p className="mt-1 text-xl font-semibold text-white">{session.status}</p>
                                </div>

                                <div className="rounded-xl bg-zinc-950/70 p-4">
                                    <p className="text-sm text-zinc-500">Score</p>
                                    <p className="mt-1 text-xl font-semibold text-white">{session.totalScore}</p>
                                </div>

                                <div className="rounded-xl bg-zinc-950/70 p-4">
                                    <p className="text-sm text-zinc-500">Mistakes</p>
                                    <p className="mt-1 text-xl font-semibold text-white">{session.mistakes}</p>
                                </div>
                            </div>
                        )}

                        {session && (
                            <div className="mt-5 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => applyPenalty(10, 'Critical mistake')}
                                    className="rounded-xl border border-red-900 bg-red-950/40 px-5 py-3 font-semibold text-red-300 transition hover:bg-red-900/50"
                                >
                                    Critical mistake -10
                                </button>

                                <button
                                    type="button"
                                    onClick={() => applyPenalty(5, 'Manipulation inaccuracy')}
                                    className="rounded-xl border border-yellow-900 bg-yellow-950/40 px-5 py-3 font-semibold text-yellow-300 transition hover:bg-yellow-900/50"
                                >
                                    Manipulation inaccuracy -5
                                </button>

                                <button
                                    type="button"
                                    onClick={() => applyPenalty(3, 'Wrong order')}
                                    className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-semibold text-zinc-300 transition hover:bg-zinc-800"
                                >
                                    Wrong order -3
                                </button>

                                <button
                                    type="button"
                                    onClick={handleLoadSummary}
                                    className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-semibold text-zinc-300 transition hover:bg-zinc-800"
                                >
                                    Load Session Summary
                                </button>
                            </div>
                        )}
                    </section>

                    <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                            <p className="text-xs uppercase tracking-wide text-zinc-500">Heart Rate</p>
                            <p className="mt-2 text-2xl font-bold text-white">
                                {scenario.vitalSigns?.heartRate}
                            </p>
                            <p className="text-xs text-zinc-500">bpm</p>
                        </div>

                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                            <p className="text-xs uppercase tracking-wide text-zinc-500">Blood Pressure</p>
                            <p className="mt-2 text-2xl font-bold text-white">
                                {scenario.vitalSigns?.systolicBp}/{scenario.vitalSigns?.diastolicBp}
                            </p>
                            <p className="text-xs text-zinc-500">mmHg</p>
                        </div>

                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                            <p className="text-xs uppercase tracking-wide text-zinc-500">Respiration</p>
                            <p className="mt-2 text-2xl font-bold text-white">
                                {scenario.vitalSigns?.respiratoryRate}
                            </p>
                            <p className="text-xs text-zinc-500">/min</p>
                        </div>

                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                            <p className="text-xs uppercase tracking-wide text-zinc-500">SpO2</p>
                            <p className="mt-2 text-2xl font-bold text-white">{scenario.vitalSigns?.spo2}%</p>
                        </div>

                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                            <p className="text-xs uppercase tracking-wide text-zinc-500">AVPU</p>
                            <p className="mt-2 text-2xl font-bold text-white">
                                {scenario.vitalSigns?.consciousnessLevel}
                            </p>
                        </div>

                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                            <p className="text-xs uppercase tracking-wide text-zinc-500">Pain</p>
                            <p className="mt-2 text-2xl font-bold text-white">
                                {scenario.vitalSigns?.painLevel}/10
                            </p>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6">
                        <h2 className="text-xl font-semibold text-white">Scenario Injuries</h2>

                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            {scenario.injuries?.map((injury) => (
                                <div key={injury.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                                    <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-red-950/60 px-3 py-1 text-xs font-semibold text-red-300">
                      {formatEnum(injury.severity)}
                    </span>
                                        <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-300">
                      {formatEnum(injury.region)}
                    </span>
                                        <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-300">
                      {formatEnum(injury.mechanism)}
                    </span>
                                    </div>

                                    <p className="mt-4 text-sm text-zinc-300">{injury.description}</p>

                                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-400">
                                        {injury.activeBleeding && <span>Active bleeding</span>}
                                        {injury.airwayCompromised && <span>Airway compromised</span>}
                                        {injury.breathingCompromised && <span>Breathing compromised</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6">
                        <h2 className="text-xl font-semibold text-white">Expected Actions</h2>

                        <div className="mt-5 space-y-4">
                            {scenario.expectedActions?.map((action) => {
                                const executed = isActionExecuted(action.id)
                                const execution = getExecutionForAction(action.id)

                                return (
                                    <div
                                        key={action.id}
                                        className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                                    >
                                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
                            #{action.priorityOrder}
                          </span>
                                                    <span className="rounded-full bg-red-950/60 px-3 py-1 text-xs text-red-300">
                            {action.tcccStage}
                          </span>
                                                    {action.critical && (
                                                        <span className="rounded-full bg-yellow-950/60 px-3 py-1 text-xs text-yellow-300">
                              CRITICAL
                            </span>
                                                    )}
                                                    {executed && (
                                                        <span className="rounded-full bg-emerald-950/60 px-3 py-1 text-xs text-emerald-300">
                              EXECUTED
                            </span>
                                                    )}
                                                </div>

                                                <h3 className="mt-3 text-lg font-semibold text-white">{action.title}</h3>
                                                <p className="mt-1 text-sm text-zinc-400">{action.description}</p>
                                                <p className="mt-2 text-sm text-zinc-500">
                                                    Manipulation: {action.manipulationTitle}
                                                </p>

                                                {execution && (
                                                    <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-sm">
                            <span
                                className={
                                    execution.correct ? 'text-emerald-400' : 'text-red-400'
                                }
                            >
                              {execution.correct ? 'SUCCESS' : 'FAILED'}
                            </span>
                                                        <span className="ml-3 text-zinc-300">
                              Score: {execution.scoreDelta > 0 ? '+' : ''}
                                                            {execution.scoreDelta}
                            </span>
                                                    </div>
                                                )}
                                            </div>

                                            {session && !executed && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleExecuteAction(action)}
                                                    className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500"
                                                >
                                                    Execute Manipulation
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    {summary && (
                        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6">
                            <h2 className="text-xl font-semibold text-white">Session Summary</h2>

                            <div className="mt-5 grid gap-4 md:grid-cols-5">
                                <div className="rounded-xl bg-zinc-950/70 p-4">
                                    <p className="text-sm text-zinc-500">Score</p>
                                    <p className="mt-1 text-xl font-bold text-white">
                                        {summary.totalScore} / {summary.maxScore || scenario.expectedActions.length * 10}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-zinc-950/70 p-4">
                                    <p className="text-sm text-zinc-500">Accuracy</p>
                                    <p className="mt-1 text-xl font-bold text-white">
                                        {Math.round((summary.totalScore / summary.maxScore) * 100)}%
                                    </p>
                                </div>

                                <div className="rounded-xl bg-zinc-950/70 p-4">
                                    <p className="text-sm text-zinc-500">Correct</p>
                                    <p className="mt-1 text-xl font-bold text-white">
                                        {summary.correctActions}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-zinc-950/70 p-4">
                                    <p className="text-sm text-zinc-500">Incorrect</p>
                                    <p className="mt-1 text-xl font-bold text-white">
                                        {summary.incorrectActions}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-zinc-950/70 p-4">
                                    <p className="text-sm text-zinc-500">Mistakes</p>
                                    <p className="mt-1 text-xl font-bold text-white">{summary.mistakes}</p>
                                </div>
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    )
}