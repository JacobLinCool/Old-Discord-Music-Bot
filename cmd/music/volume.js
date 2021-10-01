module.exports = {
    cmd: "volume",
    aka: ["vol"],
    utilisation: `{prefix}volume [1-100]`,
    voice: true,

    execute({ player, msg }, args) {
        const queue = player.getQueue(msg.guild.id);

        if (!queue || !queue.playing) return msg.channel.send(`❌ ${msg.author} 目前沒有正在播放的歌曲喔`);

        const vol = parseInt(args[0]);
        if (!vol) return msg.channel.send(`🔊 目前音量是 ${queue.volume}% \n如要改變音量請加上 1 ~ 100 之參數`);

        if (queue.volume === vol) return msg.channel.send(`❌ ${msg.author} 目前的音量已經是 ${val}% 了喔`);
        if (vol < 0 || vol > 100) return msg.channel.send(`❌ ${msg.author} 可接受的音量範圍是 0 ~ 100`);

        const success = queue.setVolume(vol);

        if (success) return msg.channel.send(`音量已設定至 **${vol}%**`);
        return msg.channel.send(`❌ ${msg.author} 設定音量時發生錯誤`);
    },
};
