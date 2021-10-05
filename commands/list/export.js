const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const Client = require("@replit/database");
const ENV = require("dotenv").config().parsed || {};

const client = new Client(ENV.REPLIT_DB_URL || process.env.REPLIT_DB_URL);

const data = new SlashCommandSubcommandBuilder()
    .setName("export")
    .setDescription("匯出列表")
    .addStringOption((option) => option.setName("名稱").setDescription("列表名稱").setRequired(true));

async function run({ interaction }) {
    await interaction.deferReply();

    const name = interaction.options.getString("名稱").trim();
    if (name.length < 2 || name.length > 30) return await interaction.editReply("列表名稱長度需在 2 ~ 30 字元之間");

    const list = await client.get(`${interaction.guildId}-${name}`);
    if (!list) return await interaction.editReply("此列表並不存在");

    let response = `匯出列表「**${list.name}**」\n`;
    response += `\`\`\`json\n${JSON.stringify(list, null, 2)}\n\`\`\``;

    await interaction.editReply(response);
}

module.exports = { data, run };
