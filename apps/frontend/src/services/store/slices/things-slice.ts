
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { router } from "expo-router";
import { SQLiteDatabase } from "expo-sqlite";
import { RootState } from "..";
import { TThing } from "@/services/database/types";
import { ThingsRepo } from "@/services/database/repos/things-repo";

interface ThingsState {
  data: TThing[];
  isLoading: boolean;
}

const initialState: ThingsState = {
  data: [],
  isLoading: false,
};

export const fetchThings = createAsyncThunk(
  "things/fetchThings",
  async (db: SQLiteDatabase) => {
    return await ThingsRepo.selectAll(db);
  },
);

export const searchThings = createAsyncThunk(
  "things/searchThings",
  async ({ db, query }: { db: SQLiteDatabase; query: string }) => {
    return await ThingsRepo.searchByName(db, query);
  },
);

export const insertThing = createAsyncThunk(
  "things/insertThing",
  async ({
    db,
    data,
  }: {
    db: SQLiteDatabase;
    data: {
      uid: string;
      name: string;
      imageURI: string;
      latitude: number;
      longitude: number;
    };
  }) => {
    const result = await ThingsRepo.insert(db, data);

    return !!result;
  },
);

const thingsSlice = createSlice({
  name: "things",
  initialState,
  reducers: {
    resetThings: (state) => {
      state.data = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchThings.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchThings.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(searchThings.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(insertThing.fulfilled, () => {
      router.replace("/app");
    });
  },
});

export const { resetThings: resetSomethings } = thingsSlice.actions;

export const selectThings = (state: RootState) => state.things;

export default thingsSlice.reducer;
