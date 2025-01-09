export interface ErrResponse {
    error: string;
}

export interface TrimDoctor {
    id: number;
    firstName: string;
    middleName: string | null;
    lastName: string;
    role: string;
}

export interface Doctor {
    id: number;
    firstName: string;
    middleName: string | null;
    lastName: string;
    username: string;
    password: string;
    role: string;
}
