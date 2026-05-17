import api from '../api/axios'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth'

export async function login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
}
export interface CurrentUserResponse {
    userId: number
    username: string
    email: string
    role: string
    cadetId: number | null
    instructorId: number | null
}
export async function getCurrentUser(): Promise<CurrentUserResponse> {
    const response = await api.get<CurrentUserResponse>('/auth/me')
    return response.data
}