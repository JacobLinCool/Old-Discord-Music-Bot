const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandSubcommandBuilder().setName("pause").setDescription("暫停播放歌曲");

async function run({ game, player, interaction }) {
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) return await interaction.reply(`❌ ${interaction.user} 目前沒有正在播放的歌曲喔`);
    if (game[interaction.guildId]) return await interaction.reply(`❌ ${interaction.user} 遊戲進行中，此操作已禁止`);

    const success = queue.setPaused(true);

    if (success) return await interaction.reply(`暫停播放歌曲: ${queue.current.title}`);
    return await interaction.reply(`❌ ${interaction.user} 暫停播放歌曲時發生錯誤`);
}

module.exports = { data, run };
