import { Controller, Router, Middleware } from '../../lib'

@Controller("/")
class IndexController {

    @Router.get('/')
    @Middleware.middleware('middleware')
    async index(ctx, next) {
        ctx.body = 'hello world'
    }
}
