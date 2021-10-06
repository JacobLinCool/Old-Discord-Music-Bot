const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const Client = require("@replit/database");

const client = new Client();

const data = new SlashCommandSubcommandBuilder().setName("all").setDescription("列出所有列表");

async function run({ interaction }) {
    await interaction.deferReply();

    const result = await client.list(`${interaction.guildId}`);

    if (result.length === 0) return await interaction.editReply("未有任何列表");

    let response = `共有 **${result.length}** 個列表\n`;
    for (let i = 0; i < result.length; i++) response += `**${i + 1}.** ${result[i].split("-").slice(1).join("-")}\n`;

    await interaction.editReply(response);
}

module.exports = { data, run };
