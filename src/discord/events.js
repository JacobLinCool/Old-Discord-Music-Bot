const fs = require("fs");
const path = require("path");

function register(client, Args) {
    const filenames = fs.readdirSync(path.join(__dirname, "./events")).filter((file) => file.endsWith(".js"));

    for (const file of filenames) {
        const name = file.split(".")[0];
        const filepath = `./events/${file}`;
        try {
            process.stdout.write(`>> 載入 ${name} 事件處理器`);
            delete require.cache[require.resolve(filepath)];
            const handler = require(filepath);
            client.on(name, async (...args) => {
                try {
                    await handler(Args, ...args);
                } catch (err) {
                    console.error(`[${name}] 事件處理器發生錯誤`, err);
                }
            });
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
        } catch (err) {
            console.error(`❌ 事件 ${name} 處理器載入失敗`, err);
        }
    }

    process.stdout.write("事件處理器載入完成！\n");
}

module.exports = register;
