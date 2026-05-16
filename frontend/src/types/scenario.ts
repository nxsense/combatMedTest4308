export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD'

export type InjuryMechanism =
    | 'GUNSHOT_WOUND'
    | 'FRAGMENTATION_WOUND'
    | 'BLAST_INJURY'
    | 'PENETRATING_TRAUMA'
    | 'BLUNT_TRAUMA'
    | 'THERMAL_BURN'
    | 'INHALATION_BURN'
    | 'FALL_INJURY'
    | 'VEHICLE_ACCIDENT'
    | 'CRUSH_INJURY'
    | 'AMPUTATION'
    | 'MULTIPLE_TRAUMA'

export type InjuryRegion =
    | 'HEAD'
    | 'NECK'
    | 'CHEST'
    | 'ABDOMEN'
    | 'UPPER_LIMB'
    | 'LOWER_LIMB'

export type InjurySeverity = 'MINOR' | 'MODERATE' | 'SEVERE' | 'CRITICAL'

export interface ScenarioInjuryRequest {
    mechanism: InjuryMechanism
    region: InjuryRegion
    severity: InjurySeverity
    activeBleeding: boolean
    airwayCompromised: boolean
    breathingCompromised: boolean
    consciousnessAffected: boolean
    description: string
}

export interface ScenarioGenerateRequest {
    title: string
    difficultyLevel: DifficultyLevel
    labelIds: number[]
    injuries: ScenarioInjuryRequest[]
}

export interface ScenarioExpectedAction {
    id: number
    title: string
    description: string
    tcccStage: string
    actionType: string
    priorityOrder: number
    critical: boolean
    manipulationId: number
    manipulationCode: string
    manipulationTitle: string
}

export interface ScenarioVitalSigns {
    heartRate: number
    systolicBp: number
    diastolicBp: number
    respiratoryRate: number
    spo2: number
    consciousnessLevel: string
    skinCondition: string
    painLevel: number
}

export interface ScenarioInjury {
    id: number
    region: string
    severity: string
    mechanism: string
    description: string
    activeBleeding: boolean
    airwayCompromised: boolean
    breathingCompromised: boolean
}

export interface ScenarioResponse {
    id: number
    title: string
    description?: string
    legend?: string
    narrative?: string
    difficultyLevel?: string
    expectedActions: ScenarioExpectedAction[]
    vitalSigns: ScenarioVitalSigns
    injuries: ScenarioInjury[]
}

export interface ScenarioSessionStartRequest {
    scenarioId: number
    cadetId: number
}

export interface ScenarioSessionResponse {
    id: number
    scenarioId: number
    cadetId: number
    status: string
    currentMinute: number
    totalScore: number
    mistakes: number
    startedAt: string
    finishedAt: string | null
}

export interface ScenarioActionExecuteRequest {
    expectedActionId: number
    manipulationId: number
    executionMinute: number
    notes?: string
}

export interface ScenarioActionExecutionResponse {
    id: number
    sessionId: number
    expectedActionId: number
    manipulationId: number
    correct: boolean
    executionMinute: number
    scoreDelta: number
    notes: string
}

export interface ScenarioSessionSummaryResponse {
    sessionId: number
    scenarioId: number
    scenarioTitle: string
    cadetId: number
    status: string
    totalScore: number
    mistakes: number
    totalActions: number
    correctActions: number
    incorrectActions: number
    accuracyPercent: number
    maxScore: number
}

export interface ScenarioPenaltyRequest {
    points: number
    reason: string
}