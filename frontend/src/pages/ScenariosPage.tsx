import { useEffect, useState } from 'react'
import {
    createManualScenario,
    generateScenario,
    getManipulations,
} from '../features/scenarios/scenarioApi'
import {
    applySessionPenalty,
    executeScenarioAction,
    getSessionSummary,
    startScenarioSession,
} from '../features/scenarios/sessionApi'
import type {
    DifficultyLevel,
    ExpectedActionType,
    ScenarioActionExecutionResponse,
    ScenarioExpectedAction,
    ScenarioExpectedActionRequest,
    ScenarioGenerateRequest,
    ScenarioInjuryRequest,
    ScenarioManualCreateRequest,
    ScenarioResponse,
    ScenarioSessionResponse,
    ScenarioSessionSummaryResponse,
    TcccStage,
    Manipulation
} from '../types/scenario'

type Mode = 'generate' | 'manual'

const difficultyOptions: DifficultyLevel[] = ['EASY', 'MEDIUM', 'HARD']

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

const injuryRegions = ['HEAD', 'NECK', 'CHEST', 'ABDOMEN', 'UPPER_LIMB', 'LOWER_LIMB'] as const

const injurySeverities = ['MINOR', 'MODERATE', 'SEVERE', 'CRITICAL'] as const

const tcccStages: TcccStage[] = ['M', 'A', 'R', 'C', 'H']

const actionTypes: ExpectedActionType[] = ['MANIPULATION', 'ASSESSMENT', 'DECISION']

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

function createDefaultExpectedAction(): ScenarioExpectedActionRequest {
    return {
        tcccStage: 'M',
        actionType: 'MANIPULATION',
        title: 'Control massive bleeding',
        description: 'Perform the appropriate intervention according to the scenario conditions.',
        manipulationId: 1,
        priorityOrder: 1,
        critical: true,
        rationale: 'Massive hemorrhage is handled first in the MARCH sequence.',
    }
}

function NumberInput({
                         label,
                         value,
                         onChange,
                     }: {
    label: string
    value: number
    onChange: (value: number) => void
}) {
    return (
        <div>
            <label className="mb-2 block text-sm text-zinc-300">{label}</label>
            <input
                type="number"
                value={value}
                onChange={(event) => onChange(Number(event.target.value))}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
            />
        </div>
    )
}

