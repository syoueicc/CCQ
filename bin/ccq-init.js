#!/usr/bin/env node

const program = require('commander')
const Metalsmith = require('metalsmith')
const { template } = require('lodash')
const inquirer = require('inquirer')
const {
  execSync
} = require('child_process')
const {
  mkdir,
  cp,
  cd,
  pushd,
  exec,
} = require('shelljs')
const {
  statSync,
} = require('fs')
const chalk = require('chalk')
const {
  resolve,
} = require('path')

program.usage('<project-name>')
  .parse(process.argv)


const projectName = program.args[0]

if (projectName) {

  if (isDirectory(projectName)) {
    console.log(chalk.red(`${projectName} already exists!`))
  }else {
    let user = execSync( 'git config --global user.name', {
      encoding: 'utf-8'
    } );
    let email = execSync( 'git config --global user.email', {
      encoding: 'utf-8'
    } );
    user = user.trim()
    email = email.trim()

    inquirer
      .prompt([
        {
          name: 'name',
          type: 'input',
          message: "what's project name",
          default: projectName
        },
        {
          name: 'description',
          type: 'input',
          message: 'description',
          default: 'CCQ PROJECT'
        },
        {
          name: 'author',
          type: 'input',
          message: "author",
          default: email
        },
        {
          name: 'license',
          type: 'list',
          message: "license",
          choices: ['MIT', 'ISC']
        },
      ])
      .then(answers => {

        mkdir('-p', resolve(process.cwd(), `./${projectName}`))
        const source = "../template"
        const dest = resolve(process.cwd(), `./${projectName}`)

        Metalsmith(__dirname)
          .source(source)
          .destination(dest)
          .metadata(answers)
          .use((files, metalsmith, done) => {
            const keys = Object.keys(files)
            const metalsmithData = metalsmith.metadata()
            while(file = keys.pop()) {
              const contents = files[file].contents.toString()
              if(/<%=\S+%>/g.test(contents)) {
                const compiled = template(contents)
                files[file].contents = new Buffer.from(compiled(metalsmithData))
              }
            }
            done()
          })
          .build((err, files) => {
            if (err) throw err
            console.log()
            console.log(chalk.bold.green('   done.'))
            console.log()
            console.log(chalk.white('   change directory:'))
            console.log()
            console.log(chalk.yellow(`   cd ${projectName}`))
            console.log()
            console.log(chalk.white('   install dependencies:'))
            console.log()
            console.log(chalk.yellow('   npm install'))
            console.log()
          })
      })
  }

  return
}

program.help()

function isDirectory(path) {
  try {
    const stat = statSync(path)
    return stat.isDirectory()
  } catch (error) {
    return false
  }
}