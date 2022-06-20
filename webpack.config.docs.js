const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: './src',
  output: {
    path: path.resolve(__dirname, 'docs'),
    publicPath: '',
  },
  target: 'web',
  mode: 'production',
  devtool: 'source-map',
  stats: 'errors-only',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.ejs',
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(vert|frag)$/,
        type: 'asset/source',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules'),
    ],
  },
}
