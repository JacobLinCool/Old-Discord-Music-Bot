const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandSubcommandBuilder().setName("progress").setDescription("顯示正在播放的時間訊息");

async function run({ game, player, interaction }) {
    const queue = player.getQueue(interaction.guildId);
    if (!queue) return await interaction.reply(`❌ ${interaction.user} 儲列中沒有任何歌曲喔`);
    if (game[interaction.guildId]) return await interaction.reply(`❌ ${interaction.user} 遊戲進行中，此操作已禁止`);

    const progress = queue.createProgressBar();
    const timestamp = queue.getPlayerTimestamp();

    if (timestamp.progress == "Infinity") return await interaction.reply(`這是現場直播`);

    await interaction.reply(`${progress} (**${timestamp.progress}%**)`);
}

module.exports = { data, run };
