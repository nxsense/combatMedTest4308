import api from '../../api/axios'
import type {
    Manipulation,
    ScenarioGenerateRequest,
    ScenarioManualCreateRequest,
    ScenarioResponse,
} from '../../types/scenario'

export async function generateScenario(
    data: ScenarioGenerateRequest,
): Promise<ScenarioResponse> {
    const response = await api.post<ScenarioResponse>('/api/scenarios/generate', data)
    return response.data
}

export async function createManualScenario(
    data: ScenarioManualCreateRequest,
): Promise<ScenarioResponse> {
    const response = await api.post<ScenarioResponse>('/api/scenarios/manual', data)
    return response.data
}

export async function getScenarioById(id: number): Promise<ScenarioResponse> {
    const response = await api.get<ScenarioResponse>(`/api/scenarios/${id}`)
    return response.data
}

export async function getManipulations(): Promise<Manipulation[]> {
    const response = await api.get<Manipulation[]>('/api/manipulations')
    return response.data
}