const { readdirSync } = require("fs");
const { setup } = require("./setup");
const { registerPlayerEvents } = require("./events");
const { registerCommands } = require("./commands");

function run(cfg) {
    const { config, client, player } = setup(cfg);

    registerEventHandler(config, client, player);
    registerPlayerEvents(player);
    registerCommands(config, client);

    client.login(config.token);

    return {
        start: new Date(),
        client,
        player,
        config,
    };
}

function registerEventHandler(config, client, player) {
    console.log(`正在載入事件處理器...`);

    const events = readdirSync("./events/").filter((file) => file.endsWith(".js"));

    for (const file of events) {
        const name = file.split(".")[0];
        console.log(`>> 載入事件處理器: ${name}`);
        const path = `../events/${file}`;
        try {
            const handler = require(path);
            client.on(name, (...args) => {
                try {
                    handler({ config, client, player }, ...args);
                } catch (err) {}
            });
            delete require.cache[require.resolve(path)];
        } catch (err) {
            console.error(`>> ❌ 事件處理器 ${name} 載入失敗`);
            console.error(err);
        }
    }

    console.log("事件處理器載入完畢");
}

exports.run = run;
