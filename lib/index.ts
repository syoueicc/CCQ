import 'reflect-metadata'
import * as Koa from 'koa'
import * as KoaRouter from 'koa-router'
import * as glob from 'glob'
import {resolve} from 'path'

const routerPrefix = Symbol('routerPrefix')
const routeMap = []

export default class Ccq extends Koa {

    router: KoaRouter

    constructor () {
        super()
        this.router = new KoaRouter()
        this._init()
    }

    _init() {
        let controllerPath = `${resolve(process.cwd(), 'src/controllers/**/*')}`
        glob.sync(controllerPath).forEach(require)
        for( let { target, method, path, cb } of (<any>Object).values(routeMap) ) {

            this.router[method](parseControllerPath(target[routerPrefix]) + normalizePath(path), ...cb)
        }
        this.use(this.router.routes())
        this.use(this.router.allowedMethods())
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
