module.exports = {
    cmd: "pause",
    aka: [],
    help: "暫停播放歌曲",
    voice: true,

    execute({ player, msg }) {
        const queue = player.getQueue(msg.guild.id);

        if (!queue || !queue.playing) return msg.channel.send(`❌ ${msg.author} 目前沒有正在播放的歌曲喔`);

        const success = queue.setPaused(true);

        if (success) return msg.channel.send(`暫停播放歌曲: ${queue.current.title}`);
        return msg.channel.send(`❌ ${msg.author} 暫停播放歌曲時發生錯誤`);
    },
};
