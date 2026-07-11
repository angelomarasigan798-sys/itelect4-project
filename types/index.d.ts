export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    score: number;
}
export interface Grade {
    score: number;
    maxScore: number;
}
export interface Course {
    name: string;
    units: number;
    semester: string;
}
export interface User {
    id: number;
    name: string;
    email: string;
}
export interface Course {
    id: number;
    title: string;
    units: number;
}
export interface Submission {
    id: number;
    studentId: number;
    courseId: number;
}
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
export declare function getFirst<T>(items: T[]): T | undefined;
export type UserPreview = Pick<User, "id" | "name">;
export type UserWithoutEmail = Omit<User, "email">;
export type UserRecord = Record<number, User>;
export type UserReturn = ReturnType<typeof getFirst>;
export declare enum UserRole {
    Admin = 0,
    Student = 1,
    Teacher = 2
}
//# sourceMappingURL=index.d.ts.map