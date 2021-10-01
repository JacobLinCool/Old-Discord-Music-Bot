module.exports = {
    cmd: "seek",
    aka: [],
    help: "跳轉至正在播放歌曲的某時間點 seek <m> <s> | seek <s>",
    voice: true,

    async execute({ config, player, msg }, args) {
        const queue = player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) return interaction.reply(`❌ ${interaction.user} 目前沒有正在播放的歌曲喔`);

        let time = 0;
        try {
            if (args.length === 1) {
                time = +args[0];
            } else if (args.length === 2) {
                time = +args[0] * 60 + +args[1];
            } else {
                return interaction.reply(`❌ ${interaction.user} 請輸入要跳轉的時間 <s> | <m> <s>\n例如: ${config.prefix}seek 1 30`);
            }
        } catch {
            return interaction.reply(`❌ ${interaction.user} 請輸入要跳轉的時間 <s> | <m> <s>\n例如: ${config.prefix}seek 1 30`);
        }
        time *= 1000;

        if (time >= queue.current.durationMS)
            return interaction.reply(`❌ ${interaction.user} 跳轉時間超出歌曲長度 (${queue.current.duration})！請輸入要跳轉的時間 <s> | <m> <s>`);

        await queue.seek(time);

        return interaction.reply(`已跳轉至 ${parseInt(time / 60000)} 分 ${parseInt((time % 60000) / 1000)} 秒`);
    },
};
