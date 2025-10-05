import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { RootState } from "@/store";
import { oidc } from "@/config/oidc.ts";
import { clearAccessToken, setAccessToken } from "@/store/slices/auth-slice.ts";

// Interceptor it calls for each api call and uses baseQuery configuration.
const baseQueryInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // General baseQuery configuration for url & headers.
  const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL_CONFIGURATION,
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/vnd.stalab.v1+json");
      const token = (getState() as RootState).auth.accessToken;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
    isJsonContentType: (headers: Headers) =>
      ["application/json", "application/vnd.stalab.v1+json"].includes(
        headers.get("Content-Type")?.trim() || "",
      ),
    jsonContentType: "application/vnd.stalab.v2+json",
  });

  const result = await baseQuery(args, api, extraOptions);
  // Check if the error is 401 due to token expiration when the api is called and try to renew silently
  if (result.error && result.error.status === 401) {
    console.log("[API] Token expired (401), attempting silent renewal...");
    try {
      const user = await oidc.userManager.signinSilent();

      if (user && user.access_token) {
        console.log("[API] Token renewed successfully, retrying request");
        api.dispatch(setAccessToken(user.access_token));
        // Retry the original request with the new token
        return await baseQuery(args, api, extraOptions);
      } else {
        console.warn("[API] User or access token is missing after renewal");
        api.dispatch(clearAccessToken());
        await oidc.userManager.signinRedirect();
      }
    } catch (error) {
      console.error("[API] Error silently renewing token:", error);
      api.dispatch(clearAccessToken());
      await oidc.userManager.signinRedirect();
    }
  }
  return result;
};

// Base Api with basic configuration. Endpoints will be injected from the code generator
export const baseApi = createApi({
  reducerPath: "playground-app",
  baseQuery: baseQueryInterceptor,
  endpoints: () => ({}),
});
