const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const Client = require("@replit/database");
const ENV = require("dotenv").config().parsed || {};

const client = new Client(ENV.REPLIT_DB_URL || process.env.REPLIT_DB_URL);

const data = new SlashCommandSubcommandBuilder().setName("remove").setDescription("移除列表中的項目 X");

async function run({ interaction }) {
    await interaction.deferReply();

    const result = await client.list(`${interaction.guildId}`);

    if (result.length === 0) return await interaction.editReply(`未有任何列表`);

    let response = `共有 **${result.length}** 個列表\n`;
    for (let i = 0; i < result.length; i++) response += `**${i + 1}.** ${result[i].name} (${result[i].list.length} 個項目)\n`;

    await interaction.editReply(response);
}

module.exports = { data, run };
