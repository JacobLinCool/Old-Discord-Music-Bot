const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandSubcommandBuilder()
    .setName("answer")
    .setDescription("回答")
    .addStringOption((option) => option.setName("編號").setDescription("輸入歌曲編號").setRequired(true));

async function run({ game, player, interaction }) {
    await interaction.deferReply();
    if (!game[interaction.guildId]) return await interaction.editReply("未有存在遊戲");

    const n = parseInt(interaction.options.getString("編號").trim());
    if (typeof n !== "number") return await interaction.editReply({ content: "請輸入數字", ephemeral: true });

    const queue = player.getQueue(interaction.guildId);
    if (queue.game) {
        const result = queue.game.answer(n, interaction.user.name);
        if (result) {
            const p = queue.game.game.players.find((p) => p.user.id === interaction.user.id);
            if (p) p.points += 1;
            else queue.game.game.players.push({ user: interaction.user, points: 1 });
            return await interaction.editReply(`✅ ${interaction.user} 回答正確！\n${result}`);
        } else return await interaction.editReply({ content: `❌ ${interaction.user} 回答錯誤`, ephemeral: true });
    }
}

module.exports = { data, run };
