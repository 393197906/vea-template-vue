const path = require("path")
module.exports = {
    publicPath: "/back/",
    alias: {
        "@": path.resolve(__dirname, "./src/")
    },
    externals: {
        'AMap': 'AMap',
        'AMapUI': 'AMapUI',
        'dat': 'dat'
    },
    deployGitPath: "git@gitee.com:sdyituo/youxian_front.git",
    env: {
        dev: {
            defined: {
                _BASE_URL_FOR_LOGIN_: 'http://devcloud.91youxian.net/v1',
                _BASE_URL_FOR_DEFAULT_: 'http://devyouxian.91youxian.com/v2',
                _BASE_URL_FOR_STOCK_: 'http://devstock.91youxian.com',
                _BASE_URL_FOR_SHOP_: 'http://devcloud.91youxian.net/v2',
                _BASE_URL_FOR_FINANCE_: 'http://devcapital.91youxian.com/v2',
                _WEBSOCKET_URL_: 'wss://devyouxian.91youxian.com:9502',
            }
        },
        beta: {
            defined: {
                _BASE_URL_FOR_LOGIN_: 'http://betacloud.91youxian.net/v1',
                _BASE_URL_FOR_DEFAULT_: 'http://betayouxian.91youxian.com/v2',
                _BASE_URL_FOR_STOCK_: 'http://betastock.91youxian.com',
                _BASE_URL_FOR_SHOP_: 'http://betacloud.91youxian.net/v2',
                _BASE_URL_FOR_FINANCE_: 'http://betacapital.91youxian.com/v2',
                _WEBSOCKET_URL_: 'wss://devyouxian.91youxian.com:9502',
            }
        },
        master: {
            defined: {
                _BASE_URL_FOR_LOGIN_: 'https://cloudhttps.91youxian.net/v1',
                _BASE_URL_FOR_DEFAULT_: 'https://www.91youxian.com/v2',
                _BASE_URL_FOR_STOCK_: 'https://stock.91youxian.com',
                _BASE_URL_FOR_SHOP_: 'https://cloudhttps.91youxian.net/v2',
                _BASE_URL_FOR_FINANCE_: 'https://zijin.91youxian.net/v2',
                _WEBSOCKET_URL_: 'wss://www.91youxian.com:9502',
            }
        }
    }

};
