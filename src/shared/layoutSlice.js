import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
  isApiInProgress: false,
  selectedTodo: null,
  todos: [],
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    startCallingApi: (state) => {
      state.isApiInProgress = true;
    },
    endCallingApi: (state) => {
      state.isApiInProgress = false;
    },
    selectTodo: (state, action) => {
      state.selectedTodo = action.payload;
    },
    addTodo: (state, action) => {
      state.todos = [...state.todos, action.payload];
    },
    setTodos: (state, action) => {
      state.todos = action.payload;
    },
  },
});

export const {
  increment,
  decrement,
  incrementByAmount,
  startCallingApi,
  endCallingApi,
  selectTodo,
  addTodo,
  setTodos,
} = layoutSlice.actions;

export default layoutSlice;
