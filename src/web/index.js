const koa = require("koa");
const si = require("systeminformation");

let CL;

setInterval(async () => {
    CL = await si.currentLoad();
}, 2000);

const app = new koa();
app.use(async (ctx, next) => {
    ctx.body = "系統負載: " + JSON.stringify(fixed(CL), null, 2) + "\n";
    ctx.body += "---\n";
    ctx.body += "現在時間: " + new Date() + "\n";
    ctx.type = "text/plain";
    await next();
});
app.listen(80);

function fixed(data, length = 1) {
    if (typeof data === "number") return +data.toFixed(length);
    if (typeof data !== "object") return data;
    if (data instanceof Array) return data.map((item) => fixed(item, length));
    for (const key in data) data[key] = fixed(data[key], length);
    return data;
}

module.exports = app;
