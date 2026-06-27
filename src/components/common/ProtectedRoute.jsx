import { Navigate } from "react-router-dom"; // Agar aap react-router-dom use kar rahe hain
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // Agar user login nahi hai, to redirect kar do login page par
    return <Navigate to="/login" replace />;
  }

  return children;
}