import NavigationMenu from "@/components/navigation/navigation-menu.tsx";
import { Outlet } from "react-router";
import { useAuth, useAutoSignin } from "react-oidc-context";
import { useTokenRenewal } from "@/hooks/use-token-renewal.ts";
import Loading from "@/components/layouts/loading.tsx";
import ErrorCard from "@/components/layouts/error-card.tsx";

function App() {
  const auth = useAuth();

  useTokenRenewal({
    renewBeforeExpiration: 90,
    checkInterval: 30,
  });

  const { isLoading, isAuthenticated, error } = useAutoSignin({
    signinMethod: "signinRedirect",
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorCard title="Error" description={error.message} />;
  if (!isAuthenticated) return auth.signinRedirect();

  return (
    <div className="flex flex-col h-screen w-screen gap-0 overflow-hidden">
      <div className="sticky top-0 z-50">
        <NavigationMenu />
      </div>
      <div className="flex w-full h-full overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
