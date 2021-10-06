const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandSubcommandBuilder().setName("progress").setDescription("顯示正在播放的時間訊息");

async function run({ game, player, interaction }) {
    const queue = player.getQueue(interaction.guildId);
    if (!queue) return await interaction.reply({ content: `❌ ${interaction.user} 儲列中沒有任何歌曲喔`, ephemeral: true });
    if (game[interaction.guildId]) return await interaction.reply({ content: `❌ ${interaction.user} 遊戲進行中，此操作已禁止`, ephemeral: true });

    const progress = queue.createProgressBar();
    const timestamp = queue.getPlayerTimestamp();

    if (timestamp.progress === "Infinity") return await interaction.reply({ content: "這是現場直播", ephemeral: true });

    await interaction.reply({ content: `${progress} (**${timestamp.progress}%**)`, ephemeral: true });
}

module.exports = { data, run };
