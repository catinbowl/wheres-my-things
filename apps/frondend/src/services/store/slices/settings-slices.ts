import Storage from "expo-sqlite/kv-store";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

interface SettingsState {
  data: {
    theme: "light" | "dark" | "system";
    isOfflineMode: boolean;
    isInitialized: boolean;
  };
  isLoading: boolean;
}

const initialState: SettingsState = {
  data: {
    theme: "system",
    isOfflineMode: false,
    isInitialized: false,
  },
  isLoading: true,
};

export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async () => {
    const settings = await Storage.multiGet([
      "theme",
      "isOfflineMode",
      "isInitialized",
    ]);
    const theme = settings[0][1];
    const isOfflineMode = settings[1][1] === "true" || false;
    const isInitialized = settings[2][1] === "true" || false;

    return {
      theme: theme || "system",
      isOfflineMode,
      isInitialized,
    } as SettingsState["data"];
  },
);

export const initialize = createAsyncThunk(
  "settings/initialize",
  async (isOfflineMode: boolean) => {
    await Storage.multiSet([
      ["theme", "system"],
      ["isOfflineMode", isOfflineMode.toString()],
      ["isInitialized", "true"],
    ]);

    return {
      theme: "system",
      isOfflineMode,
      isInitialized: true,
    } as SettingsState["data"];
  },
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.data.theme = action.payload;
    },
    setOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.data.isOfflineMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSettings.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchSettings.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchSettings.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(initialize.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export const { setTheme, setOfflineMode } = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;

export default settingsSlice.reducer;
