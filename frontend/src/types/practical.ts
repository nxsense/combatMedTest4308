export interface PracticalStepRequest {
    title: string
    description: string
    stepOrder: number
    critical: boolean
}

export interface CreatePracticalSkillRequest {
    name: string
    description: string
    steps: PracticalStepRequest[]
    labelIds: number[]
}

export interface PracticalSkillResponse {
    id: number
    title?: string
    name?: string
    description: string
    category?: string
    steps?: PracticalStepRequest[]
    labels?: string[]
}