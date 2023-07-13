// ? Librairie
import { createAsyncThunk } from '@reduxjs/toolkit';

// ? instance Axios
import axiosInstance from '../../utils/axios';

//* Supprimer un projet
const projectDelete = createAsyncThunk(
  'project/projectDelete',
  async (id: string) => {
    try {
      await axiosInstance.delete(`/api/projects/${id}`);
      // ? On retourne le state
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
);

export default projectDelete;
