const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

async function registerCommands(config) {
    const commands = [];
    const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: "9" }).setToken(config.token);

    try {
        await rest.put(Routes.applicationCommands(config.id), { body: commands });
        console.log("成功註冊指令");
    } catch (error) {
        console.error(error);
    }
}

exports.registerCommands = registerCommands;
