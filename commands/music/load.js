const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const Client = require("@replit/database");
const { QueryType } = require("discord-player");
const ENV = require("dotenv").config().parsed || {};

const client = new Client(ENV.REPLIT_DB_URL || process.env.REPLIT_DB_URL);

const data = new SlashCommandSubcommandBuilder()
    .setName("load")
    .setDescription("從列表中載入歌曲")
    .addStringOption((option) => option.setName("名稱").setDescription("列表名稱").setRequired(true));

async function run({ player, interaction }) {
    await interaction.deferReply();

    const name = interaction.options.getString("名稱").trim();
    if (name.length < 2 || name.length > 30) return await interaction.editReply("列表名稱長度需在 2 ~ 30 字元之間");

    const list = await client.get(`${interaction.guildId}-${name}`);
    if (!list) return await interaction.editReply("此列表並不存在");
    if (!list.list.length) return await interaction.editReply("此列表沒有任何項目");

    const queue = await player.createQueue(interaction.guildId, { metadata: interaction.channel });
    try {
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);
    } catch {
        await player.deleteQueue(interaction.guildId);
        return await interaction.editReply(`❌ ${interaction.user} 我加不進語音頻道 QQ`);
    }

    const tracks = [];
    for (let i = 0; i < list.list.length; i++) {
        const res = await player.search("https://www.youtube.com/watch?v=" + list.list[i], { requestedBy: interaction.member, searchEngine: QueryType.AUTO });
        if (!res || !res.tracks.length) continue;
        if (res.playlist) tracks.push(...res.tracks);
        else tracks.push(res.tracks[0]);
    }
    await queue.addTracks(tracks);

    if (!queue.playing) await queue.play();

    return await interaction.editReply(`已加入 **${tracks.length}** 個項目`);
}

module.exports = { data, run };
