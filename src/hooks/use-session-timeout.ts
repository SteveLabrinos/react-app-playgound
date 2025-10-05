import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/rtk-hooks.ts";
import { clearAccessToken } from "@/store/slices/auth-slice.ts";
import { useActivityTracker } from "@/hooks/use-activity-tracker.ts";

const sessionTimeout = 120; // 2 minutes tmp
const checkInterval = 10;

export const useSessionTimeout = () => {
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const lastActivityTime = useActivityTracker();

  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const checkSessionTimeout = async () => {
      const timeSinceLastActivity =
        Math.floor(Date.now() / 1000) - lastActivityTime.current;

      console.log("Checking session timeout", timeSinceLastActivity);

      if (timeSinceLastActivity >= sessionTimeout) {
        dispatch(clearAccessToken());
        await auth.removeUser();
        await auth.signinRedirect();
      }
    };

    const sessionCheckInterval = setInterval(() => {
      void checkSessionTimeout();
    }, checkInterval * 1000);

    return () => clearInterval(sessionCheckInterval);
  }, [auth, dispatch, lastActivityTime]);
};
