import { create } from 'zustand';
import api from '../services/api';

const useDashboardStore = create((set, get) => ({
  // Users data
  users: [],
  usersLoading: false,
  usersError: null,

  // Tasks data
  tasks: [],
  tasksLoading: false,
  tasksError: null,

  // Task responses data
  taskResponses: [],
  taskResponsesLoading: false,
  taskResponsesError: null,

  // Dashboard stats
  stats: {
    totalUsers: 0,
    totalTasks: 0,
    totalResponses: 0,
    activeUsers: 0
  },
  statsLoading: false,
  statsError: null,

  // Actions for Users
  fetchUsers: async () => {
    set({ usersLoading: true, usersError: null });
    try {
      const response = await api.get('/auth/v1/users');
      set({
        users: response.data.data,
        usersLoading: false,
        usersError: null
      });
    } catch (error) {
      set({
        usersLoading: false,
        usersError: error.response?.data?.message || 'Failed to fetch users'
      });
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.patch(`/auth/v1/users/${userId}/user-profile`, userData);
      // Update user in local state
      const users = get().users;
      const updatedUsers = users.map(user => 
        user._id === userId ? { ...user, ...userData } : user
      );
      set({ users: updatedUsers });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update user' 
      };
    }
  },

  blockUser: async (userId) => {
    try {
      await api.patch(`/auth/v1/users/${userId}/block`);
      // Update user in local state
      const users = get().users;
      const updatedUsers = users.map(user => 
        user._id === userId ? { ...user, isBlocked: true } : user
      );
      set({ users: updatedUsers });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to block user' 
      };
    }
  },

  unblockUser: async (userId) => {
    try {
      await api.patch(`/auth/v1/users/${userId}/unblock`);
      // Update user in local state
      const users = get().users;
      const updatedUsers = users.map(user => 
        user._id === userId ? { ...user, isBlocked: false } : user
      );
      set({ users: updatedUsers });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to unblock user' 
      };
    }
  },

  deleteUser: async (userId) => {
    try {
      await api.delete(`/auth/v1/users/${userId}`);
      // Remove user from local state
      const users = get().users;
      const updatedUsers = users.filter(user => user._id !== userId);
      set({ users: updatedUsers });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to delete user' 
      };
    }
  },

  // Actions for Tasks
  fetchTasks: async () => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await api.get('/task/v1/tasks');
      debugger
      const tasks = response.data.tasks;

          set({
        tasks,
        tasksLoading: false,
        tasksError: null
      });
    } catch (error) {
      set({
        tasksLoading: false,
        tasksError: error.response?.data?.message || 'Failed to fetch tasks'
      });
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await api.post('/task/v1/tasks', taskData);
      // Add new task to local state
      const tasks = get().tasks;
      set({ tasks: [...tasks, response.data.data] });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create task' 
      };
    }
  },

  updateTask: async (taskId, taskData) => {
    try {
      const response = await api.patch(`/task/v1/tasks/${taskId}`, taskData);
      // Update task in local state
      const tasks = get().tasks;
      const updatedTasks = tasks.map(task => 
        task._id === taskId ? { ...task, ...taskData } : task
      );
      set({ tasks: updatedTasks });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update task' 
      };
    }
  },

  deleteTask: async (taskId) => {
    try {
      await api.delete(`/task/v1/tasks/${taskId}`);
      // Remove task from local state
      const tasks = get().tasks;
      const updatedTasks = tasks.filter(task => task._id !== taskId);
      set({ tasks: updatedTasks });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to delete task' 
      };
    }
  },

  // Actions for Task Responses
  fetchTaskResponses: async (taskId) => {
    set({ taskResponsesLoading: true, taskResponsesError: null });
    try {
      const response = await api.get(`/task/v1/tasks/${taskId}/respond`);
      set({
        taskResponses: response.data.data,
        taskResponsesLoading: false,
        taskResponsesError: null
      });
    } catch (error) {
      set({
        taskResponsesLoading: false,
        taskResponsesError: error.response?.data?.message || 'Failed to fetch task responses'
      });
    }
  },

  updateResponseStatus: async (responseId, status, feedback = null) => {
    try {
      const payload = { status };
      if (feedback) {
        payload.feedback = feedback;
      }
      const response = await api.patch(`/task/v1/tasks/responses/${responseId}/status`, payload);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update response status' 
      };
    }
  },

  // Actions for Dashboard Stats
  fetchStats: async () => {
    set({ statsLoading: true, statsError: null });
    try {
      // Fetch all data to calculate stats
      const [usersResponse, tasksResponse] = await Promise.all([
        api.get('/auth/v1/users'),
        api.get('/task/v1/tasks')
      ]);

      const totalUsers = usersResponse.data.data.length;
      const totalTasks = tasksResponse.data.data.length;
      const activeUsers = usersResponse.data.data.filter(user => !user.isBlocked).length;

      set({
        stats: {
          totalUsers,
          totalTasks,
          totalResponses: 0, // This would need a separate endpoint
          activeUsers
        },
        statsLoading: false,
        statsError: null
      });
    } catch (error) {
      set({
        statsLoading: false,
        statsError: error.response?.data?.message || 'Failed to fetch stats'
      });
    }
  },

  // Send notification
  sendNotification: async (notificationData) => {
    try {
      const response = await api.post('/notification/v1/send', notificationData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to send notification' 
      };
    }
  },

  // Send email
  sendEmail: async (emailData) => {
    try {
      const response = await api.post('/email/v1/send-invite', emailData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to send email' 
      };
    }
  }
}));

export default useDashboardStore;
