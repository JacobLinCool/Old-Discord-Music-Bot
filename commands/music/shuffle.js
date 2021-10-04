const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandSubcommandBuilder().setName("shuffle").setDescription("隨機排序儲列中的歌曲");

async function run({ player, interaction }) {
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) return await interaction.reply(`❌ ${interaction.user} 目前沒有正在播放的歌曲喔`);
    if (!queue.tracks[0]) return await interaction.reply(`❌ ${interaction.user} 播完現在這首儲列中就沒歌曲了喔`);

    await queue.shuffle();

    await interaction.reply(`✅ 已隨機排序儲列中 **${queue.tracks.length}** 首歌！`);
}

module.exports = { data, run };
