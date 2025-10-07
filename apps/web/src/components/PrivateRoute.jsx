import { Navigate, useLocation } from "react-router-dom";
export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const { pathname } = useLocation();
  if (!token) return <Navigate to={`/login?next=${encodeURIComponent(pathname)}`} replace />;
  return children;
}
