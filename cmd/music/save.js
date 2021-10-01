module.exports = {
    cmd: "save",
    aka: ["sv"],
    help: "把正在播放的歌曲資訊私訊給你",
    voice: true,

    async execute({ player, msg }) {
        const queue = player.getQueue(msg.guild.id);

        if (!queue || !queue.playing) return msg.channel.send(`❌ ${msg.author} 目前沒有正在播放的歌曲喔`);

        msg.author
            .send(`歌曲 **[${queue.current.title} (${queue.current.author})](${queue.current.url})**\n *從 ${msg.guild.name} 儲存*`)
            .then(() => {
                msg.channel.send(`✅ 我已經將歌曲資訊私訊給你囉`);
            })
            .catch((error) => {
                msg.channel.send(`❌ ${msg.author} 很抱歉，但我無法傳送私人訊息給你`);
            });
    },
};
