import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { apiRequest } from "../services/api";

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

interface CurrentUserResponse {
  success: boolean;
  data: CurrentUser;
}

const ProtectedRoute = () => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let active = true;

    apiRequest<CurrentUserResponse>("/users/me")
      .then((response) => {
        if (active) {
          setUser(response.data);
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setIsChecking(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (isChecking) {
    return <p>Checking authentication...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet context={{ user }} />;
};

export default ProtectedRoute;
