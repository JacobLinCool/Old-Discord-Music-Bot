const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandSubcommandBuilder().setName("resume").setDescription("繼續播放歌曲");

async function run({ player, interaction }) {
    const queue = player.getQueue(interaction.guildId);
    if (!queue) return await interaction.reply(`❌ ${interaction.user} 儲列中沒有任何歌曲喔`);

    const success = queue.setPaused(false);

    if (success) return await interaction.reply(`繼續播放歌曲: ${queue.current.title}`);
    await interaction.reply(`❌ ${interaction.user} 繼續播放歌曲時發生錯誤`);
}

module.exports = { data, run };
