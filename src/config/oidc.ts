import { UserManager, WebStorageStateStore } from "oidc-client-ts";

const getUILocale = () => {
  const language = localStorage.getItem("i18nextLng") || "en";
  const localeMap: Record<string, string> = {
    "en-US": "en",
    en: "en",
    el: "el",
    "en-GR": "el",
  };
  return localeMap[language] || "en";
};

const userManager = new UserManager({
  authority: import.meta.env.VITE_AUTHORITY,
  client_id: import.meta.env.VITE_CLIENT_ID,
  redirect_uri: `${window.location.origin}/`,
  post_logout_redirect_uri: `${window.location.origin}/`,
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  response_type: "code",
  response_mode: "query",
  loadUserInfo: true,
  monitorSession: true,
  scope: "openid email profile",
  automaticSilentRenew: true,
  silentRequestTimeoutInSeconds: 10,
  ui_locales: getUILocale(),
});

const onSigninCallback = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

const onSignoutCallback = () => {
  window.history.replaceState({}, document.title, "/");
};

export const oidc = { userManager, onSigninCallback, onSignoutCallback };
