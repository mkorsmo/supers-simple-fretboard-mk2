module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('tonal')
      .test(/\.mjs$/)
      .include.add(/node_modules[\\/]@tonaljs/)
      .end()
      .type('javascript/auto')
      .end();
  },
};
