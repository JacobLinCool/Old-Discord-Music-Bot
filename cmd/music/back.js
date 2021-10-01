module.exports = {
    cmd: "back",
    aka: ["prev"],
    help: "播放前一首歌曲",
    voice: true,

    async execute({ player, msg }) {
        const queue = player.getQueue(msg.guild.id);

        if (!queue || !queue.playing) return msg.channel.send(`❌ ${msg.author} 目前沒有正在播放的歌曲喔`);
        if (!queue.previousTracks[1]) return msg.channel.send(`❌ ${msg.author} 找不到前一首播放的歌曲喔`);

        await queue.back();

        msg.channel.send(`✅ 播放**前一首**歌曲`);
    },
};
