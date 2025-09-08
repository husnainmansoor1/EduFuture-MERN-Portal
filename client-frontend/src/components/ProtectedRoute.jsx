import { Navigate } from "react-router-dom";

// props: element (the page), role (optional role restriction)
export default function ProtectedRoute({ element: Component, role }) {
  const token = localStorage.getItem("token"); // or sessionStorage
  const user = JSON.parse(localStorage.getItem("user")); // store role in login

  if (!token) {
    // user not logged in → go to login page
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    // role doesn't match → redirect to correct dashboard
    return user?.role === "teacher"
      ? <Navigate to="/dashboard/teacher" replace />
      : <Navigate to="/dashboard/student" replace />;
  }

  return <Component />;
}
