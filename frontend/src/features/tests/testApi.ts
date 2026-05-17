import api from '../../api/axios'
import type {
    CreateLabelRequest,
    CreateTestRequest,
    LabelResponse,
    SubmitTestRequest,
    TestResponse,
    TestResultResponse,
} from '../../types/test'

export async function getTests(): Promise<TestResponse[]> {
    const response = await api.get<TestResponse[]>('/tests')
    return response.data
}

export async function createTest(data: CreateTestRequest): Promise<TestResponse> {
    const response = await api.post<TestResponse>('/tests', data)
    return response.data
}

export async function submitTest(
    testId: number,
    data: SubmitTestRequest,
): Promise<TestResultResponse> {
    const response = await api.post<TestResultResponse>(`/tests/${testId}/submit`, data)
    return response.data
}

export async function getLabels(): Promise<LabelResponse[]> {
    const response = await api.get<LabelResponse[]>('/labels')
    return response.data
}

export async function createLabel(data: CreateLabelRequest): Promise<LabelResponse> {
    const response = await api.post<LabelResponse>('/labels', data)
    return response.data
}