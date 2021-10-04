const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandSubcommandBuilder().setName("stop").setDescription("刪除儲列，停止播放所有歌曲");

async function run({ player, interaction }) {
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) return await interaction.reply(`❌ ${interaction.user} 目前沒有正在播放的歌曲喔`);
    queue.destroy();
    await interaction.reply(`已刪除儲列，並停止播放所有歌曲`);
}

module.exports = { data, run };
