class GM {
    constructor(queue, gid, tracks, globGame, timeout) {
        this.game = { start: new Date(), players: [] };
        this.queue = queue;
        this.gid = gid;
        this.tracks = JSON.parse(JSON.stringify(tracks)).sort((a, b) => (a.title > b.title ? 1 : -1));
        console.log(tracks);
        this.globGame = globGame;
        this.timeout = timeout;
        this.pass = () => {};
    }

    async start() {
        let res = "";
        this.tracks.forEach((t, i) => {
            res += `**${i + 1}**. ${t.title}\n`;
        });
        await this.queue.metadata.send(res);
        this.queue.play();
        this.go();
    }

    answer(answer, username) {
        const now = this.queue.current;
        const idx = this.tracks.findIndex((t) => t.title === now.title);
        if (idx === -1) return false;
        if (answer === idx + 1) {
            this.tracks[idx].user = username;
            this.pass();
            return now.title;
        }
        return false;
    }

    async end(user = null) {
        try {
            const channel = this.queue.metadata;
            this.queue.destroy();
            if (user) await channel.send(`${user} 結束了遊戲`);
            else await channel.send("遊戲已結束");
            let result = "";
            this.tracks.forEach((t, i) => {
                result += `${i + 1}. ${t.title} (**${t.user || "沒有人"}**)\n`;
            });
            result += "---\n";
            this.game.players
                .sort((a, b) => a.points - b.points)
                .forEach((p, i) => {
                    result += `${i + 1}. ${p.user} (**${p.points}** 分)\n`;
                });
            await channel.send(result);
            delete this.globGame[this.gid];
        } catch (err) {
            console.error(err);
        }
        this.ended = true;
    }

    async go() {
        const self = this;
        await new Promise((r) => {
            setTimeout(async() => {
                r();
                if(!self.ended) self.queue.metadata.send("沒人回答，跳過了一首歌");
            }, self.timeout * 1000);
            self.pass = r;
        });
        if (!this.queue) return;
        this.queue.skip();
        if (this.queue.tracks.length > 0) this.go();
        else this.end();
    }
}

module.exports = GM;
