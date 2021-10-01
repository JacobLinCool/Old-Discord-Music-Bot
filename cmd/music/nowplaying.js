const { MessageEmbed } = require("discord.js");

module.exports = {
    cmd: "nowplaying",
    aka: ["np", "now", "playing"],
    help: "顯示正在播放的歌曲資訊",
    voice: true,

    execute({ client, player, msg }) {
        const queue = player.getQueue(msg.guild.id);

        if (!queue || !queue.playing) return msg.channel.send(`❌ ${msg.author} 目前沒有正在播放的歌曲喔`);

        const track = queue.current;
        const methods = ["關閉", "單曲循環", "全部歌曲"];
        const timestamp = queue.getPlayerTimestamp();
        const trackDuration = timestamp.progress == "Infinity" ? "現場直播" : track.duration;

        const embed = new MessageEmbed();

        embed
            .setColor("#ECEFF4")
            .setThumbnail(track.thumbnail)
            .setAuthor(track.title, client.user.displayAvatarURL({ size: 1024, dynamic: true }))
            .setDescription(`音量 **${queue.volume}**%\n長度 **${trackDuration}**\n循環播放 **${methods[queue.repeatMode]}**\n由 ${track.requestedBy} 添加`)
            .setTimestamp()
            .setFooter(`🎵 正在播放: ${track.title}`, msg.author.avatarURL({ dynamic: true }));

        msg.channel.send({ embeds: [embed] });
    },
};
