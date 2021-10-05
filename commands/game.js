const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");

const data = new SlashCommandBuilder().setName("game").setDescription("遊戲系統主指令");

const subcommands = {};

fs.readdirSync(__dirname + "/game")
    .filter((f) => f.endsWith(".js") && f !== "index.js")
    .forEach((fp) => {
        console.log(`註冊子指令 game ${fp}`);
        const sub = require(`./game/${fp}`);
        data.addSubcommand(() => sub.data);
        subcommands[sub.data.name] = sub;
    });

async function run({ game, config, client, player, interaction }) {
    const subname = interaction.options.getSubcommand();
    if (!subname) return await interaction.reply("請輸入子指令");
    try {
        await subcommands[subname].run({ game, config, client, player, interaction });
    } catch (err) {
        console.error(err);
        await interaction.reply("子指令錯誤");
    }
}

module.exports = { data, run };
