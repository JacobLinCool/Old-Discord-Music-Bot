const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { AudioFilters } = require("discord-player");

const data = new SlashCommandSubcommandBuilder()
    .setName("filter")
    .setDescription("濾波器設定")
    .addStringOption((option) => option.setName("options").setDescription("FFMPEG 濾波器指令").setRequired(true));

async function run({ game, player, interaction }) {
    await interaction.reply("等一下喔");

    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) return await interaction.editReply({ content: `❌ ${interaction.user} 目前沒有正在播放的歌曲喔`, ephemeral: true });
    if (game[interaction.guildId]) return await interaction.editReply(`❌ ${interaction.user} 遊戲進行中，此操作已禁止`);

    const options = replace(interaction.options.getString("options"));

    AudioFilters.define(options, options);

    const filter = {};
    filter[options] = true;
    const success = queue.setFilters(filter);

    if (success) await interaction.editReply("濾波器已設定至：" + options);
}

function replace(options) {
    options = options.replace(/speed=([+-]?(?:[0-9]*[.])?[0-9]+)/g, "atempo=$1");
    return options;
}

module.exports = { data, run };
