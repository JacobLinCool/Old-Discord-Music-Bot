const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { QueryType } = require("discord-player");
const Client = require("@replit/database");
const ENV = require("dotenv").config().parsed || {};

const client = new Client(ENV.REPLIT_DB_URL || process.env.REPLIT_DB_URL);

const data = new SlashCommandSubcommandBuilder()
    .setName("add")
    .setDescription("在已存在列表中新增項目")
    .addStringOption((option) => option.setName("名稱").setDescription("列表名稱").setRequired(true))
    .addStringOption((option) => option.setName("Youtube ID").setDescription("Youtube ID 或網址，以「,」分割").setRequired(true));

async function run({ player, interaction }) {
    await interaction.deferReply();

    const name = interaction.options.getString("名稱").trim();
    if (name.length < 2 || name.length > 30) return await interaction.editReply("列表名稱長度需在 2 ~ 30 字元之間");

    const list = await client.get(`${interaction.guildId}-${name}`);
    if (!list) return await interaction.editReply("此列表並不存在");

    const raw = interaction.options
        .getString("Youtube ID")
        .split(",")
        .map((x) => x.trim());
    const id = [];

    for (let i = 0; i < raw.length; i++) {
        const res = await player.search(raw[i], { searchEngine: QueryType.AUTO });
        res.tracks.forEach((x) => {
            if (x.url.match(/^https?:\/\/(www\.)?youtube\.com\/watch\?v=([^&]+)/))
                id.push(x.url.match(/^https?:\/\/(www\.)?youtube\.com\/watch\?v=([^&]+)/)[2]);
        });
    }

    const old_length = list.list.length;
    list.list = list.list.concat([...new Set(id.filter((x) => x.length === 11))]);
    const add_length = list.list.length - old_length;

    await client.set(`${interaction.guildId}-${name}`, list);
    await interaction.editReply(`列表「**${name}**」已更新 - 已新增 **${add_length}** 個項目`);
}

module.exports = { data, run };
