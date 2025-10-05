import { useAuth, useAutoSignin } from "react-oidc-context";
import { useCallback, useEffect, useRef } from "react";
import { clearAccessToken, setAccessToken } from "@/store/slices/auth-slice.ts";
import { useAppDispatch } from "@/hooks/rtk-hooks.ts";
import { useActivityTracker } from "@/hooks/use-activity-tracker.ts";

const renewBeforeExpiration = 60;
const checkInterval = 10;

export const useTokenRenewal = () => {
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const lastActivityTime = useActivityTracker();
  const isRenewing = useRef(false);

  useAutoSignin({ signinMethod: "signinRedirect" });

  /** Checks if the token needs to be renewed based on the expiration time */
  const needsRenewal = useCallback(() => {
    if (!auth.user?.expires_at) return false;

    const tokenExpirationTime = auth.user?.expires_at - renewBeforeExpiration;

    return lastActivityTime.current >= tokenExpirationTime;
  }, [auth.user?.expires_at, lastActivityTime]);

  /** Attempts to renew the token silently */
  const attemptTokenRenewal = useCallback(async () => {
    if (
      isRenewing.current ||
      !auth.user ||
      !auth.isAuthenticated ||
      !needsRenewal()
    )
      return;

    console.log("[Token] Attempting to renew token...");
    isRenewing.current = true;
    try {
      const user = await auth.signinSilent();

      if (user?.access_token) {
        console.log("[Token] Token renewed successfully");
        console.log("User", user);
        dispatch(setAccessToken(user.access_token));
      } else {
        console.warn("[Token] Renewal returned no token");
        dispatch(clearAccessToken());
        await auth.signoutRedirect();
        return;
      }
    } catch (error) {
      console.error("[Token] Error renewing token:", error);
      dispatch(clearAccessToken());
      await auth.signoutRedirect();
    } finally {
      isRenewing.current = false;
    }
  }, [auth, dispatch, needsRenewal]);

  /** Periodic checks for token renewal */
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Attempting token renewal");
      void attemptTokenRenewal();
    }, checkInterval * 1000);

    return () => clearInterval(intervalId);
  }, [attemptTokenRenewal]);
};
