import { Routes, Route, Link } from 'react-router-dom';

const AddStudentMain = () => <div><h3>Main: Add a new student here!</h3></div>;
const ImportStudents = () => <div><h3>Import: Import students from a file.</h3></div>;
const AssignStudent = () => <div><h3>Assign: Assign students to a class or group.</h3></div>;

const AddStudent = () => {
  return (
    <div className="add-student">
      <h2>Add Student</h2>

      {/* Navigation for nested routes */}
      <nav className="add-student-nav">
        {/* Use absolute paths */}
        <Link to="/add-student/main">Main</Link>
        <Link to="/add-student/import">Import</Link>
        <Link to="/add-student/assign">Assign</Link>
      </nav>

      {/* Nested Routes */}
      <div className="add-student-content">
        <Routes>
          <Route index element={<AddStudentMain />} /> {/* Default Route */}
          <Route path="main" element={<AddStudentMain />} />
          <Route path="import" element={<ImportStudents />} />
          <Route path="assign" element={<AssignStudent />} />
          <Route path="*" element={<div><h3>Page Not Found</h3></div>} />
        </Routes>
      </div>
    </div>
  );
};

export default AddStudent;



