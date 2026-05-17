export type UserRole = 'CADET' | 'COMBAT MEDIC' | 'INSTRUCTOR' | 'ADMIN' | 'ANALYST'

type JwtPayload = {
    sub?: string
    role?: string
    exp?: number
}

export function getCurrentUserRole(): UserRole | null {
    const token = localStorage.getItem('token')

    if (!token) {
        return null
    }

    try {
        const payloadBase64 = token.split('.')[1]

        if (!payloadBase64) {
            return null
        }

        const normalizedPayload = payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
        const payload = JSON.parse(atob(normalizedPayload)) as JwtPayload

        const role = payload.role?.replace('ROLE_', '').toUpperCase()

        if (
            role === 'CADET' ||
            role === 'COMBAT MEDIC' ||
            role === 'INSTRUCTOR' ||
            role === 'ADMIN' ||
            role === 'ANALYST'
        ) {
            return role as UserRole
        }

        return null
    } catch {
        return null
    }
}

export function isCadetRole(role: UserRole | null) {
    return role === 'CADET' || role === 'COMBAT MEDIC'
}

export function canManageTests() {
    const role = getCurrentUserRole()
    return role === 'INSTRUCTOR' || role === 'ADMIN'
}

export function canViewGlobalAnalytics() {
    const role = getCurrentUserRole()
    return role === 'INSTRUCTOR' || role === 'ADMIN' || role === 'ANALYST'
}