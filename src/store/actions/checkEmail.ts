// actions.js
import { createAsyncThunk } from '@reduxjs/toolkit';

// ? instance Axios
import axiosInstance from '../../utils/axios';

const checkEmail = createAsyncThunk('ajax/checkEmail', async (email) => {
  try {
    const { data } = await axiosInstance.post('/api/users/checkEmail', email);
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
});
export default checkEmail;
