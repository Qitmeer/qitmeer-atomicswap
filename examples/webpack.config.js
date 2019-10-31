const path = require('path'); 
const HtmlWebpackPlugin = require('html-webpack-plugin') // 生成html的插件
// const ExtractTextWebapckPlugin = require('extract-text-webpack-plugin') //CSS文件单独提取出来 
const ExtractTextWebapckPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack');
const  index = 'src'

module.exports = { 
    entry: { 
        index: path.resolve(__dirname, './'+index+'/javascript', 'main.js'),
        // vendor:'lodash' // 多个页面所需的公共库文件，防止重复打包带入 
    }, 
    resolve:{ 
        extensions: [".js",".css",".json"], 
    }, 
    node: {
        fs: 'empty'
    },
    module: { 
        // 多个loader是有顺序要求的，从右往左写，因为转换的时候是从右往左转换的 
        rules:[
            { 
                test: /(\.jsx|\.js)$/, 
                use: { 
                    loader: "babel-loader", 
                    options: { 
                        presets: [ "es2015"],
                        "plugins": [
                            'transform-runtime',
                            "transform-async-to-generator",
                            'transform-decorators-legacy'
                        ],
                        babelrc: false
                    } 
                }, 
                exclude: /node_modules/ 
            }, 
            { 
                test: /\.css$/, 
                use: [
                    {
                        loader: ExtractTextWebapckPlugin.loader,
                        options: {
                            minize: true
                        }
                    },
                    "css-loader",
                    // "css-hot-loader"
                ]
            },
            { 
                //file-loader 解决css等文件中引入图片路径的问题 
                // url-loader 当图片较小的时候会把图片BASE64编码，大于limit参数的时候还是使用file-loader 进行拷贝 
                test: /\.(png|jpg|jpeg|gif|svg)/, 
                use: { 
                    loader: 'url-loader', 
                    options: { 
                        outputPath: '../', 
                        publicPath: __dirname+'/'+index+'/img'
                        // 图片输出的路径 limit: 1 * 1024 
                    } 
                } 
            }
        ] 
    }, 
    plugins: [ 
        // 多入口的html文件用chunks这个参数来区分 
        new HtmlWebpackPlugin({ 
            template: './'+index+'/index.html', 
            filename:'index.html', 
            chunks:['index'], 
            hash:true,
            //防止缓存 
            minify:{ 
                removeAttributeQuotes:true//压缩 去掉引号 
            } 
        }), 
        new ExtractTextWebapckPlugin({
            filename: '[name].css'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
    ], 
    devtool:  'eval-source-map',//'cheap-module-source-map',//
    devServer: { 
        contentBase: "./src/", //静态文件根目录 
        port: 9905, // 端口 
        host: 'localhost', 
        overlay: true, 
        compress: false, // 服务器返回浏览器的时候是否启动gzip压缩 
        historyApiFallback: true,
        // hotOnly:true
        // proxy: {
        //     '/group1/*': {
        //         target: 'http://39.98.207.74:8050',//http://39.98.207.74:8050/group1/M00/00/00/rBpYRlyFu3-AeVw3AAHfICE0VEc114.jpg
        //         //   pathRewrite: {'^/api' : ''},
        //         //   changeOrigin: true,     // target是域名的话，需要这个参数，
        //         secure: false,          // 设置支持https协议的代理
        //     }
        // }
    }, 
    watch: true, // 开启监听文件更改，自动刷新 
    watchOptions: { 
        ignored: /node_modules/, //忽略不用监听变更的目录 
        aggregateTimeout: 500, //防止重复保存频繁重新编译,500毫米内重复保存不打包 
        poll:1000 //每秒询问的文件变更的次数 
    }, 
}

