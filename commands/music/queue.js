const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

const data = new SlashCommandSubcommandBuilder().setName("queue").setDescription("顯示儲列資訊");

async function run({ client, player, interaction }) {
    const queue = player.getQueue(interaction.guildId);
    if (!queue) return await interaction.reply(`❌ ${interaction.user} 儲列中沒有任何歌曲喔`);
    if (!queue.tracks[0]) return await interaction.reply(`❌ ${interaction.user} 播完現在這首儲列中就沒歌曲了喔`);

    const methods = ["關閉", "單曲循環", "全部歌曲"];
    const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (由 ${track.requestedBy.username} 添加)`);
    const moreSongs = queue.tracks.length > 5 ? `以及 **${queue.tracks.length - 5}** 首其他歌曲` : `列表中有 **${queue.tracks.length}** 首歌曲`;

    const embed = new MessageEmbed();
    embed
        .setColor("#ECEFF4")
        .setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }))
        .setAuthor(`${interaction.guild.name} 目前循環模式: ${methods[queue.repeatMode]}`, client.user.displayAvatarURL({ size: 1024, dynamic: true }))
        .setDescription(`正在播放 ${queue.current.title}\n\n${tracks.slice(0, 5).join("\n")}\n\n${moreSongs}`)
        .setTimestamp()
        .setFooter(queue.playing ? `🎵 正在播放: ${queue.current.title}` : "暫停中", interaction.user.avatarURL({ dynamic: true }));

    await interaction.reply({ embeds: [embed] });
}

module.exports = { data, run };
