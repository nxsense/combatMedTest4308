import { useEffect, useState } from 'react'

import { getTests } from '../features/tests/testApi'
import type { TestResponse } from '../types/test'

export default function TestsPage() {
    const [tests, setTests] = useState<TestResponse[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getTests()
            .then(setTests)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    return (
        <div>
            <div className="mb-10">
                <h1 className="text-5xl font-bold">
                    Knowledge Tests
                </h1>

                <p className="mt-3 text-zinc-400">
                    TCCC theory, protocols, and decision-making assessment
                </p>
            </div>

            {loading && (
                <p className="text-zinc-400">
                    Loading tests...
                </p>
            )}

            {!loading && tests.length === 0 && (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-zinc-400">
                    No tests found.
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                {tests.map((test) => (
                    <div
                        key={test.id}
                        className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
                    >
            <span className="rounded bg-zinc-800 px-3 py-1 text-sm text-zinc-400">
              Passing score: {test.passingScore}
            </span>

                        <h2 className="mt-5 text-2xl font-bold">
                            {test.title}
                        </h2>

                        <p className="mt-3 text-zinc-400">
                            {test.description}
                        </p>

                        <button className="mt-6 w-full rounded-lg bg-zinc-800 py-3 font-semibold hover:bg-zinc-700">
                            Open Test
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}