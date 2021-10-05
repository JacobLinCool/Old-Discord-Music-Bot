const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const Client = require("@replit/database");
const ENV = require("dotenv").config().parsed || {};

const client = new Client(process.env.REPLIT_DB_URL || ENV.REPLIT_DB_URL);

const data = new SlashCommandSubcommandBuilder()
    .setName("read")
    .setDescription("顯示已存在列表中項目")
    .addStringOption((option) => option.setName("名稱").setDescription("列表名稱").setRequired(true));

async function run({ interaction }) {
    await interaction.deferReply();

    const name = interaction.options.getString("名稱").trim();
    if (name.length < 2 || name.length > 30) return await interaction.editReply("列表名稱長度需在 2 ~ 30 字元之間");

    const list = await client.get(`${interaction.guildId}-${name}`);
    if (!list) return await interaction.editReply("此列表並不存在");

    let response = `列表「**${list.name}**」的項目：\n`;
    for (let i = 0; i < list.list.length; i++) response += `**${i + 1}.** https://www.youtube.com/watch?v=${list.list[i]}\n`;

    await interaction.editReply(response);
}

module.exports = { data, run };
