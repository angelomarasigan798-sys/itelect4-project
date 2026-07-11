interface Course {
  id: number;
  title: string;
  instructor: string;
}

interface CourseCardProps {
  course: Course;
}

function CourseCard({ course }: CourseCardProps) {
  return (
    <div>
      <h2>{course.title}</h2>
      <p>Instructor: {course.instructor}</p>
    </div>
  );
}

export default CourseCard;