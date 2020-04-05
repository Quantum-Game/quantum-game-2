// eslint-disable-next-line @typescript-eslint/no-var-requires
const LCL = require('last-commit-log')

const lcl = new LCL()
const commit = lcl.getLastCommitSync()
process.env.VUE_APP_GIT_HASH = commit.hash
process.env.VUE_APP_GIT_TAG = commit.gitTag
process.env.VUE_APP_GIT_DATE = commit.committer.date

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
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "~@/assets/styles/global.scss";`,
      },
    },
  },
}
