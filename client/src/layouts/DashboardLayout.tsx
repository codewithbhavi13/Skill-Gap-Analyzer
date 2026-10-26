import { Outlet, useOutletContext } from "react-router-dom";
import type { CurrentUser } from "../components/ProtectedRoute";

const DashboardLayout = () => {
  const context = useOutletContext<{ user: CurrentUser }>();

  return <Outlet context={context} />;
};

export default DashboardLayout;
