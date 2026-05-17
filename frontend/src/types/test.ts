export type TestDifficulty = 'EASY' | 'MEDIUM' | 'HARD'

export interface AnswerResponse {
    id: number
    answerText: string
    correct: boolean
    answerOrder: number
}

export interface QuestionResponse {
    id: number
    questionText: string
    points: number
    questionOrder: number
    labels: string[]
    answers: AnswerResponse[]
}

export interface TestResponse {
    id: number
    title: string
    description: string
    difficulty?: TestDifficulty
    maxScore: number
    createdAt: string
    labels: string[]
    questions: QuestionResponse[]
}

export interface CreateAnswerRequest {
    answerText: string
    correct: boolean
    answerOrder: number
}

export interface CreateQuestionRequest {
    questionText: string
    points: number
    questionOrder: number
    labelIds: number[]
    answers: CreateAnswerRequest[]
}

export interface CreateTestRequest {
    title: string
    description: string
    difficulty: TestDifficulty
    labelIds: number[]
    questions: CreateQuestionRequest[]
}

export interface LabelResponse {
    id: number
    name: string
    criticality: number | null
}

export interface CreateLabelRequest {
    name: string
    criticality: number
}

export interface SubmittedAnswerRequest {
    answerId: number
}

export interface SubmitTestRequest {
    cadetId: number
    answers: SubmittedAnswerRequest[]
}

export interface TestResultResponse {
    id: number
    testId: number
    testTitle: string
    cadetId: number
    cadetName: string
    score: number
    maxScore: number
    percentage: number
    passed: boolean
    passedAt: string
}