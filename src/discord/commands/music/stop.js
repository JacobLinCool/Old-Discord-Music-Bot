const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandSubcommandBuilder().setName("stop").setDescription("刪除儲列，停止播放所有歌曲");

async function run({ game, player, interaction }) {
    const queue = player.getQueue(interaction.guildId);
    if (!queue) return await interaction.reply({ content: `❌ ${interaction.user} 儲列中沒有任何歌曲喔`, ephemeral: true });
    if (game[interaction.guildId]) return await interaction.reply(`❌ ${interaction.user} 遊戲進行中，此操作已禁止`);
    queue.destroy();
    await interaction.reply("已刪除儲列，並停止播放所有歌曲");
}

module.exports = { data, run };
