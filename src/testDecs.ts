
const prefix = Symbol('routerPrefix')
const routeMap = []
const testd = path => target => {
    console.log("class ====");
    target.prototype[prefix] = path
}
const get = (path, options) => (target, key, descriptor) => {
    routeMap.push({
        target,
        method: options.method,
        path: path,
        cb: target[key]
    });
}


@testd("/pathstring")
class TestClass {
    pathString: string = "Test Class String"

    @get("/path", {method: 'get'})
    hello () {
        console.log(this.pathString)
        console.log("123")
    }
}   

// for( let { target, cb } of (<any>Object).values(routeMap) ) {
//     const a = new target()
//     console.log(target[prefix], "===") 
//     cb()
// }

routeMap.map(item => {
    console.log(item.target);
    const a = new item.target()
    a.cb()
    console.log(a[prefix]);
})

