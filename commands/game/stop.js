const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandSubcommandBuilder()
    .setName("stop")
    .setDescription("結束遊戲")
    .addStringOption((option) => option.setName("確認").setDescription("輸入 STOP 以結束遊戲").setRequired(true));

async function run({ game, player, interaction }) {
    await interaction.deferReply();
    if (!game[interaction.guildId]) return await interaction.editReply("未有存在遊戲");

    const confirm = interaction.options.getString("確認").trim();
    if (confirm !== "STOP") return await interaction.editReply("需要輸入 STOP 才能結束遊戲");

    let queue = player.getQueue(interaction.guildId);

    if (queue && queue.game) await queue.game.end(interaction.user);
    else await game[interaction.guildId].end(interaction.user);
    await interaction.editReply("遊戲已結束");
}

module.exports = { data, run };
