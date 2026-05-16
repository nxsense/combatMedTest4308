import api from '../api/axios'
import type { TestResponse } from '../types/test'

export async function getTests() {
    const response = await api.get<TestResponse[]>('/tests')
    return response.data
}