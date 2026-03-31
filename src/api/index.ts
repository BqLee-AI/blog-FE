import axios, { type InternalAxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api', // 从环境变量获取基础URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 自动注入Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么，比如添加认证token
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    // 请求错误处理
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一处理错误
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    return response;
  },
  (error: AxiosError) => {
    // 对响应错误做点什么
    if (error.response) {
      const { status } = error.response;
      
      switch (status) {
        case 401:
          // 处理未授权错误，可能需要重定向到登录页
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        default:
          console.error(`请求错误: ${status}`);
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('网络错误或服务器无响应');
    } else {
      // 其他错误
      console.error('请求配置错误:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

// 导出所有API模块
export * from './auth.ts';
export * from './user.ts';
export * from './post.ts';
export * from './comment.ts';