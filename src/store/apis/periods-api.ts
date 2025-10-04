import { baseApi as api } from "../base-api";
export const addTagTypes = ["periods"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      listPeriods: build.query<ListPeriodsApiResponse, ListPeriodsApiArg>({
        query: (queryArg) => ({
          url: `/api/periods`,
          params: {
            context: queryArg.context,
          },
        }),
        providesTags: ["periods"],
      }),
      getPeriod: build.query<GetPeriodApiResponse, GetPeriodApiArg>({
        query: (queryArg) => ({ url: `/api/periods/${queryArg.rid}` }),
        providesTags: ["periods"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as periodsApi };
export type ListPeriodsApiResponse = /** status 200 No result */ Periods;
export type ListPeriodsApiArg = {
  /** Selected context */
  context: string;
};
export type GetPeriodApiResponse = /** status 200 No result */ Period;
export type GetPeriodApiArg = {
  rid: string;
};
export type Period = {
  /** The period id */
  perId?: string | null;
  /** The context */
  context: string;
  /** Period. Format YYYYMM or YYYYMMDD */
  period?: number | null;
  /** Indicates Period Status regarding to source data. Available (Y) / Not Available (N) */
  srcStatus?: string | null;
  /** The start date of the period */
  startDate?: string | null;
  /** The end date of the period */
  endDate?: string | null;
};
export type Periods = Period[];
export type ApplicationError = {
  detail: string;
  pointer?: string | null;
};
export type ApplicationErrorList = ApplicationError[];
export type ApiError = {
  type?: string | null;
  status?: number | null;
  title?: string | null;
  detail?: string | null;
  instance?: string | null;
  traceId?: string | null;
  errors?: ApplicationErrorList;
};
export const { useListPeriodsQuery, useGetPeriodQuery } = injectedRtkApi;
