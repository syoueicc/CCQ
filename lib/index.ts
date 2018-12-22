import 'reflect-metadata'
import * as Koa from 'koa'
import * as KoaRouter from 'koa-router'
import * as convert from 'koa-convert'
import * as glob from 'glob'
import { resolve, parse } from 'path'
import { createConnection } from "typeorm";

(async () => {
    await createConnection()
})()

interface middlewars {
    [key: string]: any
}

const routerPrefix = Symbol('routerPrefix')
const routeMap = []
export const Middleware: middlewars = {}
export default class Ccq extends Koa {

    router: KoaRouter

    constructor () {
        super()
        this.router = new KoaRouter()
        this._init()
    }

    _init() {
        this.registerGlobalMiddlewares()
        this.registerMiddlewares()
        this.registerRouters()
    }

    /**
     * 遍历添加controller、路由
     */
    registerRouters() {
        const controllerPath = resolve(process.cwd(), 'src/controllers/**/*')
        glob.sync(controllerPath).forEach(require)
        for( let { target, method, path, cb } of (<any>Object).values(routeMap) ) {
            this.router[method](parseControllerPath(target[routerPrefix]) + normalizePath(path), ...cb)
        }
        this.use(this.router.routes())
        this.use(this.router.allowedMethods())
    }

    /**
     * 添加中间件
     */
    registerMiddlewares() {
        const middlewarePath = resolve(process.cwd(), 'src/middlewares/**/*')
        glob.sync(middlewarePath).forEach(middleware => {
            const fn = require(middleware).default
            const name = parse(middleware).name
            Middleware[name] = params => (target, key) => {
                if (!Array.isArray(target[key])) target[key] = [target[key]]
                target[key].splice(target[key].length - 1, 0, (ctx, next) => { fn(ctx, next, params) })
            }
        })
    }

    registerGlobalMiddlewares() {
        const config = require(resolve(process.cwd(), 'src/config')).default
        config.middlewares.forEach( middleware => this.use(convert(middleware[0](middleware[1]))))
    }
}

const toArr = tar => (tar instanceof Array) ? tar : [tar]
const normalizePath = path => path.startsWith('/') ? path : `/${path}`
const parseControllerPath = path => path === '/' ? '' : normalizePath(path.replace(/^\//, ''))

const methodFactor = (path, options) => (target, key, descriptor) => {
    routeMap.push({
        target,
        method: options.method,
        path: path,
        cb: toArr(target[key])
    });
}

export const Router = Object.assign(
    {},
    ...([
        'get',
        'put',
        'post',
        'patch',
        'delete',
        'del',
        'all',
    ].map(method => ({ [method]: (path, options) => methodFactor(path, { ...options, method: method }) }))))
    
    
export const Controller = path => target => void( target.prototype[routerPrefix] = path )
