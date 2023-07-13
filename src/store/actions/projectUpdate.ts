// ? Librairies
import { createAsyncThunk } from '@reduxjs/toolkit';

// ? Instance Axios
import axiosInstance from '../../utils/axios';

// ? Typage local
type UpdateProjectI = {
  id: number | null;
  objData: FormData;
};

//* Update un projet
const projectUpdate = createAsyncThunk(
  'project/projectUpdate',
  async ({ id, objData }) => {
    try {
      const { data } = await axiosInstance.put(`/api/projects/${id}`, objData, {
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

export default projectUpdate;
