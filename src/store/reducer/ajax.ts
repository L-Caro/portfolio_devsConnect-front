// ? Librairies
import { createReducer } from '@reduxjs/toolkit';

// ? Fonctions externes
import checkPassword from '../actions/checkPassword';
import checkPseudo from '../actions/checkPseudo';
import checkEmail from '../actions/checkEmail';

// ? Typage global
interface AjaxState {
  loading: boolean;
  passwordMessage: string;
  pseudoMessage: string;
  emailMessage: string;
  passwordStatus?: string;
  pseudoStatus?: string;
  emailStatus?: string;
}

const initialState: AjaxState = {
  loading: false,
  passwordMessage: '',
  pseudoMessage: '',
  emailMessage: '',
  passwordStatus: '',
  pseudoStatus: '',
  emailStatus: '',
};

const ajaxReducer = createReducer(initialState, (builder) => {
  builder.addCase(checkPassword.pending, (state) => {
    state.loading = true;
    state.passwordMessage = '';
  });
  builder.addCase(checkPassword.fulfilled, (state, action) => {
    state.loading = false;
    state.passwordMessage = action.payload.message;
    state.passwordStatus = action.payload.status;
  });
  builder.addCase(checkPassword.rejected, (state) => {
    state.loading = false;
    state.passwordMessage =
      'Une erreur est survenue, veuillez réessayer ultérieurement.';
  });
  builder.addCase(checkPseudo.pending, (state) => {
    state.loading = true;
    state.pseudoMessage = '';
  });
  builder.addCase(checkPseudo.fulfilled, (state, action) => {
    state.loading = false;
    state.pseudoMessage = action.payload.message;
    state.pseudoStatus = action.payload.status;
  });
  builder.addCase(checkPseudo.rejected, (state) => {
    state.loading = false;
    state.pseudoMessage =
      'Une erreur est survenue, veuillez réessayer ultérieurement.';
  });
  builder.addCase(checkEmail.pending, (state) => {
    state.loading = true;
    state.emailMessage = '';
  });
  builder.addCase(checkEmail.fulfilled, (state, action) => {
    state.loading = false;
    state.emailMessage = action.payload.message;
    state.emailStatus = action.payload.status;
  });
  builder.addCase(checkEmail.rejected, (state) => {
    state.loading = false;
    state.emailMessage =
      'Une erreur est survenue, veuillez réessayer ultérieurement.';
  });
});

export default ajaxReducer;
