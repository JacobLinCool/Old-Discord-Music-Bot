const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

const data = new SlashCommandSubcommandBuilder().setName("now").setDescription("顯示正在播放的歌曲資訊");

async function run({ game, client, player, interaction }) {
    const queue = player.getQueue(interaction.guildId);

    if (!queue || !queue.playing) return await interaction.reply({ content: `❌ ${interaction.user} 目前沒有正在播放的歌曲喔`, ephemeral: true });
    if (game[interaction.guildId]) return await interaction.reply(`❌ ${interaction.user} 遊戲進行中，此操作已禁止`);

    const track = queue.current;
    const methods = ["關閉", "單曲循環", "全部歌曲"];
    const timestamp = queue.getPlayerTimestamp();
    const trackDuration = timestamp.progress === "Infinity" ? "現場直播" : track.duration;

    const embed = new MessageEmbed();

    embed
        .setColor("#ECEFF4")
        .setThumbnail(track.thumbnail)
        .setAuthor(track.title, client.user.displayAvatarURL({ size: 1024, dynamic: true }))
        .setDescription(`音量 **${queue.volume}**%\n長度 **${trackDuration}**\n循環播放 **${methods[queue.repeatMode]}**\n由 ${track.requestedBy} 添加`)
        .setTimestamp()
        .setFooter(`🎵 正在播放: ${track.title}`, interaction.user.avatarURL({ dynamic: true }));

    await interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = { data, run };
