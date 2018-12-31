import { Controller, Router, Middleware } from 'ccq-core'

@Controller("/")
class IndexController {

  @Router.get('/')
  @Middleware.testMiddleware('testMiddleware')
  async index(ctx, next) {
    ctx.body = 'hello world'
  }
}
