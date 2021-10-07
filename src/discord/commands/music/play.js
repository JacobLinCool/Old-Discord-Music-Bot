const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { QueryType } = require("discord-player");

const data = new SlashCommandSubcommandBuilder()
    .setName("play")
    .setDescription("播放歌曲")
    .addStringOption((option) => option.setName("url").setDescription("輸入 URL 或查詢文字").setRequired(true));

async function run({ game, player, interaction }) {
    await interaction.deferReply();

    if (game[interaction.guildId]) return await interaction.editReply(`❌ ${interaction.user} 遊戲進行中，此操作已禁止`);

    const query = interaction.options.getString("url");
    console.time(">> Youtube Search - " + query);
    const res = await player.search(query, { requestedBy: interaction.member, searchEngine: QueryType.AUTO });
    console.timeEnd(">> Youtube Search - " + query);
    if (!res || !res.tracks.length) return await interaction.editReply(`❌ ${interaction.user} 無相符之查詢結果`);

    const queue = await player.createQueue(interaction.guildId, { metadata: interaction.channel });
    try {
        if (!queue.connection) {
            if (!interaction.member.voice.channel) return await interaction.editReply({ content: `❌ ${interaction.user} 請先加入語音頻道`, ephemeral: true });
            await queue.connect(interaction.member.voice.channel);
        }
    } catch {
        await player.deleteQueue(interaction.guildId);
        return await interaction.editReply({ content: `❌ ${interaction.user} 我加不進語音頻道 QQ`, ephemeral: true });
    }

    await Promise.all([
        await interaction.editReply(`🎧 正在載入${res.playlist ? "播放列表" : "歌曲"}...`),
        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]),
    ]);

    if (res.playlist) await interaction.editReply("✅ 播放列表已加入儲列");
    else await interaction.editReply(`✅ ${res.tracks[0]} 已加入儲列`);

    if (!queue.playing) await queue.play();
}

module.exports = { data, run };
