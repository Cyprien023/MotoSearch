export interface User {
    id: string;
    email: string;
    password: string;
    createdAt: string;
}

export interface UserPublic {
    id: string;
    email: string;
    createdAt: string;
}