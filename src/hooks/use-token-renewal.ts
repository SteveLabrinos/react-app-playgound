import { useAuth, useAutoSignin } from "react-oidc-context";
import { useCallback, useEffect, useRef } from "react";
import { clearAccessToken, setAccessToken } from "@/store/slices/auth-slice.ts";
import { useAppDispatch } from "@/hooks/rtk-hooks.ts";

/**
 * Custom hook that manages token renewal for user authentication based on specific activity events,
 * expiration periods, and configurable intervals. This function ensures the token
 * is renewed before its expiration by monitoring user activity and periodically
 * checking if renewal is required.
 *
 * The renewal process will automatically sign out the user if the token cannot
 * be successfully renewed.
 *
 * @param useTokenRenewalOptions Customizable options including
 *        - renewBeforeExpiration: The buffer time in seconds before the token's
 *          actual expiration during which renewal should be attempted. Default is 90 seconds.
 *        - checkInterval: The time interval in seconds for periodic checks of
 *          whether the token needs renewal. Default is 30 seconds.
 *        - activityEvents: An array of DOM event types that indicate user activity,
 *          such as "mousedown" or "keydown". Default includes these events.
 *        - iframeFocusCheckInterval: The time interval in seconds for periodic checks of
 *          whether the iframe is focused. Default is 60 seconds.
 *
 * @throws RuntimeException If token renewal fails due to authentication errors
 *                          or network issues during the process.
 */
const activityEvents = ["mousedown", "keydown"];
const renewBeforeExpiration = 90;
const iframeFocusCheckInterval = 60;
const checkInterval = 10;

export const useTokenRenewal = () => {
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const lastActivityTime = useRef(Math.floor(Date.now() / 1000));
  const isRenewing = useRef(false);

  useAutoSignin({ signinMethod: "signinRedirect" });

  /** Updates the last activity time to the current timestamp */
  const updateLastActivity = () => {
    lastActivityTime.current = Math.floor(Date.now() / 1000);
  };

  /** Checks if the token needs to be renewed based on the expiration time */
  const needsRenewal = useCallback(() => {
    if (!auth.user?.expires_at) return false;

    const tokenExpirationTime = auth.user?.expires_at - renewBeforeExpiration;

    return lastActivityTime.current >= tokenExpirationTime;
  }, [auth.user?.expires_at]);

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

      if (user && user.access_token) {
        console.log("User", user);
        dispatch(setAccessToken(user.access_token));
      } else {
        console.warn("[Token] User or access token is missing after renewal");
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

  const checkIframeFocus = useCallback(() => {
    if (document.activeElement?.tagName === "IFRAME") {
      updateLastActivity();
    }
  }, []);

  /** Listens for user activity events to update the last activity time */
  useEffect(() => {
    activityEvents?.forEach((event) => {
      window.addEventListener(event, updateLastActivity, {
        passive: true,
        capture: true,
      });
    });

    return () => {
      activityEvents?.forEach((event) => {
        window.removeEventListener(event, updateLastActivity, {
          capture: true,
        });
      });
    };
  }, []);

  /** Periodic checks for iframe focus */
  useEffect(() => {
    const intervalId = setInterval(
      checkIframeFocus,
      iframeFocusCheckInterval * 1000,
    );

    return () => clearInterval(intervalId);
  }, [checkIframeFocus]);

  /** Periodic checks for token renewal */
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Attempting token renewal");
      void attemptTokenRenewal();
    }, checkInterval * 1000);

    return () => clearInterval(intervalId);
  }, [attemptTokenRenewal]);
};
