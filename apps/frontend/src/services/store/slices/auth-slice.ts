import Storage from "expo-sqlite/kv-store";

import { TUser } from "@/services/database/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Buffer } from "buffer";
import { RootState } from "..";
import { initSettings } from "./settings-slices";

type TAuthState = {
  data: {
    user: TUser | null;
    token: string | null;
  };
  isLoading: boolean;
};

const initialState: TAuthState = {
  data: {
    user: null,
    token: null,
  },
  isLoading: false,
};

export const signin = createAsyncThunk(
  "auth/signin",
  async (
    { email, password }: { email: string; password: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      dispatch(setLoading(true));
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      const resObj: { user: TUser } = data;

      await Storage.multiSet([
        ["user", JSON.stringify(resObj)],
        ["token", "session-cookie"],
      ]);

      dispatch(initSettings(false));
      return resObj.user;
    } catch (error: any) {
      console.error("Sign in failed", error);

      return rejectWithValue(error.message || "Sign in failed");
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const validateSession = createAsyncThunk(
  "auth/validateSession",
  async () => {
    try {
      const [[, userStr], [, token]] = await Storage.multiGet([
        "user",
        "token",
      ]);

      if (userStr && token) {
        let isExpired = false;

        try {
          if (token !== "session-cookie") {
            const parts = token.split(".");

            if (parts.length === 3) {
              const payload = JSON.parse(
                Buffer.from(parts[1], "base64").toString(),
              );

              if (payload.exp && Date.now() >= payload.exp * 1000) {
                isExpired = true;
              }
            }
          }
        } catch (error) {
          console.error("Token expiration check failed", error);
        }

        if (!isExpired) {
          const user = JSON.parse(userStr) as TUser;

          return user;
        } else {
          await Storage.multiRemove(["user", "token"]);
        }
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/validate`,
      );

      if (response.ok) {
        const data = await response.json();
        const user = data.user || data.message;
        const newToken = "session-cookie";

        await Storage.multiSet([
          ["user", JSON.stringify(user)],
          ["token", newToken],
        ]);

        return user;
      } else {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Session validation failed", error);
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    try {
      await Storage.multiRemove(["user", "token"]);
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/logout`);
    } catch (error) {
      console.error("Logout failed", error);
    }
  },
);

export const updateSubscription = createAsyncThunk(
  "auth/updateSubscription",
  async (planId: string, { getState, dispatch }) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ planId }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update subscription");
      }

      const data = await response.json();
      const state = getState() as { auth: TAuthState };

      if (state.auth.data.token) {
        await Storage.multiSet([
          ["user", JSON.stringify(data.user)],
          ["token", state.auth.data.token],
        ]);
      }

      return data.user;
    } catch (error: any) {
      console.error("Subscription update failed", error);
      throw error;
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: TUser; token: string }>) => {
      state.data.user = action.payload.user;
      state.data.token = action.payload.token;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(validateSession.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      validateSession.fulfilled,
      (state, action: PayloadAction<TAuthState["data"]>) => {
        state.data = action.payload;
        state.isLoading = false;
      },
    );
    builder.addCase(validateSession.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.data.user = null;
      state.data.token = null;
    });
  },
});

export const { setAuth, setLoading } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
