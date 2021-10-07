function register(player) {
    process.stdout.write("註冊播放器事件...");

    player.on("trackStart", (queue, track) => {
        queue.metadata.send(`🎧 開始在 **${queue.connection.channel.name}** 播放 ${track.title}`);
    });

    player.on("botDisconnect", (queue) => {
        queue.metadata.send("❌ 斷線了，所以儲列也順便清空了");
    });

    player.on("channelEmpty", (queue) => {
        queue.metadata.send("❌ 大家都閃了，那我也掰囉");
    });

    player.on("queueEnd", (queue) => {
        queue.metadata.send("✅ 所有儲列中的歌曲都播放完畢了喔");
    });

    player.on("error", async (queue, error) => {
        queue.metadata.send(`非常抱歉，但我這邊發生了一個錯誤: \n${error.message}`);
        console.log(`發生錯誤: ${error.message}`);
        const query = queue.current.title;
        console.time(">> Youtube Search - " + query);
        const res = await player.search(query, { requestedBy: interaction.member, searchEngine: QueryType.AUTO });
        console.timeEnd(">> Youtube Search - " + query);
        if (res && res.tracks.length) {
            queue.insert(res.tracks[0], 0);
            queue.jump(0);
            queue.play();
        }
    });

    player.on("connectionError", (queue, error) => {
        console.log(`發生連線錯誤: ${error.message}`);
    });

    player.on("debug", (queue, msg) => {
        console.log(`[DEBUG] ${msg}`);
    });

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write("播放器事件註冊完成！\n");
}

module.exports = register;
