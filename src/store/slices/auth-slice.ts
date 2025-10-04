import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthSlice = {
  accessToken: string | null;
};

const initialState: AuthSlice = {
  accessToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    clearAccessToken: (state) => {
      state.accessToken = initialState.accessToken;
    },
  },
});

export const authReducer = authSlice.reducer;
export const { setAccessToken, clearAccessToken } = authSlice.actions;
