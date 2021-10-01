const { QueueRepeatMode } = require("discord-player");

module.exports = {
    cmd: "loop",
    aka: ["lp", "repeat"],
    help: "循環播放歌曲 loop <mode>, mode = single(s), all(a), off",
    voice: true,

    async execute({ config, player, msg }, args) {
        const queue = player.getQueue(interaction.guildId);

        if (!queue) return interaction.reply(`❌ ${interaction.user} 儲列中沒有任何歌曲喔`);

        const mode = args.join("").toLowerCase();

        if (mode === "all" || mode === "a") {
            if (queue.repeatMode === QueueRepeatMode.QUEUE) return interaction.reply(`❌ ${interaction.user} 現在循環播放設定已經是**全部歌曲**了`);

            const success = queue.setRepeatMode(QueueRepeatMode.QUEUE);

            if (success) return interaction.reply(`循環播放設定已更新為 **全部歌曲**`);
            return interaction.reply(`❌ ${interaction.user} 循環播放設置發生錯誤`);
        } else if (mode === "single" || mode === "s") {
            if (queue.repeatMode === QueueRepeatMode.TRACK) return interaction.reply(`❌ ${interaction.user} 現在循環播放設定已經是**單曲循環**了`);

            const success = queue.setRepeatMode(QueueRepeatMode.TRACK);

            if (success) return interaction.reply(`循環播放設定已更新為 **單曲循環**`);
            return interaction.reply(`❌ ${interaction.user} 循環播放設置發生錯誤`);
        } else if (mode === "off") {
            if (queue.repeatMode === QueueRepeatMode.OFF) return interaction.reply(`❌ ${interaction.user} 現在循環播放設定已經是**關閉**了`);

            const success = queue.setRepeatMode(QueueRepeatMode.OFF);

            if (success) return interaction.reply(`循環播放設定已更新為 **關閉**`);
            return interaction.reply(`❌ ${interaction.user} 循環播放設置發生錯誤`);
        } else {
            let current = "";
            if (queue.repeatMode === QueueRepeatMode.QUEUE) current = "全部歌曲";
            if (queue.repeatMode === QueueRepeatMode.TRACK) current = "單曲循環";
            if (queue.repeatMode === QueueRepeatMode.OFF) current = "關閉";
            return interaction.reply(`目前循環播放設定是 **${current}**\n如要改變模式，請使用 ${config.prefix}loop <mode> \nmode = single(s), all(a), off`);
        }
    },
};
