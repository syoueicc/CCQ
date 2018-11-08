import { Controller, Router, Middleware } from '../../lib'
@Controller("/")
class IndexController {

    @Router.get('/')
    @Middleware.middleware('IndexController')
    index(ctx, next) {
        ctx.body = "hello wrold"
    }
}
