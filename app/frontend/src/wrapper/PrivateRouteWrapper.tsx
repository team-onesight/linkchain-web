import { Suspense, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store.ts";

interface PrivateRouteProps {
  RenderElement: React.LazyExoticComponent<() => JSX.Element>;
  redirectionPath?: string;
}

const PrivateRoute = ({ RenderElement, redirectionPath }: PrivateRouteProps) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated === false) {
    return <Navigate to={redirectionPath || "/login"} replace />;
  }


  return (
    <Suspense>
      <RenderElement />
    </Suspense>
  );
};

export default PrivateRoute;