export default function ScenariosPage() {
    const [manipulationsLoading, setManipulationsLoading] = useState(false)
    const [manipulations, setManipulations] = useState<Manipulation[]>([])
    const [mode, setMode] = useState<Mode>('generate')
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

    const [manualForm, setManualForm] = useState<ScenarioManualCreateRequest>({
        title: 'Manual TCCC scenario',
        legend: 'Instructor-created tactical casualty case.',
        scenarioFlowNotes: 'Manual scenario for controlled training session.',
        difficultyLevel: 'MEDIUM',
        vitalSigns: {
            heartRate: 118,
            systolicBp: 92,
            diastolicBp: 60,
            respiratoryRate: 24,
            spo2: 93,
            consciousnessLevel: 'V',
            skinCondition: 'Pale, cold',
            painLevel: 7,
        },
        injuries: [createDefaultInjury()],
        expectedActions: [createDefaultExpectedAction()],
        labelIds: [],
        narrative: 'Manual instructor-created case for TCCC scenario execution.',
    })

    useEffect(() => {
        setManipulationsLoading(true)

        getManipulations()
            .then(setManipulations)
            .catch((error) => {
                console.error(error)
            })
            .finally(() => {
                setManipulationsLoading(false)
            })
    }, [])

    function resetSimulationState(response: ScenarioResponse) {
        setScenario(response)
        setExecutions([])
        setSession(null)
        setSummary(null)
    }

    function updateGenerateField<K extends keyof ScenarioGenerateRequest>(
        field: K,
        value: ScenarioGenerateRequest[K],
    ) {
        setGenerateForm((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    function updateManualField<K extends keyof ScenarioManualCreateRequest>(
        field: K,
        value: ScenarioManualCreateRequest[K],
    ) {
        setManualForm((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    function addGenerateInjury() {
        setGenerateForm((prev) => ({
            ...prev,
            injuries: [...prev.injuries, createDefaultInjury()],
        }))
    }

    function addManualInjury() {
        setManualForm((prev) => ({
            ...prev,
            injuries: [...prev.injuries, createDefaultInjury()],
        }))
    }

    function removeGenerateInjury(index: number) {
        setGenerateForm((prev) => ({
            ...prev,
            injuries: prev.injuries.filter((_, injuryIndex) => injuryIndex !== index),
        }))
    }

    function removeManualInjury(index: number) {
        setManualForm((prev) => ({
            ...prev,
            injuries: prev.injuries.filter((_, injuryIndex) => injuryIndex !== index),
        }))
    }

    function updateGenerateInjury<K extends keyof ScenarioInjuryRequest>(
        index: number,
        field: K,
        value: ScenarioInjuryRequest[K],
    ) {
        setGenerateForm((prev) => ({
            ...prev,
            injuries: prev.injuries.map((injury, injuryIndex) =>
                injuryIndex === index ? { ...injury, [field]: value } : injury,
            ),
        }))
    }

    function updateManualInjury<K extends keyof ScenarioInjuryRequest>(
        index: number,
        field: K,
        value: ScenarioInjuryRequest[K],
    ) {
        setManualForm((prev) => ({
            ...prev,
            injuries: prev.injuries.map((injury, injuryIndex) =>
                injuryIndex === index ? { ...injury, [field]: value } : injury,
            ),
        }))
    }

    function addExpectedAction() {
        setManualForm((prev) => ({
            ...prev,
            expectedActions: [
                ...prev.expectedActions,
                {
                    ...createDefaultExpectedAction(),
                    priorityOrder: prev.expectedActions.length + 1,
                },
            ],
        }))
    }

    function removeExpectedAction(index: number) {
        setManualForm((prev) => ({
            ...prev,
            expectedActions: prev.expectedActions.filter((_, actionIndex) => actionIndex !== index),
        }))
    }

    function updateExpectedAction<K extends keyof ScenarioExpectedActionRequest>(
        index: number,
        field: K,
        value: ScenarioExpectedActionRequest[K],
    ) {
        setManualForm((prev) => ({
            ...prev,
            expectedActions: prev.expectedActions.map((action, actionIndex) =>
                actionIndex === index ? { ...action, [field]: value } : action,
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

            resetSimulationState(response)
        } catch (error) {
            console.error(error)
            alert('Scenario generation failed')
        } finally {
            setLoading(false)
        }
    }

    async function handleCreateManual() {
        if (!manualForm.title.trim() || !manualForm.legend.trim()) {
            alert('Title and legend are required')
            return
        }

        if (manualForm.injuries.length === 0) {
            alert('At least one injury is required')
            return
        }

        if (manualForm.expectedActions.length === 0) {
            alert('At least one expected action is required')
            return
        }

        try {
            setLoading(true)

            const response = await createManualScenario({
                ...manualForm,
                title: manualForm.title.trim(),
                legend: manualForm.legend.trim(),
                narrative: manualForm.narrative.trim(),
                scenarioFlowNotes: manualForm.scenarioFlowNotes.trim(),
                injuries: manualForm.injuries.map((injury) => ({
                    ...injury,
                    description: injury.description.trim(),
                })),
                expectedActions: manualForm.expectedActions.map((action, index) => ({
                    ...action,
                    title: action.title.trim(),
                    description: action.description.trim(),
                    rationale: action.rationale.trim(),
                    priorityOrder: action.priorityOrder || index + 1,
                })),
            })

            resetSimulationState(response)
        } catch (error) {
            console.error(error)
            alert('Manual scenario creation failed')
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
        if (!session || !action.manipulationId) return

        try {
            const response = await executeScenarioAction(session.id, {
                expectedActionId: action.id,
                manipulationId: action.manipulationId,
                executionMinute: Math.max(1, executions.length + 1),
                notes: `Performed ${action.manipulationCode || action.title}`,
            })

            setExecutions((prev) => [...prev, response])

            setSession((prev) => {
                if (!prev) return prev

                return {
                    ...prev,
                    totalScore: Math.max(0, prev.totalScore + response.scoreDelta),
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

    const activeInjuries = mode === 'generate' ? generateForm.injuries : manualForm.injuries

    return (
        <div className="space-y-8">
            <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">TCCC Scenarios</h1>
                    <p className="mt-2 text-zinc-400">
                        Generate or manually create tactical casualty scenarios, then run the simulation flow.
                    </p>
                </div>

                <div className="flex rounded-2xl border border-zinc-800 bg-zinc-900 p-1">
                    <button
                        type="button"
                        onClick={() => setMode('generate')}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                            mode === 'generate'
                                ? 'bg-red-600 text-white'
                                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                        }`}
                    >
                        Generate
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('manual')}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                            mode === 'manual'
                                ? 'bg-red-600 text-white'
                                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                        }`}
                    >
                        Manual Create
                    </button>
                </div>
            </section>

            {mode === 'generate' && (
                <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg">
                    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Generate Scenario</h2>
                            <p className="mt-1 text-sm text-zinc-400">
                                Configure injuries and let the backend generate vitals, expected actions, and
                                scenario content.
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
                        <div>
                            <label className="mb-2 block text-sm text-zinc-300">Scenario title</label>
                            <input
                                value={generateForm.title}
                                onChange={(event) => updateGenerateField('title', event.target.value)}
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-zinc-300">Difficulty</label>
                            <select
                                value={generateForm.difficultyLevel}
                                onChange={(event) =>
                                    updateGenerateField('difficultyLevel', event.target.value as DifficultyLevel)
                                }
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            >
                                {difficultyOptions.map((difficulty) => (
                                    <option key={difficulty} value={difficulty}>
                                        {formatEnum(difficulty)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>
            )}

            {mode === 'manual' && (
                <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg">
                    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Manual Scenario Creation</h2>
                            <p className="mt-1 text-sm text-zinc-400">
                                Instructor-controlled scenario with custom vitals and expected actions.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleCreateManual}
                            disabled={loading}
                            className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? 'Creating...' : 'Create Manual Scenario'}
                        </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm text-zinc-300">Title</label>
                            <input
                                value={manualForm.title}
                                onChange={(event) => updateManualField('title', event.target.value)}
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-zinc-300">Difficulty</label>
                            <select
                                value={manualForm.difficultyLevel}
                                onChange={(event) =>
                                    updateManualField('difficultyLevel', event.target.value as DifficultyLevel)
                                }
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            >
                                {difficultyOptions.map((difficulty) => (
                                    <option key={difficulty} value={difficulty}>
                                        {formatEnum(difficulty)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm text-zinc-300">Legend</label>
                            <textarea
                                value={manualForm.legend}
                                onChange={(event) => updateManualField('legend', event.target.value)}
                                className="min-h-20 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm text-zinc-300">Narrative</label>
                            <textarea
                                value={manualForm.narrative}
                                onChange={(event) => updateManualField('narrative', event.target.value)}
                                className="min-h-20 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm text-zinc-300">Scenario flow notes</label>
                            <textarea
                                value={manualForm.scenarioFlowNotes}
                                onChange={(event) => updateManualField('scenarioFlowNotes', event.target.value)}
                                className="min-h-20 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            />
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                        <h3 className="text-lg font-semibold text-white">Initial Vital Signs</h3>

                        <div className="mt-4 grid gap-4 md:grid-cols-4">
                            <NumberInput
                                label="Heart rate"
                                value={manualForm.vitalSigns.heartRate}
                                onChange={(value) =>
                                    updateManualField('vitalSigns', {
                                        ...manualForm.vitalSigns,
                                        heartRate: value,
                                    })
                                }
                            />
                            <NumberInput
                                label="Systolic BP"
                                value={manualForm.vitalSigns.systolicBp}
                                onChange={(value) =>
                                    updateManualField('vitalSigns', {
                                        ...manualForm.vitalSigns,
                                        systolicBp: value,
                                    })
                                }
                            />
                            <NumberInput
                                label="Diastolic BP"
                                value={manualForm.vitalSigns.diastolicBp}
                                onChange={(value) =>
                                    updateManualField('vitalSigns', {
                                        ...manualForm.vitalSigns,
                                        diastolicBp: value,
                                    })
                                }
                            />
                            <NumberInput
                                label="Respiratory rate"
                                value={manualForm.vitalSigns.respiratoryRate}
                                onChange={(value) =>
                                    updateManualField('vitalSigns', {
                                        ...manualForm.vitalSigns,
                                        respiratoryRate: value,
                                    })
                                }
                            />
                            <NumberInput
                                label="SpO2"
                                value={manualForm.vitalSigns.spo2}
                                onChange={(value) =>
                                    updateManualField('vitalSigns', {
                                        ...manualForm.vitalSigns,
                                        spo2: value,
                                    })
                                }
                            />
                            <NumberInput
                                label="Pain level"
                                value={manualForm.vitalSigns.painLevel}
                                onChange={(value) =>
                                    updateManualField('vitalSigns', {
                                        ...manualForm.vitalSigns,
                                        painLevel: value,
                                    })
                                }
                            />

                            <div>
                                <label className="mb-2 block text-sm text-zinc-300">AVPU</label>
                                <select
                                    value={manualForm.vitalSigns.consciousnessLevel}
                                    onChange={(event) =>
                                        updateManualField('vitalSigns', {
                                            ...manualForm.vitalSigns,
                                            consciousnessLevel: event.target.value as 'A' | 'V' | 'P' | 'U',
                                        })
                                    }
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                                >
                                    <option value="A">A</option>
                                    <option value="V">V</option>
                                    <option value="P">P</option>
                                    <option value="U">U</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-zinc-300">Skin condition</label>
                                <input
                                    value={manualForm.vitalSigns.skinCondition}
                                    onChange={(event) =>
                                        updateManualField('vitalSigns', {
                                            ...manualForm.vitalSigns,
                                            skinCondition: event.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Injuries</h2>
                        <p className="mt-1 text-sm text-zinc-400">
                            Current mode contains {activeInjuries.length} injury record(s).
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={mode === 'generate' ? addGenerateInjury : addManualInjury}
                        className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800"
                    >
                        Add injury
                    </button>
                </div>

                <div className="space-y-4">
                    {activeInjuries.map((injury, index) => (
                        <div key={index} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                            <div className="mb-4 flex items-center justify-between">
                                <p className="font-semibold text-white">Injury #{index + 1}</p>

                                {activeInjuries.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            mode === 'generate' ? removeGenerateInjury(index) : removeManualInjury(index)
                                        }
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
                                            mode === 'generate'
                                                ? updateGenerateInjury(
                                                    index,
                                                    'mechanism',
                                                    event.target.value as ScenarioInjuryRequest['mechanism'],
                                                )
                                                : updateManualInjury(
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
                                            mode === 'generate'
                                                ? updateGenerateInjury(
                                                    index,
                                                    'region',
                                                    event.target.value as ScenarioInjuryRequest['region'],
                                                )
                                                : updateManualInjury(
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
                                            mode === 'generate'
                                                ? updateGenerateInjury(
                                                    index,
                                                    'severity',
                                                    event.target.value as ScenarioInjuryRequest['severity'],
                                                )
                                                : updateManualInjury(
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
                                {[
                                    ['activeBleeding', 'Active bleeding'],
                                    ['airwayCompromised', 'Airway compromised'],
                                    ['breathingCompromised', 'Breathing compromised'],
                                    ['consciousnessAffected', 'Consciousness affected'],
                                ].map(([field, label]) => (
                                    <label
                                        key={field}
                                        className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-3 text-sm text-zinc-300"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={Boolean(injury[field as keyof ScenarioInjuryRequest])}
                                            onChange={(event) =>
                                                mode === 'generate'
                                                    ? updateGenerateInjury(
                                                        index,
                                                        field as keyof ScenarioInjuryRequest,
                                                        event.target.checked as never,
                                                    )
                                                    : updateManualInjury(
                                                        index,
                                                        field as keyof ScenarioInjuryRequest,
                                                        event.target.checked as never,
                                                    )
                                            }
                                        />
                                        {label}
                                    </label>
                                ))}
                            </div>

                            <div className="mt-4">
                                <label className="mb-2 block text-sm text-zinc-300">Description</label>
                                <textarea
                                    value={injury.description}
                                    onChange={(event) =>
                                        mode === 'generate'
                                            ? updateGenerateInjury(index, 'description', event.target.value)
                                            : updateManualInjury(index, 'description', event.target.value)
                                    }
                                    className="min-h-20 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {mode === 'manual' && (
                <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Expected Actions</h2>
                            <p className="mt-1 text-sm text-zinc-400">
                                Use manipulation IDs from the database for now. Later this can be replaced by a
                                dropdown.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={addExpectedAction}
                            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800"
                        >
                            Add action
                        </button>
                    </div>

                    <div className="space-y-4">
                        {manualForm.expectedActions.map((action, index) => (
                            <div key={index} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <p className="font-semibold text-white">Action #{index + 1}</p>

                                    {manualForm.expectedActions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeExpectedAction(index)}
                                            className="text-sm font-medium text-red-400 transition hover:text-red-300"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-4">
                                    <div>
                                        <label className="mb-2 block text-sm text-zinc-300">TCCC Stage</label>
                                        <select
                                            value={action.tcccStage}
                                            onChange={(event) =>
                                                updateExpectedAction(index, 'tcccStage', event.target.value as TcccStage)
                                            }
                                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                                        >
                                            {tcccStages.map((stage) => (
                                                <option key={stage} value={stage}>
                                                    {stage}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm text-zinc-300">Action Type</label>
                                        <select
                                            value={action.actionType}
                                            onChange={(event) =>
                                                updateExpectedAction(
                                                    index,
                                                    'actionType',
                                                    event.target.value as ExpectedActionType,
                                                )
                                            }
                                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                                        >
                                            {actionTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {formatEnum(type)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm text-zinc-300">Manipulation</label>
                                        <select
                                            value={action.manipulationId ?? ''}
                                            onChange={(event) =>
                                                updateExpectedAction(
                                                    index,
                                                    'manipulationId',
                                                    event.target.value ? Number(event.target.value) : null,
                                                )
                                            }
                                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                                        >
                                            <option value="">
                                                {manipulationsLoading ? 'Loading manipulations...' : 'Select manipulation'}
                                            </option>

                                            {manipulations.map((manipulation) => (
                                                <option key={manipulation.id} value={manipulation.id}>
                                                    {manipulation.code} — {manipulation.title}
                                                </option>
                                            ))}
                                        </select>

                                        {action.manipulationId && (
                                            <p className="mt-2 text-xs text-zinc-500">
                                                {
                                                    manipulations.find((manipulation) => manipulation.id === action.manipulationId)
                                                        ?.description
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <NumberInput
                                        label="Priority"
                                        value={action.priorityOrder}
                                        onChange={(value) => updateExpectedAction(index, 'priorityOrder', value)}
                                    />
                                </div>

                                <div className="mt-4 grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm text-zinc-300">Title</label>
                                        <input
                                            value={action.title}
                                            onChange={(event) =>
                                                updateExpectedAction(index, 'title', event.target.value)
                                            }
                                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                                        />
                                    </div>

                                    <label className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-3 text-sm text-zinc-300 md:mt-7">
                                        <input
                                            type="checkbox"
                                            checked={action.critical}
                                            onChange={(event) =>
                                                updateExpectedAction(index, 'critical', event.target.checked)
                                            }
                                        />
                                        Critical action
                                    </label>

                                    <div className="md:col-span-2">
                                        <label className="mb-2 block text-sm text-zinc-300">Description</label>
                                        <textarea
                                            value={action.description}
                                            onChange={(event) =>
                                                updateExpectedAction(index, 'description', event.target.value)
                                            }
                                            className="min-h-20 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-2 block text-sm text-zinc-300">Rationale</label>
                                        <textarea
                                            value={action.rationale}
                                            onChange={(event) =>
                                                updateExpectedAction(index, 'rationale', event.target.value)
                                            }
                                            className="min-h-20 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {!scenario && (
                <section className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 p-8 text-center">
                    <h2 className="text-xl font-semibold text-white">No active scenario</h2>
                    <p className="mt-2 text-zinc-400">Generate or manually create a scenario to begin.</p>
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

                            <div className="flex flex-col gap-3">
                                <input
                                    value={cadetId}
                                    onChange={(event) => setCadetId(event.target.value)}
                                    className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                                    placeholder="Cadet ID"
                                />

                                <button
                                    type="button"
                                    onClick={handleStartSession}
                                    disabled={Boolean(session)}
                                    className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {session ? 'Session Started' : 'Start Session'}
                                </button>
                            </div>
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
                                    onClick={handleLoadSummary}
                                    className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-semibold text-zinc-300 transition hover:bg-zinc-800"
                                >
                                    Load Summary
                                </button>
                            </div>
                        )}
                    </section>

                    <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
                        {scenario.vitalSigns && (
                            <>
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                                    <p className="text-xs uppercase tracking-wide text-zinc-500">Heart Rate</p>
                                    <p className="mt-2 text-2xl font-bold text-white">
                                        {scenario.vitalSigns.heartRate}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                                    <p className="text-xs uppercase tracking-wide text-zinc-500">BP</p>
                                    <p className="mt-2 text-2xl font-bold text-white">
                                        {scenario.vitalSigns.systolicBp}/{scenario.vitalSigns.diastolicBp}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                                    <p className="text-xs uppercase tracking-wide text-zinc-500">RR</p>
                                    <p className="mt-2 text-2xl font-bold text-white">
                                        {scenario.vitalSigns.respiratoryRate}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                                    <p className="text-xs uppercase tracking-wide text-zinc-500">SpO2</p>
                                    <p className="mt-2 text-2xl font-bold text-white">
                                        {scenario.vitalSigns.spo2}%
                                    </p>
                                </div>
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                                    <p className="text-xs uppercase tracking-wide text-zinc-500">AVPU</p>
                                    <p className="mt-2 text-2xl font-bold text-white">
                                        {scenario.vitalSigns.consciousnessLevel}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                                    <p className="text-xs uppercase tracking-wide text-zinc-500">Pain</p>
                                    <p className="mt-2 text-2xl font-bold text-white">
                                        {scenario.vitalSigns.painLevel}/10
                                    </p>
                                </div>
                            </>
                        )}
                    </section>

                    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6">
                        <h2 className="text-xl font-semibold text-white">Expected Actions</h2>

                        <div className="mt-5 space-y-4">
                            {scenario.expectedActions?.map((action) => {
                                const executed = isActionExecuted(action.id)
                                const execution = getExecutionForAction(action.id)

                                return (
                                    <div key={action.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
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
                                                    Manipulation: {action.manipulationTitle || action.manipulationId || 'N/A'}
                                                </p>

                                                {execution && (
                                                    <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-sm">
                            <span className={execution.correct ? 'text-emerald-400' : 'text-red-400'}>
                              {execution.correct ? 'SUCCESS' : 'FAILED'}
                            </span>
                                                        <span className="ml-3 text-zinc-300">
                              Score: {execution.scoreDelta > 0 ? '+' : ''}
                                                            {execution.scoreDelta}
                            </span>
                                                    </div>
                                                )}
                                            </div>

                                            {session && !executed && action.manipulationId && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleExecuteAction(action)}
                                                    className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500"
                                                >
                                                    Execute
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
                                    <p className="mt-1 text-xl font-bold text-white">{summary.accuracyPercent}%</p>
                                </div>
                                <div className="rounded-xl bg-zinc-950/70 p-4">
                                    <p className="text-sm text-zinc-500">Correct</p>
                                    <p className="mt-1 text-xl font-bold text-white">{summary.correctActions}</p>
                                </div>
                                <div className="rounded-xl bg-zinc-950/70 p-4">
                                    <p className="text-sm text-zinc-500">Incorrect</p>
                                    <p className="mt-1 text-xl font-bold text-white">{summary.incorrectActions}</p>
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