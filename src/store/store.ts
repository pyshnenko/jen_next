import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userDataStore';

// Пока нет редьюсеров — оставим пустой
const store = configureStore({
  reducer: {
    user: userReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
