import { useEffect, useMemo, useState } from 'react'
import { canManageTests } from '../auth/authRole'
import { getLabels } from '../features/tests/testApi'
import { createPracticalSkill, getPracticalSkills } from '../features/practical/practicalApi'
import type { LabelResponse } from '../types/test'
import type {
    CreatePracticalSkillRequest,
    PracticalSkillResponse,
    PracticalStepRequest,
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

function getSkillTitle(skill: PracticalSkillResponse) {
    return skill.title || skill.name || 'Untitled practical skill'
}

export default function PracticalPage() {
    const [skills, setSkills] = useState<PracticalSkillResponse[]>([])
    const [labels, setLabels] = useState<LabelResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [labelsLoading, setLabelsLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState<CreatePracticalSkillRequest>(createDefaultForm())

    const allowSkillManagement = canManageTests()

    const selectedLabels = useMemo(() => {
        return labels.filter((label) => form.labelIds.includes(label.id))
    }, [labels, form.labelIds])

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
                            <p className="text-xs uppercase tracking-wide text-red-400">
                                {skill.category || 'Practical'}
                            </p>
                            <h2 className="mt-2 text-xl font-semibold text-white">{getSkillTitle(skill)}</h2>
                            <p className="mt-2 text-sm text-zinc-400">{skill.description}</p>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {skill.labels?.map((label) => (
                                <span
                                    key={label}
                                    className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs text-zinc-400"
                                >
                  {label}
                </span>
                            ))}
                        </div>

                        <p className="mt-4 text-sm text-zinc-500">Steps: {skill.steps?.length ?? 0}</p>

                        <button
                            type="button"
                            className="mt-5 w-full rounded-xl border border-zinc-700 px-4 py-3 font-semibold text-zinc-200 transition hover:bg-zinc-800"
                        >
                            Open Skill
                        </button>
                    </article>
                ))}
            </section>
        </div>
    )
}