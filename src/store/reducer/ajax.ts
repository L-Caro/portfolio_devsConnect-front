// ? Librairies
import { createAction, createReducer } from '@reduxjs/toolkit';

// ? Fonctions externes
import checkPassword from '../actions/checkPassword';

// ? Typage global
interface AjaxState {
  loading: boolean;
  message?: string;
  status?: string;
}

const initialState: AjaxState = {
  loading: false,
  message: '',
  status: '',
};

const ajaxReducer = createReducer(initialState, (builder) => {
  builder.addCase(checkPassword.pending, (state) => {
    state.loading = true;
    state.message = '';
  });
  builder.addCase(checkPassword.fulfilled, (state, action) => {
    state.loading = false;
    state.message = action.payload.message;
    state.status = action.payload.status;
  });
  builder.addCase(checkPassword.rejected, (state, action) => {
    state.loading = false;
    state.message = action.payload.message;
    state.status = action.payload.status;
  });
});

export default ajaxReducer;
