const title = 'Vodafone Germany Invoice Verification'

module.exports = {
  chainWebpack: config => {
    config
        .plugin('html')
        .tap(args => {
          args[0].title = title
          return args
        })
  },
  pluginOptions: {
    i18n: {
      locale: 'de',
      fallbackLocale: 'de',
      localeDir: 'locales',
      enableInSFC: true
    },
    moment: {
      locales: [
        'gb',
        'de'
      ]
    }
  },
  devServer: {
    host: 'localhost'
  }
}
