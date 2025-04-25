import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tạo instance của axios
const api = axios.create({
  baseURL: 'http://192.168.1.5:8082/skillbridge', // thay bằng baseURL backend
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm token vào mỗi request nếu có
api.interceptors.request.use(async (config) => {
  const data = await AsyncStorage.getItem('@auth');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

  if (!config.url.endsWith('/register', '') && !config.url.endsWith('/log-in', '')) {
    config.headers.Authorization = `Bearer ${JSON.parse(data).token}`;
  }
//   config.headers.Authorization = ;
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;