import * as body from 'koa-better-body'
import { resolve } from 'path'

const basePath = resolve(__dirname, '../')
export default {

  middlewares: [
    [body],
  ],

  database: {
    type: 'sqlite',
    name: 'default',
    database: `${basePath}/database.db`,
    synchronize: true,
    "entities": [
      `${basePath}/entity/**/*.ts`
    ],
    cli: {
      entitiesDir: `${basePath}/entity`,
      migrationsDir: `${basePath}/migration`
    }
  }
}