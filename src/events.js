function registerPlayerEvents(player) {
    console.log("註冊播放器事件");
    player.on("trackStart", (queue, track) => {
        queue.metadata.send(`🎧 開始在 **${queue.connection.channel.name}** 播放 ${track.title}`);
    });

    player.on("trackAdd", (queue, track) => {
        queue.metadata.send(`✅ ${track.title} 已加入儲列`);
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

    player.on("error", (queue, error) => {
        console.log(`發生錯誤: ${error.message}`);
    });

    player.on("connectionError", (queue, error) => {
        console.log(`發生連線錯誤: ${error.message}`);
    });
}

exports.registerPlayerEvents = registerPlayerEvents;
