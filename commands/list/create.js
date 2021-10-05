const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { QueryType } = require("discord-player");
const Client = require("@replit/database");
const ENV = require("dotenv").config().parsed || {};

const client = new Client(process.env.REPLIT_DB_URL || ENV.REPLIT_DB_URL);

const data = new SlashCommandSubcommandBuilder()
    .setName("create")
    .setDescription("製作新列表")
    .addStringOption((option) => option.setName("名稱").setDescription("列表名稱").setRequired(true))
    .addStringOption((option) => option.setName("youtube_id").setDescription("Youtube ID 或網址，以「,」分割").setRequired(false));

async function run({ player, interaction }) {
    await interaction.deferReply();

    const name = interaction.options.getString("名稱").trim();
    if (name.length < 2 || name.length > 30) return await interaction.editReply("列表名稱長度需在 2 ~ 30 字元之間");
    if (await client.get(`${interaction.guildId}-${name}`)) return await interaction.editReply("此列表名稱已存在");

    const raw = interaction.options
        .getString("youtube_id")
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

    const list = {
        name,
        list: [...new Set(id.filter((x) => x.length === 11))],
    };

    await client.set(`${interaction.guildId}-${name}`, list);
    await interaction.editReply(`已建立列表「${name}」`);
}

module.exports = { data, run };
