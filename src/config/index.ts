const config = {
  apiBaseUrl: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3008/api'  // 开发环境 API 地址
    : '/api',                      // 生产环境 API 地址
};

export default config; 