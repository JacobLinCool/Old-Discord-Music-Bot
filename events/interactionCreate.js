const fs = require("fs");

const commands = new Map();

fs.readdirSync("./commands")
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => {
        try {
            console.log(`註冊指令 ${file}`);
            const command = require(`../commands/${file}`);
            commands.set(command.data.name.trim().toLowerCase(), command);
        } catch (err) {
            console.error(err.message);
        }
    });

module.exports = async ({ game, config, client, player }, interaction) => {
    if (!interaction.isCommand()) return;

    try {
        console.log(`Processing /${interaction.commandName.trim().toLowerCase()}`);
        if (commands.has(interaction.commandName.trim().toLowerCase())) {
            const command = commands.get(interaction.commandName.trim().toLowerCase());
            await command.run({ game, config, client, player, interaction });
        } else {
            if (interaction) await interaction.reply("未知的指令");
        }
    } catch (err) {
        console.error(interaction.commandName, err);
    }
};
