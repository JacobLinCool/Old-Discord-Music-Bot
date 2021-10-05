const { QueueRepeatMode } = require("discord-player");
const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandSubcommandBuilder()
    .setName("loop")
    .setDescription("循環播放歌曲")
    .addStringOption((option) =>
        option
            .setName("模式")
            .setDescription("循環播放模式")
            .setRequired(true)
            .addChoice("全部循環", "all")
            .addChoice("單曲循環", "single")
            .addChoice("關閉循環", "off")
            .addChoice("目前狀態", "current"),
    );

async function run({ game, player, interaction }) {
    const queue = player.getQueue(interaction.guildId);

    if (!queue) return await interaction.reply(`❌ ${interaction.user} 儲列中沒有任何歌曲喔`);
    if (game[interaction.guildId]) return await interaction.reply(`❌ ${interaction.user} 遊戲進行中，此操作已禁止`);

    const mode = interaction.options.getString("模式");

    if (mode === "all" || mode === "a") {
        if (queue.repeatMode === QueueRepeatMode.QUEUE) return await interaction.reply(`${interaction.user} 現在循環播放設定已經是**全部循環**了`);

        const success = queue.setRepeatMode(QueueRepeatMode.QUEUE);

        if (success) return await interaction.reply(`循環播放設定已更新為 **全部循環**`);
        return await interaction.reply(`❌ ${interaction.user} 循環播放設置發生錯誤`);
    } else if (mode === "single" || mode === "s") {
        if (queue.repeatMode === QueueRepeatMode.TRACK) return await interaction.reply(`${interaction.user} 現在循環播放設定已經是**單曲循環**了`);

        const success = queue.setRepeatMode(QueueRepeatMode.TRACK);

        if (success) return await interaction.reply(`循環播放設定已更新為 **單曲循環**`);
        return await interaction.reply(`❌ ${interaction.user} 循環播放設置發生錯誤`);
    } else if (mode === "off") {
        if (queue.repeatMode === QueueRepeatMode.OFF) return await interaction.reply(`${interaction.user} 現在循環播放設定已經是**關閉**了`);

        const success = queue.setRepeatMode(QueueRepeatMode.OFF);

        if (success) return await interaction.reply(`循環播放設定已更新為 **關閉**`);
        return await interaction.reply(`❌ ${interaction.user} 循環播放設置發生錯誤`);
    } else {
        let current = "";
        if (queue.repeatMode === QueueRepeatMode.QUEUE) current = "全部循環";
        if (queue.repeatMode === QueueRepeatMode.TRACK) current = "單曲循環";
        if (queue.repeatMode === QueueRepeatMode.OFF) current = "關閉";
        return await interaction.reply(`目前循環播放設定是 **${current}**`);
    }
}

module.exports = { data, run };
