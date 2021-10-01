const koa = require("koa");
const config = require("dotenv").config().parsed || {};
const { run } = require("./src/main");

const Start_Time = new Date();

let runned = false;
if (!runned) {
    if (!config.id) config.id = process.env.id;
    if (!config.token) config.token = process.env.token;
    if (!config.playing) config.playing = process.env.playing;
    run(config);
    runned = true;
}

const app = new koa();

app.use(async (ctx) => {
    ctx.body = "Server Start At " + Start_Time;
});

module.exports = app;
