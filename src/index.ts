import type { User } from "../types/index";

function getUser(id: number): User {
    return {
        id: id,
        name: "Angelo Marasigan",
        email: "angelomarasigan@gmail.com",
        role: "student",
        isActive: true,
        score: 95.5,
    };
}

function calculateGrade(
    score: number,
    maxScore: number
): string {

    const percentage: number =
        (score / maxScore) * 100;

    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";

    return "F";
}

function formatCourse(
    name: string,
    units: number,
    semester: string
): string {

    return `${name} (${units} units) - ${semester}`;
}

const user: User = getUser(1);

console.log(user);
console.log(calculateGrade(85, 100));
console.log(
    formatCourse(
        "IT Elective 4",
        3,
        "1st Semester"
    )
);