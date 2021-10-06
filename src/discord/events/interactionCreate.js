const fs = require("fs");
const path = require("path");

const commands = new Map();

fs.readdirSync(path.join(__dirname, "../commands"))
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => {
        process.stdout.write(`建立指令目錄 ${file}`);
        try {
            const command = require(`../commands/${file}`);
            commands.set(command.data.name.trim().toLowerCase(), command);
        } catch (err) {
            console.error(err.message);
        }
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
    });

module.exports = async (Args, interaction) => {
    if (!interaction.isCommand()) return;

    try {
        const commandName = interaction.commandName.trim().toLowerCase();
        console.log(
            `Processing /${commandName} ${interaction.options._subcommand || ""} ${interaction.options._hoistedOptions
                .map((opt) => opt.name + "=" + opt.value)
                .join(" ")} (${interaction.user.username}#${interaction.user.discriminator} @ ${interaction.guild.name})`,
        );
        if (commands.has(commandName)) await commands.get(commandName).run({ ...Args, interaction });
        else await interaction.reply("未知的指令");
    } catch (err) {
        console.error(interaction.commandName, err);
    }
};
