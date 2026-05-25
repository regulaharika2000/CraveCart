import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  allowedRoles,
}) {

  // Get user from localStorage
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // If no login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If role not allowed
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;