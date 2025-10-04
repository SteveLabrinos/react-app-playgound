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

  // Set the user's name in the store when they log in
  useEffect(() => {
    if (auth.user?.access_token) {
      dispatch(setAccessToken(auth.user.access_token));
    }
  }, [auth.user?.access_token, dispatch]);

  // Handle logout
  useEffect(() => {
    if (!auth.isAuthenticated && !auth.user) {
      dispatch(clearAccessToken());
    }
  }, [auth.isAuthenticated, auth.user, dispatch]);

  return (
    <div className="flex flex-col h-screen w-screen gap-0 overflow-hidden">
      <div className="sticky top-0">
        <NavigationMenu />
      </div>
      <div className="flex w-full h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
