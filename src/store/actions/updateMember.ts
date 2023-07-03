// ? Librairies
import { createAsyncThunk } from '@reduxjs/toolkit';

// ? Instance Axios
import axiosInstance from '../../utils/axios';

// ? Typage local
type UpdateMemberI = {
  id: number | null;
  formData: FormData & { availability: boolean | undefined };
};

//* Update un membre
const updateMember = createAsyncThunk(
  'user/updateMember',
  async ({ id, formData }: UpdateMemberI) => {
    try {
      console.log('localstorage', localStorage);
      const { data } = await axiosInstance.put(`/api/users/${id}`, formData);
      // ? On retourne le state

      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
);

export default updateMember;
