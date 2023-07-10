// ? Librairies
import { createAsyncThunk } from '@reduxjs/toolkit';

// ? Instance Axios
import axiosInstance from '../../utils/axios';

const signinUser = createAsyncThunk(
  'user/signinUser',
  async (objData: FormData) => {
    console.log('objData', objData);
    try {
      const { data } = await axiosInstance.post('/signin', objData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // ? On retourne le state
      return data;
    } catch (error) {
      console.error();
      error;
      // throw new Error("Une erreur s'est produite lors de l'inscription'.");

      // console.error('Error during signin:', error);
      throw error;
    }
  }
);

export default signinUser;
