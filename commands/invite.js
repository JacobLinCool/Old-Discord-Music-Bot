const { SlashCommandBuilder } = require("@discordjs/builders");

const name = "invite";
const description = "告訴你邀請我的連結";

const data = new SlashCommandBuilder().setName(name).setDescription(description);

async function run({ config, interaction }) {
    await interaction.reply(`https://discord.com/api/oauth2/authorize?client_id=${config.id}&permissions=8&scope=bot%20applications.commands`);
}

module.exports = { data, run };
