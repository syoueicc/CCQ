import chalk from 'chalk'

export default options => async (ctx, next) => {
  console.log(chalk.blue(JSON.stringify(options)))
  console.log(chalk.red(JSON.stringify(options)))
  await next()
}