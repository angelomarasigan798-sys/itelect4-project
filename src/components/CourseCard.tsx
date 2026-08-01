type Course = {
  id: number;
  title: string;
  instructor: string;
};

type CourseCardProps = {
  course: Course;
  variant?: 'default' | 'compact';
};

export default function CourseCard({
  course,
  variant = 'default',
}: CourseCardProps) {
  return (
    <div
      className={`rounded-xl border bg-white p-4 shadow dark:bg-gray-800 ${
        variant === 'compact' ? 'p-2 text-sm' : 'p-4'
      }`}
    >
      <h3 className="text-lg font-semibold">{course.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Instructor: {course.instructor}
      </p>
    </div>
  );
}