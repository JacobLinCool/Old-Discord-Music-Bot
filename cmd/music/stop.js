module.exports = {
    cmd: "stop",
    aka: ["sp"],
    help: "刪除儲列，停止播放所有歌曲",
    voice: true,

    execute({ player, msg }) {
        const queue = player.getQueue(msg.guild.id);

        if (!queue || !queue.playing) return msg.channel.send(`❌ ${msg.author} 目前沒有正在播放的歌曲喔`);

        queue.destroy();

        msg.channel.send(`已刪除儲列，並停止播放所有歌曲`);
    },
};
