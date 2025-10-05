import { useAuth } from "react-oidc-context";
import { useEffect, useMemo } from "react";
import { useAppDispatch } from "@/hooks/rtk-hooks.ts";
import { clearAccessToken } from "@/store/slices/auth-slice.ts";
import { authConfig, JwtPayload } from "@/config/authorization.ts";

export const useSessionTimeout = () => {
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const { checkInterval } = authConfig;

  const sessionExpiresAt = useMemo(() => {
    if (!auth.user?.refresh_token) return null;

    try {
      const [, payload] = auth.user.refresh_token.split(".");
      const { exp } = JSON.parse(atob(payload)) as JwtPayload;
      return exp;
    } catch (error) {
      console.error("[Session] Error decoding token:", error);
      return null;
    }
  }, [auth.user?.refresh_token]);

  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const checkSessionTimeout = async () => {
      const now = Math.floor(Date.now() / 1000);

      if (sessionExpiresAt && now > sessionExpiresAt) {
        dispatch(clearAccessToken());
        await auth.removeUser();
        await auth.signinRedirect();
      }
    };

    const sessionCheckInterval = setInterval(() => {
      void checkSessionTimeout();
    }, checkInterval * 1000);

    return () => clearInterval(sessionCheckInterval);
  }, [auth, checkInterval, dispatch, sessionExpiresAt]);
};
