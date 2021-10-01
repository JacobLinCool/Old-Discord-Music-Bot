const koa = require("koa");

const Start_Time = new Date();

const app = new koa();

app.use(async (ctx) => {
    ctx.body = "Server Start At " + Start_Time;
});

app.listen(80);

module.exports = app;
