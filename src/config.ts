// 环境配置
const config = {
    // API 基础地址
    apiBaseUrl: window.location.hostname === 'localhost' 
        ? 'http://localhost:3008/api'  // 开发环境
        : 'https://api.yourproduction.com/api',  // 生产环境

    // 其他配置项
    pageSize: 10,
    maxFileSize: 5 * 1024 * 1024, // 5MB
};

export default config; 