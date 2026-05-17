import api from '../../api/axios'
import type {
    CreatePracticalSkillRequest,
    PracticalResultResponse,
    PracticalSkillResponse,
    SubmitPracticalResultRequest,
} from '../../types/practical'

export async function getPracticalSkills(): Promise<PracticalSkillResponse[]> {
    const response = await api.get<PracticalSkillResponse[]>('/practical/skills')
    return response.data
}

export async function createPracticalSkill(
    data: CreatePracticalSkillRequest,
): Promise<PracticalSkillResponse> {
    const response = await api.post<PracticalSkillResponse>('/practical/skills', data)
    return response.data
}

export async function submitPracticalResult(
    data: SubmitPracticalResultRequest,
): Promise<PracticalResultResponse> {
    const response = await api.post<PracticalResultResponse>('/practical/results', data)
    return response.data
}