const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");

const data = new SlashCommandBuilder().setName("mz").setDescription("音樂系統主指令");

const subcommands = {};

fs.readdirSync(__dirname + "/music")
    .filter((f) => f.endsWith(".js") && f !== "index.js")
    .forEach((fp) => {
        console.log(`註冊子指令 mz ${fp}`);
        const sub = require(`./music/${fp}`);
        data.addSubcommand(() => sub.data);
        subcommands[sub.data.name] = sub;
    });

async function run({ config, client, player, interaction }) {
    const subname = interaction.options.getSubcommand();
    if (!subname) {
        interaction.reply("請輸入子指令");
        return;
    }
    try {
        subcommands[subname].run({ config, client, player, interaction });
    } catch {
        interaction.reply("子指令錯誤");
    }
}

module.exports = { data, run };
