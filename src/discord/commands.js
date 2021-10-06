const fs = require("fs");
const path = require("path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const rest = new REST({ version: "9" }).setToken(process.env.DC_TOKEN);

async function register() {
    const commands = getCommands();

    try {
        process.stdout.write("正在註冊機器人指令...");
        await rest.put(Routes.applicationCommands(process.env.APP_ID), { body: commands });
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write("機器人指令註冊完成！\n");
    } catch (err) {
        console.error("❌ 機器人指令註冊失敗", err);
    }

    return commands;
}

function getCommands() {
    const commands = [];
    const filenames = fs.readdirSync(path.join(__dirname, "./commands")).filter((file) => file.endsWith(".js"));

    for (const file of filenames) {
        process.stdout.write(`>> 載入指令 ${file}`);
        const filepath = `./commands/${file}`;
        delete require.cache[require.resolve(filepath)];
        const command = require(filepath);
        commands.push(command.data.toJSON());
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
    }

    return commands;
}

module.exports = register;
