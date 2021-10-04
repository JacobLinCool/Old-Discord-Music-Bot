const config = require("dotenv").config().parsed || {};
const osu = require("os-utils");
const { run } = require("./src/main");

process.env.TZ = "Asia/Taipei";

if (!config.id) config.id = process.env.id;
if (!config.token) config.token = process.env.token;
if (!config.playing) config.playing = process.env.playing;
const { start } = run(config);

const server = require("./server");

server.use(async (ctx, next) => {
    ctx.body = "伺服器啟動時間：" + start + "\n";
    const cpu = (100 * await new Promise(r => osu.cpuUsage(r))).toFixed(1);
    const mem = (100 * osu.freemem() / osu.totalmem()).toFixed(1);
    ctx.body += `CPU: ${cpu}% \nMEM: ${mem}% (${(osu.totalmem() - osu.freemem()).toFixed(1)} M)\n`;
    await next();
})