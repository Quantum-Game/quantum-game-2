/* eslint-disable @typescript-eslint/no-var-requires */
const LCL = require('last-commit-log')
const path = require('path')

try {
  const lcl = new LCL()
  const commit = lcl.getLastCommitSync()
  process.env.VUE_APP_GIT_HASH = commit.hash
  process.env.VUE_APP_GIT_DATE = commit.committer.date
} catch (_) {
  process.env.VUE_APP_GIT_DATE = Date.now()
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
process.env.VUE_APP_VERSION = require('./package.json').version

// eslint-disable-next-line @typescript-eslint/no-var-requires
const socialMediaDesc = require('./src/assets/data/social-media-desc.json')
process.env.VUE_APP_TITLE = socialMediaDesc.title
process.env.VUE_APP_DESCRIPTION = socialMediaDesc.description
process.env.VUE_APP_MAIN_URL = socialMediaDesc.url
process.env.VUE_APP_IMG_ALT_TEXT = socialMediaDesc.imgAltText
process.env.VUE_APP_TWITTER = socialMediaDesc.twitter
process.env.VUE_APP_AUTHORS = socialMediaDesc.authors

module.exports = {
  chainWebpack: (config) => {
    // make sure babel-loader is not confused when using "yarn link"
    config.resolve.symlinks(false)

    // Force all instances of vue to be resolved as single module.
    // Multiple instances can be present when using "yarn link".
    config.resolve.alias.set('vue', path.dirname(require.resolve('vue')))

    const vueRule = config.module.rule('vue')
    const svgRule = config.module.rule('svg')

    const prevConfig = svgRule.toConfig()
    svgRule.uses.clear()

    svgRule
      .oneOf('inline')
      .resourceQuery(/\?inline/)
      .merge(vueRule.toConfig())
      .test(undefined)
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .end()
      .end()
      .oneOf('external')
      .merge(prevConfig)
      .test(undefined)
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/assets/styles/global.scss";`,
      },
    },
  },
}
