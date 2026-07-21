export interface User {
    id: string;
    email: string;
    createdAt: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}