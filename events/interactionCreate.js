const fs = require("fs");

const commands = new Map();

fs.readdirSync("./commands")
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => {
        try {
            console.log(`註冊指令 ${file}`);
            const command = require(`../commands/${file}`);
            commands.set(command.data.name, command);
        } catch (err) {
            console.error(err.message);
        }
    });

module.exports = async ({ config, client, player }, interaction) => {
    if (!interaction.isCommand()) return;

    try {
        if (commands.has(interaction.commandName)) {
            console.log(`Processing /${interaction.commandName}`);
            const command = commands.get(interaction.commandName);
            await command.run({ config, client, player, interaction });
        } else {
            interaction.reply("未知的指令");
        }
    } catch (err) {
        interaction.reply("發生錯誤");
        console.error(err.message);
    }
};
