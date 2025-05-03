import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tạo instance của axios
<<<<<<< Updated upstream
const api = axios.create({
  baseURL: 'http://192.168.1.5:8082/skillbridge', // thay bằng baseURL backend
=======
const apiJson = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  // baseURL: 'http://192.168.1.5:8082/skillbridge',
>>>>>>> Stashed changes
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

<<<<<<< Updated upstream
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
=======
const apiForm = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL, 
  timeout: 10000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
>>>>>>> Stashed changes
});

// Thêm token vào mỗi request nếu có
apiJson.interceptors.request.use(
  async (config) => {
    const data = await AsyncStorage.getItem('@auth');

    // console.log(data)
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    if (!config.url.endsWith('/register') && !config.url.endsWith('/log-in')) {
      config.headers.Authorization = `Bearer ${JSON.parse(data).token}`;
    }
    // config.headers.Authorization = ;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiForm.interceptors.request.use(
  async (config) => {
    const data = await AsyncStorage.getItem('@auth');

    if (!config.url.endsWith('/register') && !config.url.endsWith('/log-in')) {
      config.headers.Authorization = `Bearer ${JSON.parse(data).token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export {
  apiJson,
  apiForm,};
