import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

// Interceptor it calls for each api call and uses baseQuery configuration.
const baseQueryInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // General baseQuery configuration for url & headers.
  const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL_CONFIGURATION,
    prepareHeaders: (headers) => {
      if (api.endpoint !== "uploadAchievementFile") {
        headers.set("Content-Type", "application/vnd.stalab.v1+json");
      }
    },
    isJsonContentType: (headers: Headers) =>
      ["application/json", "application/vnd.stalab.v1+json"].includes(
        headers.get("Content-Type")?.trim() || "",
      ),
    jsonContentType: "application/vnd.stalab.v2+json",
  });

  return baseQuery(args, api, extraOptions);
};

// Base Api with basic configuration. Endpoints will be injected from the code generator
export const baseApi = createApi({
  reducerPath: "playground-app",
  baseQuery: baseQueryInterceptor,
  endpoints: () => ({}),
});
