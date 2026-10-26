import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { apiRequest } from "../../services/api";
import type { CurrentUser } from "../../components/ProtectedRoute";

const DashboardPage = () => {
  const { user } = useOutletContext<{ user: CurrentUser }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setLoading(true);
    setError("");

    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });

      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Logout failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Dashboard</h1>

      <p>Welcome, {user.fullName}!</p>
      <p>Email: {user.email}</p>

      {error && <p role="alert">{error}</p>}

      <button type="button" onClick={handleLogout} disabled={loading}>
        {loading ? "Logging out..." : "Logout"}
      </button>
    </main>
  );
};

export default DashboardPage;
