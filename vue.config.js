function mock (app, url, data) {
  app.get(url, (request, response) => {
    response.json(data)
  })
}

// 设置这个的作用是打包出来的css,js资源路径不对
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './' : './',
//  模拟请求
  devServer: {
    before (app) {
      mock(app, '/book/home', require('./src/mock/bookHome'))
      mock(app, '/book/shelf', require('./src/mock/bookShelf'))
      mock(app, '/book/list', require('./src/mock/bookList'))
      mock(app, '/book/flat-list', require('./src/mock/bookFlatList'))
    }
  },
  configureWebpack: {
    performance: {
      hints: 'warning',
      maxAssetSize: 512 * 1024,
      maxEntrypointSize: 512 * 1024
    }
  }
}
