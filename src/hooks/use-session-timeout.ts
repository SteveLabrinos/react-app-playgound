import { useAuth } from "react-oidc-context";
import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/hooks/rtk-hooks.ts";
import { clearAccessToken } from "@/store/slices/auth-slice.ts";

const sessionTimeout = 120; // 2 minutes tmp
const checkInterval = 10;
const iframeFocusCheckInterval = 60;
const activityEvents = ["mousedown", "keydown"];

export const useSessionTimeout = () => {
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const lastActivityTime = useRef(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const updateLastActivity = () => {
      lastActivityTime.current = Math.floor(Date.now() / 1000);
    };

    const checkIframeFocus = () => {
      if (document.activeElement?.tagName === "IFRAME") {
        updateLastActivity();
      }
    };

    const iFrameInterval = setInterval(
      checkIframeFocus,
      iframeFocusCheckInterval * 1000,
    );

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
      clearInterval(iFrameInterval);
    };
  }, []);

  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const checkSessionTimeout = async () => {
      const timeSinceLastActivity =
        Math.floor(Date.now() / 1000) - lastActivityTime.current;

      console.log("Checking session timeout", timeSinceLastActivity);

      if (timeSinceLastActivity >= sessionTimeout) {
        dispatch(clearAccessToken());
        await auth.removeUser();
        await auth.signoutRedirect();
      }
    };

    const sessionCheckInterval = setInterval(() => {
      void checkSessionTimeout();
    }, checkInterval * 1000);

    return () => clearInterval(sessionCheckInterval);
  }, [auth, dispatch]);
};
