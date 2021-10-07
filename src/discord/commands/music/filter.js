const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { AudioFilters } = require("discord-player");

const filters = {
    aecho: "回音效果 [輸入強度(0.6):輸出強度(0.3):延遲(1000):衰減(0.5)] EX: 0.8:0.9:1000:0.3",
    atempo: "調整播放速度 [速度(1)] EX: 1.25",
    aresample: "重新採樣 [頻率(44100)] EX: 48000",
    asetrate: "設定採樣率，將改變音高與速度 [頻率(44100)] EX: 48000*0.8",
    bass: "低音調整 [強度(0):頻率(100):帶寬] EX: g=15:f=110:w=0.3",
    chorus: "合唱團效果 [輸入強度(0.4):輸出強度(0.4):延遲(50):衰減] EX: 0.5:0.9:50|60|40:0.4|0.32|0.3:0.25|0.4|0.3:2|2.3|1.3",
    treble: "高音調整 [強度(0):頻率(3000):帶寬] EX: g=15:f=3200:w=0.3",
    tremolo: "震音 [頻率(5):深度(0.5)] EX: f=10:d=0.7",
    other: "其他濾波器設定",
};

const data = new SlashCommandSubcommandBuilder().setName("filter").setDescription("濾波器設定");

for (const [k, v] of Object.entries(filters)) {
    data.addStringOption((option) => option.setName(k).setDescription(v));
}

async function run({ game, player, interaction }) {
    await interaction.reply("等一下喔");

    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) return await interaction.editReply({ content: `❌ ${interaction.user} 目前沒有正在播放的歌曲喔`, ephemeral: true });
    if (game[interaction.guildId]) return await interaction.editReply(`❌ ${interaction.user} 遊戲進行中，此操作已禁止`);

    const filter = {};
    for (const [k, v] of Object.entries(filters)) {
        try {
            let options = replace(interaction.options.getString(k));
            if (!options) continue;
            options = k + "=" + options;
            AudioFilters.define(options, options);
            filter[options] = true;
        } catch (err) {}
    }
    const success = queue.setFilters(filter);

    if (success) await interaction.editReply("濾波器已設定至：" + Object.keys(filter).join(", "));
}

function replace(options) {
    options = options.replace(/speed=([+-]?(?:[0-9]*[.])?[0-9]+)/g, "atempo=$1");
    return options;
}

module.exports = { data, run };
