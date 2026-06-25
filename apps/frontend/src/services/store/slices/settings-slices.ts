import Storage from "expo-sqlite/kv-store";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

interface SettingsState {
  data: {
    theme: "light" | "dark" | "system";
    isOfflineMode: boolean;
  };
  isLoading: boolean;
}

const initialState: SettingsState = {
  data: {
    theme: "system",
    isOfflineMode: false,
  },
  isLoading: true,
};

export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async () => {
    try {
      const [theme, isOfflineMode] = await Storage.multiGet([
        "theme",
        "isOfflineMode",
      ]);

      return {
        theme: theme[1] || "system",
        isOfflineMode: Boolean(isOfflineMode[1]),
      } as SettingsState["data"];
    } catch (error) {
      console.error("settings-slices.ts", error);
      return initialState.data;
    }
  },
);

export const initSettings = createAsyncThunk(
  "settings/initialize",
  async (isOfflineMode: boolean) => {
    await Storage.multiSet([
      ["theme", "system"],
      ["isOfflineMode", isOfflineMode ? "1" : ""],
    ]);

    return {
      theme: "system",
      isOfflineMode,
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
    builder.addCase(initSettings.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export const { setTheme, setOfflineMode } = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;

export default settingsSlice.reducer;
