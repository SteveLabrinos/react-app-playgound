import { useAuth } from "react-oidc-context";
import { useAppDispatch } from "@/hooks/rtk-hooks.ts";
import { useCallback, useEffect, useRef } from "react";
import { clearAccessToken, setAccessToken } from "@/store/slices/auth-slice.ts";

interface UseTokenRenewalOptions {
  renewBeforeExpiration: number;
  checkInterval: number;
  activityEvents?: string[];
}

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
 *
 * @throws RuntimeException If token renewal fails due to authentication errors
 *                          or network issues during the process.
 */
export const useTokenRenewal = ({
  renewBeforeExpiration = 90,
  checkInterval = 30,
  activityEvents = ["mousedown", "keydown"],
}: UseTokenRenewalOptions) => {
  const auth = useAuth();
  const dispatch = useAppDispatch();
  const lastActivityTime = useRef(Math.floor(Date.now() / 1000));
  const isRenewing = useRef(false);

  /** Updates the last activity time to the current timestamp */
  const updateLastActivity = () => {
    console.log("[Token] Last activity updated");
    lastActivityTime.current = Math.floor(Date.now() / 1000);
  };

  /** Checks if the token needs to be renewed based on the expiration time */
  const needsRenewal = useCallback(() => {
    if (!auth.user?.expires_at) return false;

    const tokenExpirationTime = auth.user?.expires_at - renewBeforeExpiration;
    // TMP DEBUG
    console.log(
      "Token Expiration Date: ",
      new Date(auth.user?.expires_at * 1000),
    );
    console.log("Now: ", new Date(Date.now()));
    console.log("Token Renew Date: ", new Date(tokenExpirationTime * 1000));
    console.log("Last Activity: ", new Date(lastActivityTime.current * 1000));
    console.log(
      "Needs Renewal: ",
      lastActivityTime.current >= tokenExpirationTime,
    );

    return lastActivityTime.current >= tokenExpirationTime;
  }, [auth.user?.expires_at, renewBeforeExpiration]);

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
        console.log("[Token] Token renewed successfully");
        dispatch(setAccessToken(user.access_token));
      } else {
        console.warn("[Token] Renewal returned no token");
        dispatch(clearAccessToken());
        await auth.signoutRedirect();
      }
    } catch (error) {
      console.error("[Token] Error renewing token:", error);
      dispatch(clearAccessToken());
      await auth.signoutRedirect();
    } finally {
      isRenewing.current = false;
    }
  }, [auth, needsRenewal, dispatch]);

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
  }, [activityEvents]);

  /** Periodic checks for token renewal */
  useEffect(() => {
    void attemptTokenRenewal();
    const intervalId = setInterval(() => {
      void attemptTokenRenewal();
    }, checkInterval * 1000);

    return () => clearInterval(intervalId);
  }, [attemptTokenRenewal, checkInterval]);
};
