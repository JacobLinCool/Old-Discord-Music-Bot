const koa = require("koa");
const si = require("systeminformation");

let CL, MEM;

setInterval(async () => {
    CL = await si.currentLoad();
    MEM = await si.mem();
}, 2000);

const app = new koa();
app.use(async (ctx, next) => {
    ctx.body = "系統 CPU 負載: " + JSON.stringify(fixed(CL), null, 2) + "\n";
    ctx.body += "---\n";
    ctx.body += "系統 MEM 狀態: " + JSON.stringify(fixed(MEM, 0), null, 2) + "\n";
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
