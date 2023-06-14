import { createReducer, createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '../../utils/axios';

import { ProjectI } from '../../@types/interface';

interface ProjectState {
  status?: string;
  list: {
    data: ProjectI[];
    loading: boolean;
  };
  project: {
    data: ProjectI | null;
    loading: boolean;
  };
}

export const initialState: ProjectState = {
  list: {
    data: [],
    loading: false,
  },
  project: {
    data: null,
    loading: false,
  },
};

export const fetchAllProjects = createAsyncThunk(
  'project/fetchAllProjects',
  async () => {
    try {
      const { data } = await axiosInstance.get('/api/projects');
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
);

export const fetchOneProject = createAsyncThunk(
  'project/fetchOneProject',
  async (id: number) => {
    try {
      const { data } = await axiosInstance.get(`/api/projects/${id}`);
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
);

const projectsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchAllProjects.fulfilled, (state, action) => {
      state.list.data = action.payload.data;
      state.list.loading = false;
    })
    .addCase(fetchAllProjects.rejected, (state) => {
      state.list.data = [];
      state.list.loading = false;
    })
    .addCase(fetchAllProjects.pending, (state) => {
      state.list.loading = true;
    });

  builder
    .addCase(fetchOneProject.fulfilled, (state, action) => {
      state.project.data = action.payload.data;
      state.project.loading = false;
    })
    .addCase(fetchOneProject.rejected, (state) => {
      state.project.data = null;
      state.project.loading = false;
    })
    .addCase(fetchOneProject.pending, (state) => {
      state.project.loading = true;
    });
});

export default projectsReducer;