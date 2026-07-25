import { useState, useEffect, useRef } from "react";
import "./App.css";

type Course = {
  id: number;
  title: string;
};

function App() {
  // ✅ useState
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ✅ useRef
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ useEffect
  useEffect(() => {
    const mockData: Course[] = [
      { id: 1, title: "React" },
      { id: 2, title: "TypeScript" },
      { id: 3, title: "JavaScript" },
      { id: 4, title: "Node.js" },
    ];

    setCourses(mockData);
    setLoading(false);
  }, []);

  // ✅ handleSearch (THIS IS THE CORRECT PLACE)
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // ✅ Filter
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Return
  return (
    <div className="App">
      <h1>GT2 Part 2 Demo</h1>

      <input
        ref={inputRef}
        type="text"
        placeholder="Search..."
        value={search}
        onChange={handleSearch}
      />

      <button onClick={() => inputRef.current?.focus()}>
        Focus Search
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {filteredCourses.map((course) => (
            <li key={course.id}>{course.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;