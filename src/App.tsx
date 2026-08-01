import { useEffect, useState } from 'react';
import './App.css';
import UserCard from './components/UserCard';
import CourseCard from './components/CourseCard';
import SubmissionBadge from './components/SubmissionBadge';

type Course = {
  id: number;
  title: string;
  instructor: string;
};

function App() {
  const [courses] = useState<Course[]>([
    { id: 1, title: 'React', instructor: 'Maria Santos' },
    { id: 2, title: 'TypeScript', instructor: 'John Dela Cruz' },
    { id: 3, title: 'JavaScript', instructor: 'Ana Reyes' },
    { id: 4, title: 'Node.js', instructor: 'Rico Lim' },
    { id: 5, title: 'HTML & CSS', instructor: 'Nina Flores' },
    { id: 6, title: 'Tailwind CSS', instructor: 'Chris Garcia' },
  ]);

  const [search, setSearch] = useState('');
  const [loading] = useState(false);
  const [error] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

 if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  );
}

  if (error) {
    return (
      <div className="m-6 rounded-lg border border-red-300 bg-red-100 p-4 text-red-700 dark:border-red-700 dark:bg-red-900 dark:text-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black dark:bg-gray-900 dark:text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">GT2 Part 3</h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <input
          type="text"
          placeholder="Search course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 w-full rounded-lg border border-gray-300 p-3 text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />

        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">User</h2>
          <UserCard
            user={{ id: 1, name: 'Angelo Marasigan', email: 'angelo@example.com' }}
          />
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Courses</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-semibold">Submission</h2>
          <SubmissionBadge submission={{ id: 1, status: 'Submitted' }} />
        </div>
      </div>
    </div>
  );
}

export default App;
