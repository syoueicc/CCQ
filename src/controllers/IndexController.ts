import { Controller, Router } from '../../lib'
@Controller("/")
class IndexController {

    @Router.get('/')
    index(ctx, next) {
        ctx.body = "hello wrold"
    }

    @Router.get('/say')
    say(ctx, next) {
        ctx.body = "say hellowwwwwww!"
    }
}

@Controller("/test")
class TestController {

    @Router.get('/')
    index (ctx) {
        ctx.body = 'test index'
    }

    @Router.get('/qqq')
    qqq (ctx) {
        ctx.body = 'qqqq'
    }
}