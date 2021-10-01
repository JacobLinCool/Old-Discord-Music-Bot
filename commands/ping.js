const { SlashCommandBuilder } = require("@discordjs/builders");

const name = "ping";
const description = "延遲測試";

const data = new SlashCommandBuilder().setName(name).setDescription(description);

async function run({ client, interaction }) {
    interaction.reply(
        `🛰️ 嗶嗶嗶! 我與 Discord 之間的延遲時間: **${client.ws.ping} 毫秒** (測量時間: ${(
            (Date.now() - client.ws.shards.first().lastPingTimestamp) /
            1000
        ).toFixed(0)} 秒前)`,
    );
}

module.exports = { data, run };
