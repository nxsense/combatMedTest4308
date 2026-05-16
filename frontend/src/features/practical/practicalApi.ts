import api from '../../api/axios'
import type { PracticalSkillResponse } from '../../types/practical'

export async function getPracticalSkills() {
    const response = await api.get<PracticalSkillResponse[]>('/practical-skills')
    return response.data
}