async function run() {
    process.stdout.write("程式開始執行\n");
    require("./initialize")();

    const dc = require("./discord");
    const start_time = await dc.setup();

    const web = require("./web");
    web.use(async (ctx, next) => {
        ctx.body += `伺服器啟動時間: ${start_time}\n`;
        next();
    });
}

exports.run = run;
