module.exports = {
    cmd: "clear",
    aka: ["cls"],
    help: "清空歌曲儲列",
    voice: true,

    async execute({ player, msg }) {
        const queue = player.getQueue(msg.guild.id);

        if (!queue || !queue.playing) return msg.channel.send(`❌ ${msg.author} 目前沒有正在播放的歌曲喔`);
        if (!queue.tracks[0]) return msg.channel.send(`❌ ${msg.author} 播完現在這首儲列中就沒歌曲了喔`);

        await queue.clear();

        msg.channel.send(`🗑️ 已清空儲列`);
    },
};
