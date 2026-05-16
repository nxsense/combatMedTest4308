export interface LoginRequest {
    username: string
    password: string
}

export interface RegisterRequest {
    username: string
    email: string
    password: string
    role: 'CADET' | 'INSTRUCTOR'
}

export interface AuthResponse {
    token: string
}