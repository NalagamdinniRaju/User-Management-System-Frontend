import axios from 'axios';

const BASE_URL = 'https://user-management-system-backend-ln46.onrender.com';

const api = {
  getUsers: async (page, search) => {
    try {
      const response = await axios.get(`${BASE_URL}/users`, { params: { page, search } });
      return response;
    } catch (error) {
      throw error.response.data.message || 'Failed to fetch users';
    }
  },

  createUser: async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/users`, data);
      return response;
    } catch (error) {
      throw error.response.data.message || 'Failed to add user';
    }
  },

  updateUser: async (id, data) => {
    try {
      const response = await axios.put(`${BASE_URL}/users/${id}`, data);
      return response;
    } catch (error) {
      throw error.response.data.message || 'Failed to update user';
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/users/${id}`);
      return response;
    } catch (error) {
      throw error.response.data.message || 'Failed to delete user';
    }
  },
};

export default api;
