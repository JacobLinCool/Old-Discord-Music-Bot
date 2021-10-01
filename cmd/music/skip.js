module.exports = {
    cmd: "skip",
    aka: ["sk"],
    help: "跳過正在播放的歌曲",
    voice: true,

    execute({ player, msg }) {
        const queue = player.getQueue(msg.guild.id);

        if (!queue || !queue.playing) return msg.channel.send(`❌ ${msg.author} 目前沒有正在播放的歌曲喔`);

        const success = queue.skip();

        if (success) return msg.channel.send(`跳過歌曲: ${queue.current.title}`);
        return msg.channel.send(`❌ ${msg.author} 跳過歌曲時發生錯誤`);
    },
};
