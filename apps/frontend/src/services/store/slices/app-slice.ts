import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Storage } from "expo-sqlite/kv-store";
import { RootState } from "..";

type TInitialState = {
  data: {
    isInitialized: boolean;
  };
  isLoading: boolean;
};

const initialState: TInitialState = {
  data: {
    isInitialized: false,
  },
  isLoading: true,
};

export const fetchAppState = createAsyncThunk("app/fetchState", async () => {
  const state = await Storage.multiGet(["isInitialized"]);

  return { isInitialized: Boolean(state[0][1]) } as TInitialState["data"];
});

export const initializeApp = createAsyncThunk("app/initialize", async () => {
  await Storage.multiSet([["isInitialized", "1"]]);
});

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initializeApp.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(initializeApp.fulfilled, (state) => {
      state.data.isInitialized = true;
      state.isLoading = false;
    });
    builder.addCase(fetchAppState.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAppState.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
    });
  },
});

export const selectAppState = (state: RootState) => state.app;
export default appSlice.reducer;
