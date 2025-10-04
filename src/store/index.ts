import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi as api } from "@/store/base-api";
import { applicationReducer } from "@/store/slices/application-slice.ts";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    application: applicationReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(api.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
