const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandSubcommandBuilder().setName("skip").setDescription("跳過正在播放的歌曲");

async function run({ player, interaction }) {
    const queue = player.getQueue(interaction.guildId);

    if (!queue || !queue.playing) return interaction.reply(`❌ ${interaction.user} 目前沒有正在播放的歌曲喔`);

    const success = queue.skip();

    if (success) return interaction.reply(`跳過歌曲: ${queue.current.title}`);
    return interaction.reply(`❌ ${interaction.user} 跳過歌曲時發生錯誤`);
}

module.exports = { data, run };
