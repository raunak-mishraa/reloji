import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  query: string;
  category?: string;
  location?: string;
}

const initialState: SearchState = {
  query: '',
  category: undefined,
  location: undefined,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setCategory(state, action: PayloadAction<string | undefined>) {
      state.category = action.payload;
    },
    setLocation(state, action: PayloadAction<string | undefined>) {
      state.location = action.payload;
    },
    clear(state) {
      state.query = '';
      state.category = undefined;
      state.location = undefined;
    },
  },
});

export const { setQuery, setCategory, setLocation, clear } = searchSlice.actions;
export default searchSlice.reducer;
