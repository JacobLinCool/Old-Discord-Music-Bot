const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandSubcommandBuilder()
    .setName("seek")
    .setDescription("跳轉至正在播放歌曲的某時間點")
    .addStringOption((option) => option.setName("時間").setDescription("要跳轉的目標時間 mm:ss").setRequired(true));

async function run({ game, player, interaction }) {
    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);

    if (!queue || !queue.playing) return await interaction.editReply(`❌ ${interaction.user} 目前沒有正在播放的歌曲喔`);
    if (game[interaction.guildId]) return await interaction.reply(`❌ ${interaction.user} 遊戲進行中，此操作已禁止`);

    let time = 0;
    const args = interaction.options
        .getString("時間")
        .split(":")
        .map((x) => Number(x.trim()));
    try {
        if (args.length === 1) {
            time = +args[0];
        } else if (args.length === 2) {
            time = +args[0] * 60 + +args[1];
        } else {
            return await interaction.editReply(`❌ ${interaction.user} 參數只接受 mm:ss 或 ss`);
        }
    } catch {
        return await interaction.editReply(`❌ ${interaction.user} 參數只接受 mm:ss 或 ss`);
    }
    time *= 1000;

    if (time >= queue.current.durationMS)
        return await interaction.editReply(`❌ ${interaction.user} 跳轉時間超出歌曲長度 (${queue.current.duration})！ \n可接受參數： mm:ss 或 ss`);

    await queue.seek(time);

    await interaction.editReply(`已跳轉至 ${parseInt(time / 60000)} 分 ${parseInt((time % 60000) / 1000)} 秒`);
}

module.exports = { data, run };
