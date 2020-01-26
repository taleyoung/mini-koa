const http = require("http");
const EventEmitter = require("events");
let context = require("./context");
let request = require("./request");
let response = require("./response");

class Applicatoin extends EventEmitter {
  constructor() {
    this.callbackFunc;
  }
  createContext(req, res) {
    let ctx = Object.create(this.context);
    ctx.request = Object.create(this.request);
    ctx.response = Object.create(this.response);
    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;
    return ctx;
  }
  listen(port) {
    let server = http.createServer(this.callback());
    server.listen(port);
  }
  use(fn) {
    this.callbackFunc = fn;
  }
  callback() {
    return (req, res) => {
      let ctx = this.createContext(req, res);
      let respond = () => this.responseBody(ctx);
      let onerror = err => this.onerror(err, ctx);
      let fn = this.compose();
      return fn();
    };
  }
  compose() {
    return async ctx => {
      function createNext(middleware, oldNext) {
        return async () => {
          await middleware(ctx, oldNext);
        };
      }
      let len = this.middleware.length;
      let next = async () => {
        return Promise.resolve();
      };
      for (let i = len - 1; i >= 0; i--) {
        let currentMiddleware = this.middleware[i];
        next = createNext(currentMiddleware, next);
      }
      await next();
    };
  }
}

module.exports = Applicatoin;
