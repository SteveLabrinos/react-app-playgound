import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ApplicationSlice = {
  context: string;
};

const initialState: ApplicationSlice = { context: "MAIN" };

export const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    changeContext: (state, action: PayloadAction<string>) => {
      state.context = action.payload;
    },
  },
});

export const applicationReducer = applicationSlice.reducer;
export const { changeContext } = applicationSlice.actions;
