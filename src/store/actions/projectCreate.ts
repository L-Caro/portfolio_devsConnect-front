// ? Librairies
import { createAsyncThunk } from '@reduxjs/toolkit';

// ? Instance Axios
import axiosInstance from '../../utils/axios';

//* Créer un projet
const createProject = createAsyncThunk(
  'project/createProject',
  async (objData: FormData) => {
    try {
      const { data } = await axiosInstance.post('/api/projects', objData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // ? On retourne le state
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
);

export default createProject;
