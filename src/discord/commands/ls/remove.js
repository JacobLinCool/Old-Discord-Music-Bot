const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const Client = require("@replit/database");

const client = new Client();

const data = new SlashCommandSubcommandBuilder()
    .setName("remove")
    .setDescription("移除列表中的項目")
    .addStringOption((option) => option.setName("名稱").setDescription("列表名稱").setRequired(true))
    .addStringOption((option) => option.setName("index").setDescription("項目索引，以「,」分割，範圍選取「-」").setRequired(true));

async function run({ interaction }) {
    await interaction.deferReply();

    const name = interaction.options.getString("名稱").trim();
    if (name.length < 2 || name.length > 30) return await interaction.editReply("列表名稱長度需在 2 ~ 30 字元之間");

    const list = await client.get(`${interaction.guildId}-${name}`);
    if (!list) return await interaction.editReply("此列表並不存在");

    const items = new Set();
    interaction.options
        .getString("index")
        .split(",")
        .forEach((x) => {
            x = x.trim();
            try {
                if (x.includes("-")) {
                    x = x.split("-").map((x) => parseInt(x.trim()));
                    if (typeof x[0] === "number" && typeof x[1] === "number" && x[0] >= 1 && x[1] <= list.list.length) {
                        for (let i = x[0]; i <= x[1]; i++) items.add(i);
                    }
                } else {
                    x = parseInt(x);
                    if (typeof x === "number" && x >= 1 && x <= list.list.length) items.add(x);
                }
            } catch (err) {}
        });

    const old_length = list.list.length;
    list.list = list.list.map((x, i) => (items.has(i + 1) ? undefined : x)).filter((x) => x !== undefined);
    const remove_length = old_length - list.list.length;

    await client.set(`${interaction.guildId}-${name}`, list);
    await interaction.editReply(`列表「**${name}**」已更新 - 已刪除 **${remove_length}** 個項目`);
}

module.exports = { data, run };
