import { Navigate } from "react-router-dom";
import { useAppContext } from "../ContextAPI/AppContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
