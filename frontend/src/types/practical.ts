export interface PracticalStepRequest {
    title: string
    description: string
    stepOrder: number
    critical: boolean
}

export interface PracticalStepResponse {
    id: number
    title: string
    description: string
    stepOrder: number
    critical: boolean
    maxScore: number
}

export interface CreatePracticalSkillRequest {
    name: string
    description: string
    steps: PracticalStepRequest[]
    labelIds: number[]
}

export interface PracticalSkillResponse {
    id: number
    name: string
    description: string
    maxScore: number
    labels: string[]
    steps: PracticalStepResponse[]
}

export type PracticalStepStatus = 'PASSED' | 'FAILED' | 'PARTIAL'

export interface SubmitPracticalStepRequest {
    stepId: number
    status: PracticalStepStatus
    score: number
    comment: string
}

export interface SubmitPracticalResultRequest {
    skillId: number
    cadetId: number
    instructorId: number
    comment: string
    steps: SubmitPracticalStepRequest[]
}

export interface PracticalResultResponse {
    id?: number
    skillId?: number
    cadetId?: number
    instructorId?: number
    totalScore?: number
    maxScore?: number
    percentage?: number
    resultStatus?: string
    comment?: string
    completedAt?: string
}