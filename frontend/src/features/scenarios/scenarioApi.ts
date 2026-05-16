import api from '../../api/axios'
import type { ScenarioResponse } from '../../types/scenario'

export async function generateScenario() {
    const response = await api.post<ScenarioResponse>(
        '/api/scenarios/generate',
        {
            title: 'Blast injury with hemorrhagic shock and chest trauma',
            difficultyLevel: 'HARD',
            labelIds: [],
            injuries: [
                {
                    mechanism: 'BLAST_INJURY',
                    region: 'LOWER_LIMB',
                    severity: 'CRITICAL',
                    activeBleeding: true,
                    airwayCompromised: false,
                    breathingCompromised: false,
                    consciousnessAffected: true,
                    description: 'Traumatic lower limb amputation with massive bleeding'
                },
                {
                    mechanism: 'PENETRATING_TRAUMA',
                    region: 'CHEST',
                    severity: 'CRITICAL',
                    activeBleeding: false,
                    airwayCompromised: false,
                    breathingCompromised: true,
                    consciousnessAffected: false,
                    description: 'Penetrating chest wound with respiratory compromise'
                }
            ]
        },
    )

    return response.data
}