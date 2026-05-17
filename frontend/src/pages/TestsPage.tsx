import { useEffect, useMemo, useState } from 'react'
import { canManageTests } from '../auth/authRole'
import { createLabel, createTest, getLabels, getTests } from '../features/tests/testApi'
import type {
    CreateQuestionRequest,
    CreateTestRequest,
    LabelResponse,
    TestResponse,
} from '../types/test'

function createDefaultQuestion(order: number): CreateQuestionRequest {
    return {
        questionText: 'New TCCC question',
        points: 10,
        questionOrder: order,
        labelIds: [],
        answers: [
            {
                answerText: 'Correct answer',
                correct: true,
                answerOrder: 1,
            },
            {
                answerText: 'Incorrect answer',
                correct: false,
                answerOrder: 2,
            },
        ],
    }
}

function createDefaultForm(): CreateTestRequest {
    return {
        title: 'New TCCC Knowledge Test',
        description: 'Assessment of tactical medicine theory and TCCC decision-making.',
        difficulty: 'MEDIUM',
        labelIds: [],
        questions: [createDefaultQuestion(1)],
    }
}

export default function TestsPage() {
    const [tests, setTests] = useState<TestResponse[]>([])
    const [labels, setLabels] = useState<LabelResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [labelsLoading, setLabelsLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState<CreateTestRequest>(createDefaultForm())
    const [labelForm, setLabelForm] = useState({
        name: '',
        criticality: 1,
    })
    const [creatingLabel, setCreatingLabel] = useState(false)

    const allowTestManagement = canManageTests()

    useEffect(() => {
        loadTests()
        loadLabels()
    }, [])

    async function handleCreateLabel() {
        setError('')

        if (!allowTestManagement) {
            setError('Only instructors and admins can create labels')
            return
        }

        if (!labelForm.name.trim()) {
            setError('Label name is required')
            return
        }

        try {
            setCreatingLabel(true)

            const created = await createLabel({
                name: labelForm.name.trim(),
                criticality: labelForm.criticality,
            })

            setLabels((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)))
            setLabelForm({
                name: '',
                criticality: 1,
            })
        } catch (error) {
            console.error(error)
            setError('Failed to create label')
        } finally {
            setCreatingLabel(false)
        }
    }

    async function loadTests() {
        try {
            setLoading(true)
            setError('')
            const data = await getTests()
            setTests(data)
        } catch (error) {
            console.error(error)
            setError('Failed to load tests')
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

    const selectedTestLabelIds = useMemo(() => {
        return Array.from(
            new Set(
                form.questions.flatMap((question) => question.labelIds),
            ),
        )
    }, [form.questions])

    function updateQuestion<K extends keyof CreateQuestionRequest>(
        questionIndex: number,
        field: K,
        value: CreateQuestionRequest[K],
    ) {
        setForm((prev) => ({
            ...prev,
            questions: prev.questions.map((question, index) =>
                index === questionIndex
                    ? {
                        ...question,
                        [field]: value,
                    }
                    : question,
            ),
        }))
    }

    function toggleQuestionLabel(questionIndex: number, labelId: number) {
        setForm((prev) => ({
            ...prev,
            questions: prev.questions.map((question, index) => {
                if (index !== questionIndex) return question

                const alreadySelected = question.labelIds.includes(labelId)

                return {
                    ...question,
                    labelIds: alreadySelected
                        ? question.labelIds.filter((id) => id !== labelId)
                        : [...question.labelIds, labelId],
                }
            }),
        }))
    }

    function updateAnswer(
        questionIndex: number,
        answerIndex: number,
        field: 'answerText' | 'correct',
        value: string | boolean,
    ) {
        setForm((prev) => ({
            ...prev,
            questions: prev.questions.map((question, qIndex) => {
                if (qIndex !== questionIndex) return question

                return {
                    ...question,
                    answers: question.answers.map((answer, aIndex) =>
                        aIndex === answerIndex
                            ? {
                                ...answer,
                                [field]: value,
                            }
                            : answer,
                    ),
                }
            }),
        }))
    }

    function addQuestion() {
        setForm((prev) => ({
            ...prev,
            questions: [...prev.questions, createDefaultQuestion(prev.questions.length + 1)],
        }))
    }

    function removeQuestion(questionIndex: number) {
        setForm((prev) => ({
            ...prev,
            questions: prev.questions
                .filter((_, index) => index !== questionIndex)
                .map((question, index) => ({
                    ...question,
                    questionOrder: index + 1,
                })),
        }))
    }

    function addAnswer(questionIndex: number) {
        setForm((prev) => ({
            ...prev,
            questions: prev.questions.map((question, index) => {
                if (index !== questionIndex) return question

                return {
                    ...question,
                    answers: [
                        ...question.answers,
                        {
                            answerText: 'New answer',
                            correct: false,
                            answerOrder: question.answers.length + 1,
                        },
                    ],
                }
            }),
        }))
    }

    function removeAnswer(questionIndex: number, answerIndex: number) {
        setForm((prev) => ({
            ...prev,
            questions: prev.questions.map((question, qIndex) => {
                if (qIndex !== questionIndex) return question

                return {
                    ...question,
                    answers: question.answers
                        .filter((_, aIndex) => aIndex !== answerIndex)
                        .map((answer, index) => ({
                            ...answer,
                            answerOrder: index + 1,
                        })),
                }
            }),
        }))
    }

    async function handleCreateTest() {
        setError('')

        if (!allowTestManagement) {
            setError('Only instructors and admins can create tests')
            return
        }

        if (!form.title.trim()) {
            setError('Test title is required')
            return
        }

        if (!form.description.trim()) {
            setError('Test description is required')
            return
        }

        if (form.questions.length === 0) {
            setError('At least one question is required')
            return
        }

        const invalidQuestion = form.questions.some(
            (question) =>
                !question.questionText.trim() ||
                question.points <= 0 ||
                question.answers.length < 2 ||
                !question.answers.some((answer) => answer.correct) ||
                question.answers.some((answer) => !answer.answerText.trim()),
        )

        if (invalidQuestion) {
            setError(
                'Each question needs text, positive points, at least 2 answers, one correct answer, and non-empty answers',
            )
            return
        }

        try {
            setCreating(true)

            const created = await createTest({
                ...form,
                title: form.title.trim(),
                description: form.description.trim(),
                labelIds: selectedTestLabelIds,
                questions: form.questions.map((question, questionIndex) => ({
                    ...question,
                    questionText: question.questionText.trim(),
                    questionOrder: questionIndex + 1,
                    answers: question.answers.map((answer, answerIndex) => ({
                        ...answer,
                        answerText: answer.answerText.trim(),
                        answerOrder: answerIndex + 1,
                    })),
                })),
            })

            setTests((prev) => [created, ...prev])
            setShowCreateForm(false)
            setForm(createDefaultForm())
        } catch (error) {
            console.error(error)
            setError('Failed to create test')
        } finally {
            setCreating(false)
        }
    }

    return (
        <div className="space-y-8">
            <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Knowledge Tests</h1>
                    <p className="mt-2 text-zinc-400">
                        TCCC theory, protocols, and decision-making assessment.
                    </p>
                </div>

                {allowTestManagement && (
                    <button
                        type="button"
                        onClick={() => setShowCreateForm((prev) => !prev)}
                        className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500"
                    >
                        {showCreateForm ? 'Close Form' : 'Create Test'}
                    </button>
                )}
            </section>

            {error && (
                <div className="rounded-2xl border border-red-900 bg-red-950/30 p-4 text-red-200">
                    {error}
                </div>
            )}

            {allowTestManagement && showCreateForm && (
                <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg">
                    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Create New Test</h2>
                            <p className="mt-1 text-sm text-zinc-400">
                                Labels are attached to individual questions for more accurate weak-skill analytics.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleCreateTest}
                            disabled={creating}
                            className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {creating ? 'Creating...' : 'Save Test'}
                        </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm text-zinc-300">Title</label>
                            <input
                                value={form.title}
                                onChange={(event) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        title: event.target.value,
                                    }))
                                }
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-zinc-300">Difficulty</label>
                            <select
                                value={form.difficulty}
                                onChange={(event) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        difficulty: event.target.value as CreateTestRequest['difficulty'],
                                    }))
                                }
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
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
                                className="min-h-20 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            />
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                        <p className="text-sm font-semibold text-white">Test labels summary</p>
                        <p className="mt-1 text-sm text-zinc-500">
                            These are collected automatically from question labels.
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {selectedTestLabelIds.length === 0 ? (
                                <span className="text-sm text-zinc-500">No labels selected yet.</span>
                            ) : (
                                selectedTestLabelIds.map((labelId) => {
                                    const label = labels.find((item) => item.id === labelId)

                                    return (
                                        <span
                                            key={labelId}
                                            className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300"
                                        >
                      {label?.name || `Label #${labelId}`}
                    </span>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <h3 className="text-lg font-semibold text-white">Questions</h3>

                            <button
                                type="button"
                                onClick={addQuestion}
                                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800"
                            >
                                Add Question
                            </button>
                        </div>

                        {form.questions.map((question, questionIndex) => (
                            <div
                                key={questionIndex}
                                className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4"
                            >
                                <div className="mb-4 flex items-center justify-between gap-4">
                                    <p className="font-semibold text-white">Question #{questionIndex + 1}</p>

                                    {form.questions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(questionIndex)}
                                            className="text-sm font-medium text-red-400 hover:text-red-300"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-[1fr_160px]">
                                    <div>
                                        <label className="mb-2 block text-sm text-zinc-300">Question text</label>
                                        <input
                                            value={question.questionText}
                                            onChange={(event) =>
                                                updateQuestion(questionIndex, 'questionText', event.target.value)
                                            }
                                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm text-zinc-300">Points</label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={question.points}
                                            onChange={(event) =>
                                                updateQuestion(questionIndex, 'points', Number(event.target.value))
                                            }
                                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <p className="mb-2 text-sm text-zinc-300">Question labels</p>

                                    {labelsLoading ? (
                                        <p className="text-sm text-zinc-500">Loading labels...</p>
                                    ) : labels.length === 0 ? (
                                        <p className="rounded-xl border border-yellow-900 bg-yellow-950/20 p-3 text-sm text-yellow-200">
                                            No labels found. Add labels in database or create label management later.
                                        </p>
                                    ) : (
                                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                            {labels.map((label) => (
                                                <label
                                                    key={label.id}
                                                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                                                        question.labelIds.includes(label.id)
                                                            ? 'border-red-800 bg-red-950/30 text-red-200'
                                                            : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={question.labelIds.includes(label.id)}
                                                        onChange={() => toggleQuestionLabel(questionIndex, label.id)}
                                                    />
                                                    <span>{label.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 space-y-3">
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="text-sm font-semibold text-zinc-300">Answers</p>

                                        <button
                                            type="button"
                                            onClick={() => addAnswer(questionIndex)}
                                            className="rounded-xl border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-800"
                                        >
                                            Add Answer
                                        </button>
                                    </div>

                                    {question.answers.map((answer, answerIndex) => (
                                        <div
                                            key={answerIndex}
                                            className="grid gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3 md:grid-cols-[1fr_auto_auto]"
                                        >
                                            <input
                                                value={answer.answerText}
                                                onChange={(event) =>
                                                    updateAnswer(
                                                        questionIndex,
                                                        answerIndex,
                                                        'answerText',
                                                        event.target.value,
                                                    )
                                                }
                                                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                                            />

                                            <label className="flex items-center gap-2 text-sm text-zinc-300">
                                                <input
                                                    type="checkbox"
                                                    checked={answer.correct}
                                                    onChange={(event) =>
                                                        updateAnswer(
                                                            questionIndex,
                                                            answerIndex,
                                                            'correct',
                                                            event.target.checked,
                                                        )
                                                    }
                                                />
                                                Correct
                                            </label>

                                            {question.answers.length > 2 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeAnswer(questionIndex, answerIndex)}
                                                    className="rounded-xl border border-red-900 px-3 py-2 text-sm text-red-300 hover:bg-red-950/40"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white">Label Management</h3>
                        <p className="mt-1 text-sm text-zinc-500">
                            Create topic labels and attach them to individual questions.
                        </p>
                    </div>

                    <div className="grid flex-1 gap-3 md:max-w-xl md:grid-cols-[1fr_140px_auto]">
                        <div>
                            <label className="mb-2 block text-sm text-zinc-300">Label name</label>
                            <input
                                value={labelForm.name}
                                onChange={(event) =>
                                    setLabelForm((prev) => ({
                                        ...prev,
                                        name: event.target.value,
                                    }))
                                }
                                placeholder="Airway Management"
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-zinc-300">Criticality</label>
                            <input
                                type="number"
                                min={0}
                                max={10}
                                step={0.1}
                                value={labelForm.criticality}
                                onChange={(event) =>
                                    setLabelForm((prev) => ({
                                        ...prev,
                                        criticality: Number(event.target.value),
                                    }))
                                }
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleCreateLabel}
                            disabled={creatingLabel}
                            className="rounded-xl border border-zinc-700 px-4 py-3 font-semibold text-zinc-200 transition hover:bg-zinc-800 disabled:opacity-60"
                        >
                            {creatingLabel ? 'Adding...' : 'Add Label'}
                        </button>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {labels.length === 0 ? (
                        <span className="text-sm text-zinc-500">No labels yet.</span>
                    ) : (
                        labels.map((label) => (
                            <span
                                key={label.id}
                                className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300"
                            >
          {label.name} · {label.criticality ?? 1}
        </span>
                        ))
                    )}
                </div>
            </div>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {loading && <p className="text-zinc-300">Loading tests...</p>}

                {!loading && tests.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 p-8 text-center md:col-span-2 xl:col-span-3">
                        <h2 className="text-xl font-semibold text-white">No tests found</h2>
                        <p className="mt-2 text-zinc-400">Create the first TCCC knowledge test.</p>
                    </div>
                )}

                {tests.map((test) => (
                    <article
                        key={test.id}
                        className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-white">{test.title}</h2>
                                <p className="mt-2 text-sm text-zinc-400">{test.description}</p>
                            </div>

                            <span className="rounded-full bg-red-950/60 px-3 py-1 text-xs font-semibold text-red-300">
                {test.maxScore} pts
              </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {test.labels?.map((label) => (
                                <span
                                    key={label}
                                    className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs text-zinc-400"
                                >
                  {label}
                </span>
                            ))}
                        </div>

                        <p className="mt-4 text-sm text-zinc-500">
                            Questions: {test.questions?.length ?? 0}
                        </p>

                        <button
                            type="button"
                            className="mt-5 w-full rounded-xl border border-zinc-700 px-4 py-3 font-semibold text-zinc-200 transition hover:bg-zinc-800"
                        >
                            Open Test
                        </button>
                    </article>
                ))}
            </section>
        </div>
    )
}