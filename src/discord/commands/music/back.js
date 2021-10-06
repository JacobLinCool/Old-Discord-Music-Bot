const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandSubcommandBuilder().setName("back").setDescription("播放前一首歌曲");

async function run({ game, player, interaction }) {
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) return await interaction.reply({ content: `❌ ${interaction.user} 目前沒有正在播放的歌曲喔`, ephemeral: true });
    if (!queue.previousTracks[0]) return interaction.reply({ content: `❌ ${interaction.user} 找不到前一首播放的歌曲喔`, ephemeral: true });
    if (game[interaction.guildId]) return await interaction.reply(`❌ ${interaction.user} 遊戲進行中，此操作已禁止`);

    const title = queue.previousTracks[0].title;
    await queue.back();

    return await interaction.reply(`✅ 播放前一首歌曲: ${title}`);
}

module.exports = { data, run };
