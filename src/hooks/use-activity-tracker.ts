import { useEffect, useRef } from "react";

const iframeFocusCheckInterval = 60;
const activityEvents = ["mousedown", "keydown"];

export const useActivityTracker = () => {
  const lastActivityTime = useRef(Math.floor(Date.now() / 1000));

  useEffect(() => {
    /** Updates the last activity time to the current timestamp */
    const updateLastActivity = () => {
      lastActivityTime.current = Math.floor(Date.now() / 1000);
    };

    /** Updates the last activity if the iframe is focused */
    const checkIframeFocus = () => {
      if (document.activeElement?.tagName === "IFRAME") {
        updateLastActivity();
      }
    };

    /** Periodic check for iframe focus */
    const iFrameInterval = setInterval(() => {
      checkIframeFocus();
    }, iframeFocusCheckInterval * 1000);

    /** Listens for user activity events to update the last activity time */
    activityEvents.forEach((event) => {
      window.addEventListener(event, updateLastActivity, {
        passive: true,
        capture: true,
      });
    });

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateLastActivity, {
          capture: true,
        });
      });
      clearInterval(iFrameInterval);
    };
  }, []);

  return lastActivityTime;
};
