#!/usr/bin/env node

const program = require('commander')
const {
  version
} = require('../package.json')

program.version(version, '-v, --version')
  .usage('<command> [项目名称]')
  .command('init', 'init new project')
  .parse(process.argv)