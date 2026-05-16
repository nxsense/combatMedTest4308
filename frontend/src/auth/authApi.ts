import api from '../api/axios'
import type { AuthResponse, LoginRequest } from '../types/auth'

export async function login(data: LoginRequest) {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
}