import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { RootState } from "@/store";
import { oidc } from "@/config/oidc.ts";
import { setAccessToken } from "@/store/slices/auth-slice.ts";

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
    try {
      console.log("Token expired, renewing silently...");
      const user = await oidc.userManager.signinSilent();

      if (user) {
        api.dispatch(setAccessToken(user.access_token));
        return await baseQuery(args, api, extraOptions);
      }
    } catch (error) {
      console.error("Error silently renewing token:", error);
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
