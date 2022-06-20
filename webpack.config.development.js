const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src',
  mode: 'development',
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
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.ejs',
    }),
  ],
  devServer: {
    port: 9000,
  },
}
