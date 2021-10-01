const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandSubcommandBuilder().setName("pause").setDescription("暫停播放歌曲");

async function run({ player, interaction }) {
    const queue = player.getQueue(interaction.guildId);

    if (!queue || !queue.playing) return interaction.reply(`❌ ${interaction.user} 目前沒有正在播放的歌曲喔`);

    const success = queue.setPaused(true);

    if (success) return interaction.reply(`暫停播放歌曲: ${queue.current.title}`);
    return interaction.reply(`❌ ${interaction.user} 暫停播放歌曲時發生錯誤`);
}

module.exports = { data, run };