import { useEffect, useState } from 'react'

import { getPracticalSkills } from '../features/practical/practicalApi'
import type { PracticalSkillResponse } from '../types/practical'

export default function PracticalPage() {
    const [skills, setSkills] = useState<PracticalSkillResponse[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getPracticalSkills()
            .then(setSkills)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    return (
        <div>
            <div className="mb-10">
                <h1 className="text-5xl font-bold">
                    Practical Skills Lab
                </h1>

                <p className="mt-3 text-zinc-400">
                    Hands-on manipulations and combat casualty interventions
                </p>
            </div>

            {loading && (
                <p className="text-zinc-400">
                    Loading practical skills...
                </p>
            )}

            {!loading && skills.length === 0 && (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-zinc-400">
                    No practical skills found.
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {skills.map((skill) => (
                    <div
                        key={skill.id}
                        className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
                    >
            <span className="rounded bg-zinc-800 px-3 py-1 text-sm text-zinc-400">
              {skill.category}
            </span>

                        <h2 className="mt-5 text-2xl font-bold">
                            {skill.title}
                        </h2>

                        <p className="mt-3 text-zinc-400">
                            {skill.description}
                        </p>

                        <button className="mt-6 w-full rounded-lg bg-zinc-800 py-3 font-semibold hover:bg-zinc-700">
                            Open Skill
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}