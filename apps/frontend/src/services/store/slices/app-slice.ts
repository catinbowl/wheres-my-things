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
  const [[, isInitialized]] = await Storage.multiGet(["isInitialized"]);
  console.log("fetchAppState: isInitialized = ", isInitialized);
  return { isInitialized: Boolean(isInitialized) } as TInitialState["data"];
});

export const initApp = createAsyncThunk("app/initialize", async () => {
  await Storage.multiSet([["isInitialized", "1"]]);

  return { isInitialized: true } as TInitialState["data"];
});

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initApp.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(initApp.fulfilled, (state, action) => {
      state.data = action.payload;
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
