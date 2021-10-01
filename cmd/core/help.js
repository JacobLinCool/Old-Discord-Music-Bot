const { MessageEmbed } = require("discord.js");

function commandHelps(commands) {
    return commands
        .sort((a, b) => (b.cmd < a.cmd ? 1 : -1))
        .map((cmd) => `\`${cmd.cmd}${Array.isArray(cmd.aka) && cmd.aka.length ? ` (${cmd.aka.join(", ")})\`` : "`"}: ${cmd.help}`)
        .join("\n");
}

module.exports = {
    cmd: "help",
    aka: ["?"],

    async execute({ client, msg }, args) {
        const embed = new MessageEmbed();
        const commands = client.commands.filter((x) => x.help);

        embed
            .setColor("#ECEFF4")
            .setAuthor(client.user.username, client.user.displayAvatarURL({ size: 1024, dynamic: true }))
            .setDescription("Help Menu")
            .setTimestamp()
            .addField(`指令總數: ${commands.size}`, commandHelps(commands))
            .setFooter("Hello From NTNU CSIE!!", msg.author.avatarURL({ dynamic: true }));

        return msg.channel.send({ embeds: [embed] });
    },
};
