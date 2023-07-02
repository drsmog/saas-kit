import { configureStore } from "@reduxjs/toolkit";
import layoutSlice from "#src/shared/layoutSlice";

export const store = configureStore({
  reducer: { [layoutSlice.name]: layoutSlice.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
