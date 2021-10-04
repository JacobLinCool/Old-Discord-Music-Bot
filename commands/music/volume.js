const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandSubcommandBuilder()
    .setName("volume")
    .setDescription("調整音量 volume [1-200]")
    .addStringOption((option) => option.setName("音量").setDescription("輸入 0 ~ 200 的數字").setRequired(false));

async function run({ player, interaction }) {
    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);

    if (!queue || !queue.playing) return await interaction.editReply(`❌ ${interaction.user} 目前沒有正在播放的歌曲喔`);

    const vol = +interaction.options.getString("音量");
    if (!vol) return await interaction.editReply(`🔊 目前音量是 ${queue.volume}% \n如要改變音量請加上 1 ~ 200 之參數`);

    if (queue.volume === vol) return await interaction.editReply(`❌ ${interaction.user} 目前的音量已經是 ${val}% 了喔`);
    if (vol < 0 || vol > 200) return await interaction.editReply(`❌ ${interaction.user} 可接受的音量範圍是 0 ~ 200`);

    const success = queue.setVolume(vol);

    if (success) await interaction.editReply(`音量已設定至 **${vol}%**`);
    else await interaction.editReply(`❌ ${interaction.user} 設定音量時發生錯誤`);
}

module.exports = { data, run };
