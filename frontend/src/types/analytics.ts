export type DashboardAnalytics = {
    totalCadets: number
    totalInstructors: number
    totalScenarios: number
    activeSessions: number
    completedSessions: number
    failedSessions: number
    averageScenarioScore: number
    completedTests: number
    averageTestScore: number
    testPassRate: number
    practicalEvaluations: number
    averagePracticalScore: number
    practicalPassRate: number
}

export type TestAnalytics = {
    totalAttempts: number
    averageScore: number
    passedCount: number
    failedCount: number
    passRate: number
}

export type TestLabelAnalytics = {
    labelId: number
    labelName: string
    attemptsCount: number
    averageScore: number
    passRate: number
}

export type PracticalSkillAnalytics = {
    totalEvaluations: number
    averageScore: number
    passedCount: number
    failedCount: number
    passRate: number
}

export type PracticalSkillLabelAnalytics = {
    labelId: number
    labelName: string
    evaluationsCount: number
    averageScore: number
    passRate: number
}