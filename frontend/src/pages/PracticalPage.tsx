import { useEffect, useMemo, useState } from 'react'
import { canManageTests } from '../auth/authRole'
import { getLabels } from '../features/tests/testApi'
import {
    createPracticalSkill,
    getPracticalSkills,
    submitPracticalResult,
} from '../features/practical/practicalApi'
import type { LabelResponse } from '../types/test'
import type {
    CreatePracticalSkillRequest,
    PracticalResultResponse,
    PracticalSkillResponse,
    PracticalStepRequest,
    PracticalStepResponse,
    PracticalStepStatus,
    SubmitPracticalStepRequest,
} from '../types/practical'

function createDefaultStep(order: number): PracticalStepRequest {
    return {
        title: `Step ${order}`,
        description: 'Describe the expected practical action.',
        stepOrder: order,
        critical: order === 1,
    }
}

function createDefaultForm(): CreatePracticalSkillRequest {
    return {
        name: 'New Practical Skill',
        description: 'Instructor-created practical skill for TCCC training.',
        steps: [createDefaultStep(1)],
        labelIds: [],
    }
}

function getDefaultEvaluationSteps(skill: PracticalSkillResponse): SubmitPracticalStepRequest[] {
    return skill.steps.map((step) => ({
        stepId: step.id,
        status: 'PASSED',
        score: step.maxScore,
        comment: '',
    }))
}

function getResultPercentage(result: PracticalResultResponse | null) {
    if (!result?.percentage && result?.percentage !== 0) return '0.00'
    return Number(result.percentage).toFixed(2)
}

