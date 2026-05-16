import api from '../../api/axios'
import type {
    DashboardAnalytics,
    PracticalSkillAnalytics,
    PracticalSkillLabelAnalytics,
    TestAnalytics,
    TestLabelAnalytics,
} from '../../types/analytics'

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
    const response = await api.get<DashboardAnalytics>('/api/analytics/dashboard')
    return response.data
}

export async function getTestAnalytics(): Promise<TestAnalytics> {
    const response = await api.get<TestAnalytics>('/api/analytics/tests')
    return response.data
}

export async function getTestLabelAnalytics(): Promise<TestLabelAnalytics[]> {
    const response = await api.get<TestLabelAnalytics[]>('/api/analytics/tests/labels')
    return response.data
}

export async function getPracticalAnalytics(): Promise<PracticalSkillAnalytics> {
    const response = await api.get<PracticalSkillAnalytics>('/api/analytics/practical-skills')
    return response.data
}

export async function getPracticalLabelAnalytics(): Promise<PracticalSkillLabelAnalytics[]> {
    const response = await api.get<PracticalSkillLabelAnalytics[]>(
        '/api/analytics/practical-skills/labels',
    )
    return response.data
}