const koa = require("koa");

const Start_Time = new Date();

const app = new koa();

app.use(async (ctx, next) => {
    ctx.body = "Server Start At " + Start_Time;
    await next();
});

app.listen(80);

module.exports = app;