export default function PracticalPage() {
    const [skills, setSkills] = useState<PracticalSkillResponse[]>([])
    const [labels, setLabels] = useState<LabelResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [labelsLoading, setLabelsLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [error, setError] = useState('')

    const [form, setForm] = useState<CreatePracticalSkillRequest>(createDefaultForm())
    const [selectedSkill, setSelectedSkill] = useState<PracticalSkillResponse | null>(null)
    const [cadetId, setCadetId] = useState('1')
    const [instructorId, setInstructorId] = useState('1')
    const [evaluationComment, setEvaluationComment] = useState('')
    const [evaluationSteps, setEvaluationSteps] = useState<SubmitPracticalStepRequest[]>([])
    const [evaluationResult, setEvaluationResult] = useState<PracticalResultResponse | null>(null)

    const allowSkillManagement = canManageTests()

    const selectedLabels = useMemo(() => {
        return labels.filter((label) => form.labelIds.includes(label.id))
    }, [labels, form.labelIds])

    const evaluationTotalScore = useMemo(() => {
        return evaluationSteps.reduce((sum, step) => sum + step.score, 0)
    }, [evaluationSteps])

    const selectedSkillMaxScore = selectedSkill?.maxScore ?? 0

    useEffect(() => {
        loadSkills()
        loadLabels()
    }, [])

    async function loadSkills() {
        try {
            setLoading(true)
            setError('')
            const data = await getPracticalSkills()
            setSkills(data)
        } catch (error) {
            console.error(error)
            setError('Failed to load practical skills')
        } finally {
            setLoading(false)
        }
    }

    async function loadLabels() {
        try {
            setLabelsLoading(true)
            const data = await getLabels()
            setLabels(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLabelsLoading(false)
        }
    }

    function openSkill(skill: PracticalSkillResponse) {
        setSelectedSkill(skill)
        setEvaluationSteps(getDefaultEvaluationSteps(skill))
        setEvaluationComment('')
        setEvaluationResult(null)
        setError('')
    }

    function closeSkill() {
        setSelectedSkill(null)
        setEvaluationSteps([])
        setEvaluationComment('')
        setEvaluationResult(null)
    }

    function toggleLabel(labelId: number) {
        setForm((prev) => {
            const selected = prev.labelIds.includes(labelId)

            return {
                ...prev,
                labelIds: selected
                    ? prev.labelIds.filter((id) => id !== labelId)
                    : [...prev.labelIds, labelId],
            }
        })
    }

    function updateStep<K extends keyof PracticalStepRequest>(
        stepIndex: number,
        field: K,
        value: PracticalStepRequest[K],
    ) {
        setForm((prev) => ({
            ...prev,
            steps: prev.steps.map((step, index) =>
                index === stepIndex
                    ? {
                        ...step,
                        [field]: value,
                    }
                    : step,
            ),
        }))
    }

    function addStep() {
        setForm((prev) => ({
            ...prev,
            steps: [...prev.steps, createDefaultStep(prev.steps.length + 1)],
        }))
    }

    function removeStep(stepIndex: number) {
        setForm((prev) => ({
            ...prev,
            steps: prev.steps
                .filter((_, index) => index !== stepIndex)
                .map((step, index) => ({
                    ...step,
                    stepOrder: index + 1,
                })),
        }))
    }

    function getEvaluationStep(stepId: number) {
        return evaluationSteps.find((step) => step.stepId === stepId)
    }

    function updateEvaluationStep<K extends keyof SubmitPracticalStepRequest>(
        stepId: number,
        field: K,
        value: SubmitPracticalStepRequest[K],
    ) {
        setEvaluationSteps((prev) =>
            prev.map((step) =>
                step.stepId === stepId
                    ? {
                        ...step,
                        [field]: value,
                    }
                    : step,
            ),
        )
    }

    function applyStatusPreset(step: PracticalStepResponse, status: PracticalStepStatus) {
        if (status === 'PASSED') {
            updateEvaluationStep(step.id, 'status', 'PASSED')
            updateEvaluationStep(step.id, 'score', step.maxScore)
            return
        }

        if (status === 'PARTIAL') {
            updateEvaluationStep(step.id, 'status', 'PARTIAL')
            updateEvaluationStep(step.id, 'score', Math.floor(step.maxScore / 2))
            return
        }

        updateEvaluationStep(step.id, 'status', 'FAILED')
        updateEvaluationStep(step.id, 'score', 0)
    }

    async function handleCreateSkill() {
        setError('')

        if (!allowSkillManagement) {
            setError('Only instructors and admins can create practical skills')
            return
        }

        if (!form.name.trim()) {
            setError('Skill name is required')
            return
        }

        if (!form.description.trim()) {
            setError('Skill description is required')
            return
        }

        if (form.steps.length === 0) {
            setError('At least one step is required')
            return
        }

        const invalidStep = form.steps.some(
            (step) => !step.title.trim() || !step.description.trim() || step.stepOrder <= 0,
        )

        if (invalidStep) {
            setError('Each step needs title, description, and valid order')
            return
        }

        try {
            setCreating(true)

            const created = await createPracticalSkill({
                ...form,
                name: form.name.trim(),
                description: form.description.trim(),
                steps: form.steps.map((step, index) => ({
                    ...step,
                    title: step.title.trim(),
                    description: step.description.trim(),
                    stepOrder: index + 1,
                })),
            })

            setSkills((prev) => [created, ...prev])
            setForm(createDefaultForm())
            setShowCreateForm(false)
        } catch (error) {
            console.error(error)
            setError('Failed to create practical skill')
        } finally {
            setCreating(false)
        }
    }

    async function handleSubmitEvaluation() {
        if (!selectedSkill) return

        setError('')

        const cadetIdNumber = Number(cadetId)
        const instructorIdNumber = Number(instructorId)

        if (!Number.isFinite(cadetIdNumber) || cadetIdNumber <= 0) {
            setError('Valid cadet ID is required')
            return
        }

        if (!Number.isFinite(instructorIdNumber) || instructorIdNumber <= 0) {
            setError('Valid instructor ID is required')
            return
        }

        if (evaluationSteps.length !== selectedSkill.steps.length) {
            setError('All steps must be evaluated')
            return
        }

        const invalidScore = evaluationSteps.some((evaluationStep) => {
            const skillStep = selectedSkill.steps.find((step) => step.id === evaluationStep.stepId)
            if (!skillStep) return true
            return evaluationStep.score < 0 || evaluationStep.score > skillStep.maxScore
        })

        if (invalidScore) {
            setError('Step score cannot be less than 0 or greater than step max score')
            return
        }

        try {
            setSubmitting(true)

            const result = await submitPracticalResult({
                skillId: selectedSkill.id,
                cadetId: cadetIdNumber,
                instructorId: instructorIdNumber,
                comment: evaluationComment.trim(),
                steps: evaluationSteps.map((step) => ({
                    ...step,
                    comment: step.comment.trim(),
                })),
            })

            setEvaluationResult(result)
        } catch (error) {
            console.error(error)
            setError('Failed to submit practical evaluation')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="space-y-8">
            <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Practical Skills Lab</h1>
                    <p className="mt-2 text-zinc-400">
                        Instructor-defined TCCC practical skills with ordered evaluation steps.
                    </p>
                </div>

                {allowSkillManagement && (
                    <button
                        type="button"
                        onClick={() => setShowCreateForm((prev) => !prev)}
                        className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500"
                    >
                        {showCreateForm ? 'Close Form' : 'Create Practical Skill'}
                    </button>
                )}
            </section>

            {error && (
                <div className="rounded-2xl border border-red-900 bg-red-950/30 p-4 text-red-200">
                    {error}
                </div>
            )}

            {selectedSkill && (
                <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg">
                    <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-red-400">Practical Evaluation</p>
                            <h2 className="mt-2 text-2xl font-bold text-white">{selectedSkill.name}</h2>
                            <p className="mt-2 max-w-3xl text-sm text-zinc-400">{selectedSkill.description}</p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {selectedSkill.labels.map((label) => (
                                    <span
                                        key={label}
                                        className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-300"
                                    >
                    {label}
                  </span>
                                ))}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={closeSkill}
                            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800"
                        >
                            Close
                        </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <label className="mb-2 block text-sm text-zinc-300">Cadet ID</label>
                            <input
                                value={cadetId}
                                onChange={(event) => setCadetId(event.target.value)}
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-zinc-300">Instructor ID</label>
                            <input
                                value={instructorId}
                                onChange={(event) => setInstructorId(event.target.value)}
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            />
                        </div>

                        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                            <p className="text-sm text-zinc-500">Current score</p>
                            <p className="mt-1 text-xl font-bold text-white">
                                {evaluationTotalScore} / {selectedSkillMaxScore}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        {selectedSkill.steps.map((step) => {
                            const evaluation = getEvaluationStep(step.id)

                            return (
                                <div
                                    key={step.id}
                                    className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4"
                                >
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                        <div>
                                            <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
                          Step #{step.stepOrder}
                        </span>
                                                <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
                          Max {step.maxScore} pts
                        </span>
                                                {step.critical && (
                                                    <span className="rounded-full bg-red-950/60 px-3 py-1 text-xs text-red-300">
                            Critical
                          </span>
                                                )}
                                            </div>

                                            <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
                                            <p className="mt-1 text-sm text-zinc-400">{step.description}</p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {(['PASSED', 'PARTIAL', 'FAILED'] as PracticalStepStatus[]).map((status) => (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    onClick={() => applyStatusPreset(step, status)}
                                                    className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                                                        evaluation?.status === status
                                                            ? 'border-red-800 bg-red-950/40 text-red-200'
                                                            : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                                                    }`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-4 md:grid-cols-[160px_1fr]">
                                        <div>
                                            <label className="mb-2 block text-sm text-zinc-300">Score</label>
                                            <input
                                                type="number"
                                                min={0}
                                                max={step.maxScore}
                                                value={evaluation?.score ?? 0}
                                                onChange={(event) =>
                                                    updateEvaluationStep(step.id, 'score', Number(event.target.value))
                                                }
                                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm text-zinc-300">Step comment</label>
                                            <input
                                                value={evaluation?.comment ?? ''}
                                                onChange={(event) =>
                                                    updateEvaluationStep(step.id, 'comment', event.target.value)
                                                }
                                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                                                placeholder="Instructor note for this step"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-6">
                        <label className="mb-2 block text-sm text-zinc-300">Overall instructor comment</label>
                        <textarea
                            value={evaluationComment}
                            onChange={(event) => setEvaluationComment(event.target.value)}
                            className="min-h-24 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            placeholder="Overall performance feedback"
                        />
                    </div>

                    {!evaluationResult && (
                        <button
                            type="button"
                            onClick={handleSubmitEvaluation}
                            disabled={submitting}
                            className="mt-6 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? 'Submitting...' : 'Submit Evaluation'}
                        </button>
                    )}

                    {evaluationResult && (
                        <div
                            className={`mt-6 rounded-2xl border p-5 ${
                                evaluationResult.resultStatus === 'FAILED'
                                    ? 'border-red-900 bg-red-950/30 text-red-100'
                                    : 'border-emerald-900 bg-emerald-950/30 text-emerald-100'
                            }`}
                        >
                            <h3 className="text-xl font-bold">
                                Practical Result: {evaluationResult.resultStatus || 'SAVED'}
                            </h3>
                            <p className="mt-2">
                                Score: {evaluationResult.totalScore ?? evaluationTotalScore} /{' '}
                                {evaluationResult.maxScore ?? selectedSkillMaxScore}
                            </p>
                            <p className="mt-1">Percentage: {getResultPercentage(evaluationResult)}%</p>
                        </div>
                    )}
                </section>
            )}

            {allowSkillManagement && showCreateForm && (
                <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg">
                    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Create Practical Skill</h2>
                            <p className="mt-1 text-sm text-zinc-400">
                                Define a practical task, attach labels, and create ordered instructor evaluation steps.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleCreateSkill}
                            disabled={creating}
                            className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {creating ? 'Creating...' : 'Save Skill'}
                        </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm text-zinc-300">Skill name</label>
                            <input
                                value={form.name}
                                onChange={(event) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        name: event.target.value,
                                    }))
                                }
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-zinc-300">Selected labels</label>
                            <div className="min-h-[50px] rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3">
                                {selectedLabels.length === 0 ? (
                                    <span className="text-sm text-zinc-500">No labels selected</span>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedLabels.map((label) => (
                                            <span
                                                key={label.id}
                                                className="rounded-full border border-red-800 bg-red-950/30 px-3 py-1 text-xs text-red-200"
                                            >
                        {label.name}
                      </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm text-zinc-300">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(event) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        description: event.target.value,
                                    }))
                                }
                                className="min-h-24 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            />
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                        <h3 className="text-lg font-semibold text-white">Skill Labels</h3>
                        <p className="mt-1 text-sm text-zinc-500">
                            Labels connect practical skills to analytics and weak-skill detection.
                        </p>

                        {labelsLoading ? (
                            <p className="mt-4 text-sm text-zinc-500">Loading labels...</p>
                        ) : labels.length === 0 ? (
                            <p className="mt-4 rounded-xl border border-yellow-900 bg-yellow-950/20 p-3 text-sm text-yellow-200">
                                No labels found. Create labels in the Tests module first.
                            </p>
                        ) : (
                            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {labels.map((label) => (
                                    <label
                                        key={label.id}
                                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                                            form.labelIds.includes(label.id)
                                                ? 'border-red-800 bg-red-950/30 text-red-200'
                                                : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={form.labelIds.includes(label.id)}
                                            onChange={() => toggleLabel(label.id)}
                                        />
                                        <span>{label.name}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <h3 className="text-lg font-semibold text-white">Evaluation Steps</h3>

                            <button
                                type="button"
                                onClick={addStep}
                                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800"
                            >
                                Add Step
                            </button>
                        </div>

                        {form.steps.map((step, stepIndex) => (
                            <div
                                key={stepIndex}
                                className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4"
                            >
                                <div className="mb-4 flex items-center justify-between gap-4">
                                    <p className="font-semibold text-white">Step #{stepIndex + 1}</p>

                                    {form.steps.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeStep(stepIndex)}
                                            className="text-sm font-medium text-red-400 hover:text-red-300"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                                    <div>
                                        <label className="mb-2 block text-sm text-zinc-300">Step title</label>
                                        <input
                                            value={step.title}
                                            onChange={(event) => updateStep(stepIndex, 'title', event.target.value)}
                                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                                        />
                                    </div>

                                    <label className="mt-7 flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300">
                                        <input
                                            type="checkbox"
                                            checked={step.critical}
                                            onChange={(event) => updateStep(stepIndex, 'critical', event.target.checked)}
                                        />
                                        Critical step
                                    </label>
                                </div>

                                <div className="mt-4">
                                    <label className="mb-2 block text-sm text-zinc-300">Step description</label>
                                    <textarea
                                        value={step.description}
                                        onChange={(event) => updateStep(stepIndex, 'description', event.target.value)}
                                        className="min-h-20 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {!selectedSkill && (
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {loading && <p className="text-zinc-300">Loading practical skills...</p>}

                    {!loading && skills.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 p-8 text-center md:col-span-2 xl:col-span-3">
                            <h2 className="text-xl font-semibold text-white">No practical skills found</h2>
                            <p className="mt-2 text-zinc-400">Create the first practical skill.</p>
                        </div>
                    )}

                    {skills.map((skill) => (
                        <article
                            key={skill.id}
                            className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg"
                        >
                            <div>
                                <p className="text-xs uppercase tracking-wide text-red-400">Practical</p>
                                <h2 className="mt-2 text-xl font-semibold text-white">{skill.name}</h2>
                                <p className="mt-2 text-sm text-zinc-400">{skill.description}</p>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {skill.labels.map((label) => (
                                    <span
                                        key={label}
                                        className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs text-zinc-400"
                                    >
                    {label}
                  </span>
                                ))}
                            </div>

                            <p className="mt-4 text-sm text-zinc-500">
                                Steps: {skill.steps.length} · Max score: {skill.maxScore}
                            </p>

                            <button
                                type="button"
                                onClick={() => openSkill(skill)}
                                className="mt-5 w-full rounded-xl border border-zinc-700 px-4 py-3 font-semibold text-zinc-200 transition hover:bg-zinc-800"
                            >
                                Open Skill
                            </button>
                        </article>
                    ))}
                </section>
            )}
        </div>
    )
}