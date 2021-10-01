module.exports = {
    cmd: "progress",
    aka: ["pbar"],
    help: "顯示儲列播放資訊",
    voice: true,

    async execute({ player, msg }) {
        const queue = player.getQueue(msg.guild.id);

        if (!queue) return msg.channel.send(`❌ ${msg.author} 儲列中沒有任何歌曲喔`);

        const progress = queue.createProgressBar();
        const timestamp = queue.getPlayerTimestamp();

        if (timestamp.progress == "Infinity") return msg.channel.send(`這是現場直播`);

        msg.channel.send(`${progress} (**${timestamp.progress}%**)`);
    },
};
