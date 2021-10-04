const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandSubcommandBuilder().setName("save").setDescription("把正在播放的歌曲資訊私訊給你");

async function run({ player, interaction }) {
    const queue = player.getQueue(interaction.guildId);

    if (!queue || !queue.playing) return await interaction.reply({ content: `❌ ${interaction.user} 目前沒有正在播放的歌曲喔`, ephemeral: true });

    try {
        await interaction.user.send(`歌曲 [**${queue.current.title} (${queue.current.author})**](${queue.current.url})\n *從 ${interaction.guild} 儲存*`);
        await interaction.reply({ content: `✅ 我已經將歌曲資訊私訊給你囉`, ephemeral: true });
    } catch (error) {
        await interaction.reply({ content: `❌ ${interaction.user} 很抱歉，但我無法傳送私人訊息給你`, ephemeral: true });
    }
}

module.exports = { data, run };
