import Login from "./Login";
import Admin from "./components/Admin";
import Teacher from "./components/Teacher";
import Student from "./components/Student";
import FacultyAdmin from "./components/FacultyAdmin";
import Layout from "./components/Layout";
import RequiredAuth from "./components/RequiredAuth";
import { Routes, Route, Navigate } from "react-router-dom";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<RequiredAuth allowedRoles="Admin" />}>
          <Route path="admin" element={<Admin />} />

        </Route>

        <Route element={<RequiredAuth allowedRoles="Teacher" />}>
          <Route path="teacher" element={<Teacher />} />
        </Route>
        <Route element={<RequiredAuth allowedRoles="Faculty Admin" />}>
          <Route path="facultyadmin" element={<FacultyAdmin />} />
        </Route>

        <Route element={<RequiredAuth allowedRoles="Student" />}>
          <Route path="student" element={<Student />} />
        </Route>

        <Route path="*" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
