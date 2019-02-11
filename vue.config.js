// 设置这个的作用是打包出来的css,js资源路径不对
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './' : '/'
}
