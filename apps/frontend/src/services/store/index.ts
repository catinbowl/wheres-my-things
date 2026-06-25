import authReducer from "@/services/store/slices/auth-slice";
import thingsReducer from "@/services/store/slices/things-slice";
import settingsReducer from "./slices/settings-slices";
import appReducer from "./slices/app-slice";

import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    app: appReducer,
    settings: settingsReducer,
    things: thingsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
