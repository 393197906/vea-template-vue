const path = require('path')
module.exports = {
  plugins: [
    ['vea-plugin-vue-static', {
      routes: ['/', '/test']
    }]
  ],
  alias: {
    '@': path.resolve(__dirname, './src/')
  },
  eslintLoaderOptions: {
    emitError: true,
    eslintPath: require.resolve('eslint'),
    formatter: require.resolve('eslint-friendly-formatter')
  },
  deployGitPath: '',
  env: {
    dev: {
      defined: {
        //  定义环境变量
      }
    }
  }
};
