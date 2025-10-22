import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminState {
  activeTab: string;
  isLoading: boolean;
}

const initialState: AdminState = {
  activeTab: 'overview',
  isLoading: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setActiveTab, setLoading } = adminSlice.actions;
export default adminSlice.reducer;
