import api from '../../api/axios'
import type {
    ScenarioSessionResponse,
    ScenarioSessionStartRequest,
} from '../../types/scenario'

import type {
    ScenarioActionExecuteRequest,
    ScenarioActionExecutionResponse,
} from '../../types/scenario'

import type { ScenarioSessionSummaryResponse } from '../../types/scenario'

import type {
    ScenarioPenaltyRequest,
} from '../../types/scenario'

export async function applySessionPenalty(
    sessionId: number,
    data: ScenarioPenaltyRequest,
) {
    const response = await api.post<ScenarioSessionResponse>(
        `/api/scenario-sessions/${sessionId}/penalty`,
        data,
    )

    return response.data
}
export async function getSessionSummary(sessionId: number) {
    const response = await api.get<ScenarioSessionSummaryResponse>(
        `/api/scenario-sessions/${sessionId}/summary`,
    )

    return response.data
}

export async function executeScenarioAction(
    sessionId: number,
    data: ScenarioActionExecuteRequest,
) {
    const response =
        await api.post<ScenarioActionExecutionResponse>(
            `/api/scenario-sessions/${sessionId}/actions`,
            data,
        )

    return response.data
}

export async function startScenarioSession(
    data: ScenarioSessionStartRequest,
) {
    const response = await api.post<ScenarioSessionResponse>(
        '/api/scenario-sessions/start',
        data,
    )

    return response.data
}