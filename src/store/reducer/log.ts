// ? Librairies
import { createAction, createReducer } from '@reduxjs/toolkit';

// ? Fonctions externes
import signinUser from '../actions/signin';
import updateMember from '../actions/updateMember';

// ? Typage local
interface LogState {
  modalLogin: boolean;
  modalSignin: boolean;
  modalDelete: boolean;
  modalPassword: boolean;
  isEditMode: boolean;
}

// ? InitialState
const initialState: LogState = {
  modalLogin: false,
  modalSignin: false,
  modalDelete: false,
  modalPassword: false,
  isEditMode: false,
};

// ? Fonctions synchrone
export const toggleModalLogin = createAction('log/toggleModalLogin');
export const toggleModalSignin = createAction('log/toggleModalSignin');
export const toggleModalDelete = createAction('log/toggleModalDelete');
export const toggleModalPassword = createAction('log/toggleModalPassword');
export const toggleEditMode = createAction('log/toggleEditMode');

// ? Reducer
const logReducer = createReducer(initialState, (builder) => {
  builder
    //* Cas du clic sur le bouton de connexion
    .addCase(toggleModalLogin, (state) => {
      state.modalLogin = !state.modalLogin; // Inverse la valeur du state
      state.modalSignin = false; // Remet la valeur du state signin à false
    })
    //* Cas du clic sur le bouton d'inscription
    .addCase(toggleModalSignin, (state) => {
      state.modalSignin = !state.modalSignin; // Inverse la valeur du state
      state.modalLogin = false; // Remet la valeur du state login à false
    })
    //* Cas du clic sur le bouton de suppression
    .addCase(toggleModalDelete, (state) => {
      state.modalDelete = !state.modalDelete; // Inverse la valeur du state
    })
    //* Cas du clic sur le bouton de modification du mot de passe
    .addCase(toggleModalPassword, (state) => {
      state.modalPassword = !state.modalPassword; // Inverse la valeur du state
    })
    //* Cas du clic sur le bouton d'édition
    .addCase(toggleEditMode, (state) => {
      state.isEditMode = !state.isEditMode; // Inverse la valeur du state
    })

    //* Cas de l'inscription échouée
    .addCase(signinUser.rejected, (state) => {
      state.modalSignin = true;
    })

    //* Cas de l'update de membre échouée
    .addCase(updateMember.rejected, (state) => {
      state.isEditMode = true;
    });
});

export default logReducer;
