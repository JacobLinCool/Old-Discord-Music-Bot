const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

function commandHelps(commands) {
    return commands
        .sort((a, b) => (b.name < a.name ? 1 : -1))
        .map((cmd) => `\`${cmd.name}\`: ${cmd.description}`)
        .join("\n");
}

const data = new SlashCommandBuilder().setName("help").setDescription("提示你有哪些指令可以用");

async function run({ client, interaction }) {
    const embed = new MessageEmbed();

    embed
        .setColor("#ECEFF4")
        .setAuthor(client.user.username, client.user.displayAvatarURL({ size: 1024, dynamic: true }))
        .setDescription("Help Menu")
        .setTimestamp()
        .addField(`指令總數: ${client.commands.length}`, commandHelps(client.commands))
        .setFooter("Jacob's Bot", interaction.user.avatarURL({ dynamic: true }));

    await interaction.reply({ embeds: [embed] });
}

module.exports = { data, run };
