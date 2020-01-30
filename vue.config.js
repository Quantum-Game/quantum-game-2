// eslint-disable-next-line @typescript-eslint/no-var-requires
const LCL = require('last-commit-log')

const lcl = new LCL()
const commit = lcl.getLastCommitSync()
process.env.VUE_APP_GIT_HASH = commit.hash
process.env.VUE_APP_GIT_TAG = commit.gitTag
process.env.VUE_APP_GIT_DATE = commit.committer.date

process.env.VUE_APP_VERSION = require('./package.json').version
