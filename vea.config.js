const path = require('path')
module.exports = {
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
        CLOUD_URL: 'http://devcloud.91youxian.net'
      }
    },
    beta: {
      defined: {
        CLOUD_URL: 'http://betacloud.91youxian.net'
      }
    },
    master: {
      defined: {
        CLOUD_URL: 'https://cloudhttps.91youxian.net'
      }
    }
  }
}
