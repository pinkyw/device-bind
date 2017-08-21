var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
	entry:  __dirname + "/src/js/biz/main.js",
	output: {
	path: __dirname,
	filename: "/static/devbind/js/np.min.js"
	},
	devtool: 'eval',
	module: {
		loaders: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loaders: ['babel-loader'],
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('style', 'css!sass')
			},
			{
	　　　　　　test: /\.(png|jpg)$/,
	　　　　　　loader: 'url-loader?limit=8192&name=/static/devbind/img/[hash:8].[name].[ext]'
	　　　　}
		],
		postLoaders: [
			{
				test: /\.js$/,
				loaders: ['es3ify-loader']
			}
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			output: {
				comments: false,
			},
			compress: {
				warnings: false
			}
		}),
		new ExtractTextPlugin('/static/devbind/css/np.min.css'),
		new OptimizeCssAssetsPlugin()
	],
	devServer: {
		contentBase: "./",//本地服务器所加载的页面所在的目录
		inline: true,//实时刷新,
		hot: true,
		port: 9093,
		proxy: {
			"/devbindsrv": {
			target: "http://easy-mock.com/mock/599a3b79059b9c566dc8e7f8/",
			secure: false,
			changeOrigin: true
		}
	}
  }
};
