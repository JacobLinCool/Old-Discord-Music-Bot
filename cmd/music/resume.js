module.exports = {
    cmd: "resume",
    aka: ["rs"],
    help: "繼續播放",
    voice: true,

    execute({ player, msg }) {
        const queue = player.getQueue(msg.guild.id);

        if (!queue) return msg.channel.send(`❌ ${msg.author} 儲列中沒有任何歌曲喔`);

        const success = queue.setPaused(false);

        if (success) return msg.channel.send(`繼續播放歌曲: ${queue.current.title}`);
        return msg.channel.send(`❌ ${msg.author} 繼續播放歌曲時發生錯誤`);
    },
};
