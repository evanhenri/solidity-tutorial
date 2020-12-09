module.exports = {
  mode: 'development',
  entry: '/app/frontend/client/index.js',
  output: {
    path: '/app/frontend/public',
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: '/app/frontend/public',
    compress: true,
    host: '0.0.0.0',
    port: 9080,
    publicPath: '/'
  }
};
