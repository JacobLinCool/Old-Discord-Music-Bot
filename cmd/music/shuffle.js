module.exports = {
    cmd: "shuffle",
    aka: ["sh"],
    help: "隨機排序儲列中的歌曲",
    voice: true,

    async execute({ player, msg }) {
        const queue = player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) return interaction.reply(`❌ ${interaction.user} 目前沒有正在播放的歌曲喔`);
        if (!queue.tracks[0]) return interaction.reply(`❌ ${interaction.user} 播完現在這首儲列中就沒歌曲了喔`);

        await queue.shuffle();

        return interaction.reply(`✅ 已隨機排序儲列中 **${queue.tracks.length}** 首歌！`);
    },
};
