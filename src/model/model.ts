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
    specialist: string | null;
    role: string;
}

export interface VaccineHistory {
    id: string;
    vaccineName: string;
    vaccineLocation: string | null;
    vaccineAt: number;
    complication: string | null;
}

export interface Medicine {
    id: string;
    medicineName: string;
    dose: string | null;
    frequencyPerDay: string | null;
    instruction: string | null;
    quantity: string | null;
}

export interface Patient {
    id: number;
    hn: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    email: string | null;
    phone: string | null;
    verified: boolean;
    weight: number | null;
    height: number | null;
    medicine: Medicine[] | null;
    vaccineHistory: VaccineHistory[] | null;
}

export interface Appointment {
    id: number;
    createAt: number;
    updateAt: number | null;
    approveAt: number | null;
    date: number;
    patient: Patient;
    doctor: TrimDoctor;
}

export interface QuestionTopic {
    id: number;
    topic: string;
    createAt: number;
    answerAt: number | null;
    patient: Patient;
    doctor: Omit<TrimDoctor, "role"> | null;
}

export interface Question {
    id: number;
    topic: string;
    question: string;
    createAt: number;
    answer: string;
    answerAt: number | null;
    patient: Patient;
    doctor: Omit<TrimDoctor, "role"> | null;
}

export interface Content {
    id: number;
    createAt: number;
    updateAt: number;
    title: string;
    body: string;
    isPublished: boolean;
    order: number;
    coverImageURL: string | null;
}
