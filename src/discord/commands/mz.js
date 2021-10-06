const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandBuilder().setName("mz").setDescription("音樂系統主指令");

const subcommands = {};

fs.readdirSync(path.join(__dirname, "/music"))
    .filter((f) => f.endsWith(".js") && f !== "index.js")
    .forEach((fp) => {
        process.stdout.write(`>>>> 載入子指令 mz ${fp}`);
        const sub = require(`./music/${fp}`);
        data.addSubcommand(() => sub.data);
        subcommands[sub.data.name] = sub;
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
    });

async function run({ interaction, ...Args }) {
    const subname = interaction.options.getSubcommand();
    if (!subname) return await interaction.reply("請輸入子指令");
    try {
        await subcommands[subname].run({ interaction, ...Args });
    } catch (err) {
        console.error(err);
        await interaction.reply("子指令錯誤").catch(() => interaction.followUp("子指令錯誤"));
    }
}

module.exports = { data, run };
