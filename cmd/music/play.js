const { QueryType } = require("discord-player");

module.exports = {
    cmd: "play",
    aka: ["p"],
    help: "播放歌曲 play <search|url>",
    voice: true,

    async execute({ player, msg }, args) {
        if (!args[0]) return msg.channel.send(`❌ ${msg.author} 請輸入參數 (查詢或網址)`);

        const res = await player.search(args.join(" "), { requestedBy: msg.member, searchEngine: QueryType.AUTO });
        if (!res || !res.tracks.length) return msg.channel.send(`❌ ${msg.author} 無相符之查詢結果`);

        const queue = await player.createQueue(msg.guild, { metadata: msg.channel });
        try {
            if (!queue.connection) await queue.connect(msg.member.voice.channel);
        } catch {
            await player.deleteQueue(msg.guild.id);
            return msg.channel.send(`❌ ${msg.author} 我加不進語音頻道 QQ`);
        }

        await Promise.all([
            msg.channel.send(`🎧 正在載入${res.playlist ? "播放列表" : "歌曲"}...`),
            res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]),
        ]);

        if (!queue.playing) await queue.play();
    },
};
