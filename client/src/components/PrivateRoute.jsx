import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />; // Or unauthorized page
  }

  return children;
};

export default PrivateRoute;
