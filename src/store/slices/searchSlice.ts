import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  query: string;
  category?: string;
}

const initialState: SearchState = {
  query: '',
  category: undefined,
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
    clear(state) {
      state.query = '';
      state.category = undefined;
    },
  },
});

export const { setQuery, setCategory, clear } = searchSlice.actions;
export default searchSlice.reducer;
