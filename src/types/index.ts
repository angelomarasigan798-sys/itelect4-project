// User Interface
export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    score: number;
}

// Grade Interface
export interface Grade {
    score: number;
    maxScore: number;
}

// Course Interface
export interface Course {
    id: number;
    title: string;
    units: number;
    semester: string;
}

// Submission Interface
export interface Submission {
    id: number;
    studentId: number;
    courseId: number;
}

// Generic Interface
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// Generic Function
export function getFirst<T>(items: T[]): T | undefined {
    return items[0];
}

// Utility Types
export type UserPreview = Pick<User, "id" | "name">;

export type UserWithoutEmail = Omit<User, "email">;

export type UserRecord = Record<number, User>;

export type UserReturn = User | undefined;

// User Role Type
export type UserRole = "Admin" | "Student" | "Teacher";

export interface AppointmentApi {
    id: number;
    patientName: string;
    appointmentDate: string;
}

export type CreateAppointment = Omit<AppointmentApi, "id">;
