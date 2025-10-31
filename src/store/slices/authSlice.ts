import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthUser {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  phone?: string | null;
}

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
}

const initialState: AuthState = {
  status: 'loading',
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState(state, action: PayloadAction<{ status: AuthStatus; user: AuthUser | null }>) {
      state.status = action.payload.status;
      state.user = action.payload.user;
    },
  },
});

export const { setAuthState } = authSlice.actions;
export default authSlice.reducer;
