import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAppContext();

  if (loading) {
    return (
      <div className="loading-component">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
