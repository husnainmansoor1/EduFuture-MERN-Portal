import { Navigate } from "react-router-dom";

// props: element (the page), role (optional role restriction)
export default function ProtectedRoute({ element: Component, role }) {
  const token = localStorage.getItem("token");
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }

  if (!token) {
    // user not logged in → go to login page
    return <Navigate to="/login" replace />;
  }

  // Client-side JWT expiration check
  try {
    const tokenParts = token.split(".");
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        console.warn("Token expired. Logging out user.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return <Navigate to="/login" replace />;
      }
    } else {
      throw new Error("Invalid token format");
    }
  } catch (error) {
    console.error("Token validation failed. Logging out user:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  // Admin approval verification
  if (user?.role === "admin" && user?.adminStatus !== "approved") {
    return <Navigate to="/admin/pending" state={{ status: user.adminStatus }} replace />;
  }

  if (role && user?.role !== role) {
    // role doesn't match → redirect to correct dashboard
    if (user?.role === "admin") {
      return <Navigate to="/dashboard/admin" replace />;
    } else if (user?.role === "teacher") {
      return <Navigate to="/dashboard/teacher" replace />;
    } else {
      return <Navigate to="/dashboard/student" replace />;
    }
  }

  return <Component />;
}
