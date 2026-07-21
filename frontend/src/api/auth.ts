import api from './axios';
import { AuthResponse, User } from '../types/auth';

export async function register(email: string, password: string): Promise<User> {
    const res = await api.post<User>('/auth/register', { email, password });
    return res.data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    return res.data;
}