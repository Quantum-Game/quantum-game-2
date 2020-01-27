const {gitDescribe, gitDescribeSync} = require('git-describe');

process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_GIT_HASH = gitDescribeSync().hash
