
import { Controller, Router } from '../../lib'
import { User } from "../entity/User";

@Controller("/user")
class TestController {

    @Router.get('/')
    async index (ctx) {
        const users = await User.find()

        ctx.body = users
    }

    @Router.post('/')
    async allUser (ctx) {
        const user = new User()
        const { firstName, lastName, age } = ctx.request.fields

        user.firstName = firstName
        user.lastName = lastName
        user.age = age
        await user.save()

        ctx.body = user
    }

    @Router.put('/:id')
    async postOne (ctx) {
        const {id} = ctx.params
        const {lastName} = ctx.request.fields
        const user = await User.findOne(id)
        user.lastName = lastName
        await user.save()

        ctx.body = user
    }
}