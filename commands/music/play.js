const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { QueryType } = require("discord-player");

const data = new SlashCommandSubcommandBuilder()
    .setName("play")
    .setDescription("播放歌曲")
    .addStringOption((option) => option.setName("url").setDescription("輸入 URL 或查詢文字").setRequired(true));

async function run({ player, interaction }) {
    await interaction.deferReply();
    const res = await player.search(interaction.options.getString("url"), { requestedBy: interaction.member, searchEngine: QueryType.AUTO });
    if (!res || !res.tracks.length) return await interaction.editReply(`❌ ${interaction.user} 無相符之查詢結果`);

    const queue = await player.createQueue(interaction.guildId, { metadata: interaction.channel });
    try {
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);
    } catch {
        await player.deleteQueue(interaction.guildId);
        return await interaction.editReply(`❌ ${interaction.user} 我加不進語音頻道 QQ`);
    }

    await Promise.all([
        await interaction.editReply(`🎧 正在載入${res.playlist ? "播放列表" : "歌曲"}...`),
        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]),
    ]);

    if (!queue.playing) await queue.play();
}

module.exports = { data, run };
