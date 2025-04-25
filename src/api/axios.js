import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tạo instance của axios
const api = axios.create({
  baseURL: 'http://192.168.1.5:8082/skillbridge', // thay bằng baseURL backend của bạn
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm token vào mỗi request nếu có
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
  config.headers.Authorization = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJza2lsbF9icmlkZ2UiLCJzdWIiOiJob2FuZyIsImV4cCI6MTc0NTU1NDQ1NCwiaWF0IjoxNzQ1NTUwODU0LCJqdGkiOiI1Mzk5MDJiMi1iYWYzLTRjM2QtOTEyNS0wZmFhYjVkMTVlNTIiLCJzY29wZSI6IlRFQUNIRVIifQ.cNPMzJHSFexU74dJ7j6uuoSdDyFsxJwvVjDs5QT9PwdzJm62R6ASjyatcNbNOfIY0qoLNBWhdqFvknOwg73Vrw`;
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;