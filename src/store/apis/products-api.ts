import { baseApi as api } from "../base-api";
export const addTagTypes = ["products"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      listProducts: build.query<ListProductsApiResponse, ListProductsApiArg>({
        query: (queryArg) => ({
          url: `/api/products`,
          params: {
            context: queryArg.context,
          },
        }),
        providesTags: ["products"],
      }),
      getProduct: build.query<GetProductApiResponse, GetProductApiArg>({
        query: (queryArg) => ({ url: `/api/products/${queryArg.rid}` }),
        providesTags: ["products"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as productsApi };
export type ListProductsApiResponse = /** status 200 No result */ Products;
export type ListProductsApiArg = {
  /** Selected context */
  context: string;
};
export type GetProductApiResponse = /** status 200 No result */ Product;
export type GetProductApiArg = {
  rid: string;
};
export type Product = {
  /** The product id */
  prdId?: string | null;
  /** The context */
  context: string;
  /** The product */
  product?: string | null;
  /** Description */
  description: string;
  /** Indicates if the product can be processed by the Airtime Subsystem (Y/N) */
  airSubsFlag: string;
  /** Indicates if the product can be processed by the Activation Subsystem (Y/N) */
  actSubsFlag: string;
  /** Indicates if the airtime for this product can be calculated in the invoice line level */
  airInvLnFlag?: string | null;
  /** Indicates if the product can be processed by the combined target Subsystem (Y/N) */
  ctgSubsFlag?: string | null;
} | null;
export type Products = Product[];
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
export const { useListProductsQuery, useGetProductQuery } = injectedRtkApi;
