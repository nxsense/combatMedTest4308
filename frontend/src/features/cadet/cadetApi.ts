import api from '../../api/axios'
import type { TestResultResponse } from '../../types/test'
import type { PracticalResultResponse } from '../../types/practical'

export interface CadetAnalyticsResponse {
    cadetId?: number
    totalAttempts?: number
    averageScore?: number
    passedCount?: number
    failedCount?: number
    passRate?: number
    weakLabels?: WeakAreaResponse[]
    recommendedTests?: RecommendedTestResponse[]
}

export interface WeakAreaResponse {
    labelName?: string
    name?: string
    averageScore?: number
    priority?: number
    attemptsCount?: number
    evaluationsCount?: number
}

export interface RecommendedTestResponse {
    id: number
    title: string
    description: string
    maxScore?: number
    labels?: string[]
}

export async function getCadetTestResults(cadetId: number): Promise<TestResultResponse[]> {
    const response = await api.get<TestResultResponse[]>(`/tests/results/cadet/${cadetId}`)
    return response.data
}

export async function getCadetTestAnalytics(cadetId: number): Promise<CadetAnalyticsResponse> {
    const response = await api.get<CadetAnalyticsResponse>(`/tests/analytics/cadet/${cadetId}`)
    return response.data
}

export async function getCadetRecommendedTests(cadetId: number): Promise<RecommendedTestResponse[]> {
    const response = await api.get<RecommendedTestResponse[]>(`/tests/recommended/cadet/${cadetId}`)
    return response.data
}

export async function getCadetPracticalResults(
    cadetId: number,
): Promise<PracticalResultResponse[]> {
    const response = await api.get<PracticalResultResponse[]>(`/practical/results/cadet/${cadetId}`)
    return response.data
}

export async function getCadetWeakPracticalAreas(cadetId: number): Promise<WeakAreaResponse[]> {
    const response = await api.get<WeakAreaResponse[]>(`/practical/weak-labels/${cadetId}`)
    return response.data
}

export interface CadetResponse {
    id: number
    firstName?: string
    lastName?: string
    rank?: string
    serviceNumber?: string
    username?: string
    email?: string
}

export async function getCadets(): Promise<CadetResponse[]> {
    const response = await api.get<CadetResponse[]>('/cadets')
    return response.data
}