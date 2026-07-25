import type {
    User,
    Course,
    Submission,
    ApiResponse
} from "./types";
import { getFirst } from "./types";

// Sample User
const user: User = {
    id: 1,
    name: "Juan Dela Cruz",
    email: "juan@example.com",
    role: "Student",
    isActive: true,
    score: 95
};

// Sample Course
const course: Course = {
    id: 101,
    title: "TypeScript Programming",
    units: 3,
    semester: "1st Semester"
};

// Sample Submission
const submission: Submission = {
    id: 1,
    studentId: 1,
    courseId: 101
};

// Generic Function Example
const users: User[] = [user];
const firstUser = getFirst(users);

// Generic Interface Example
const response: ApiResponse<User> = {
    success: true,
    message: "User retrieved successfully.",
    data: user
};

console.log(firstUser);
console.log(response);
console.log(course);
console.log(submission);
