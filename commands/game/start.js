const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const Client = require("@replit/database");
const { QueryType } = require("discord-player");
const GM = require("../../src/game");
const ENV = require("dotenv").config().parsed || {};

const client = new Client(process.env.REPLIT_DB_URL || ENV.REPLIT_DB_URL);

const data = new SlashCommandSubcommandBuilder()
    .setName("start")
    .setDescription("開始遊戲")
    .addStringOption((option) => option.setName("列表").setDescription("遊戲資料列表").setRequired(true))
    .addStringOption((option) => option.setName("秒數").setDescription("單一歌曲的秒數").setRequired(false));

async function run({ game, player, interaction }) {
    await interaction.deferReply();
    if (game[interaction.guildId]) return await interaction.editReply("已有存在遊戲");

    // 刪除現有播放儲列
    const old_queue = player.getQueue(interaction.guildId);
    if (old_queue) old_queue.destroy();

    const timeout = +interaction.options.getString("秒數") || 60;

    // 建立新的播放儲列
    const name = interaction.options.getString("列表").trim();
    const list = await client.get(`${interaction.guildId}-${name}`);
    if (!list) return await interaction.editReply("此列表並不存在");
    if (!list.list.length) return await interaction.editReply("此列表沒有任何項目");

    await interaction.editReply("稍等一下喔");

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
    for (let i = tracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
    }
    await queue.addTracks(tracks);

    const gm = new GM(queue, interaction.guildId, tracks, game, timeout);
    queue.game = gm;
    game[interaction.guildId] = gm;
    await interaction.editReply(`✅ ${interaction.user} 已經開始遊戲\n使用資料碟：${name}`);
    await gm.start();
}

module.exports = { data, run };
