const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");

const data = new SlashCommandBuilder().setName("ls").setDescription("列表系統主指令");

const subcommands = {};

fs.readdirSync(__dirname + "/list")
    .filter((f) => f.endsWith(".js") && f !== "index.js")
    .forEach((fp) => {
        console.log(`註冊子指令 list ${fp}`);
        const sub = require(`./list/${fp}`);
        data.addSubcommand(() => sub.data);
        subcommands[sub.data.name] = sub;
    });

async function run({ config, client, player, interaction }) {
    const subname = interaction.options.getSubcommand();
    if (!subname) return await interaction.reply("請輸入子指令");
    try {
        await subcommands[subname].run({ config, client, player, interaction });
    } catch {
        await interaction.reply("子指令錯誤");
    }
}

module.exports = { data, run };
