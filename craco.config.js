const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    configure: (webpackConfig) => {
      // 忽略所有 @antv 相关包的源码映射警告
      webpackConfig.ignoreWarnings = [
        {
          module: /@antv/,
          message: /Failed to parse source map/,
        },
        {
          module: /node_modules/,
          message: /Failed to parse source map/,
        }
      ];
      return webpackConfig;
    },
  },
  devServer: {
    port: 3001,
    client: {
      overlay: {
        warnings: false,
        errors: true
      }
    }
  },
}; 