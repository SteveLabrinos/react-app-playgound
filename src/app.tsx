import NavigationMenu from "@/components/navigation/navigation-menu.tsx";
import { Outlet } from "react-router";
import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/rtk-hooks.ts";
import { clearAccessToken, setAccessToken } from "@/store/slices/auth-slice.ts";

function App() {
  const dispatch = useAppDispatch();
  const auth = useAuth();

  // Redirect to the login page if the user is not authenticated
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      void auth.signinRedirect();
    }
  }, [auth.isLoading, auth.isAuthenticated, auth]);

  // Sync access token with the store
  useEffect(() => {
    if (auth.user?.access_token) {
      console.log("[App] Token renewed");
      dispatch(setAccessToken(auth.user.access_token));
    } else if (!auth.isAuthenticated) {
      dispatch(clearAccessToken());
    }
  }, [auth.isAuthenticated, auth.user?.access_token, dispatch]);

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
