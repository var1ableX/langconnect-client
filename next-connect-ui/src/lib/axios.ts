import axios from 'axios';
import { createClient } from './supabase/server';

export const API_URL = process.env.API_URL ? process.env.API_URL : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

// axios instance for server-side API calls
const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use(async (config) => {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.error('[axios] Error getting session:', error);
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Handle 204 No Content responses
    if (response.status === 204) {
      response.data = { success: true };
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the session
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.access_token) {
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('[axios] Error refreshing session:', refreshError);
      }
    }   
    
    return Promise.reject(error);
  }
);


export default api;
