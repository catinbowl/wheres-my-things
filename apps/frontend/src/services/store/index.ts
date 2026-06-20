import authReducer from "@/services/store/slices/auth-slice";
import thingsReducer from "@/services/store/slices/things-slice";
import settingsReducer from "./slices/settings-slices";

import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    things: thingsReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
