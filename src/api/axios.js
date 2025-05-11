import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tạo instance của axios
const apiJson = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiForm = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL, 
  timeout: 10000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
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
  apiForm,
};
