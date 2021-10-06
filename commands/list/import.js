const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { QueryType } = require("discord-player");
const fetch = require("node-fetch");
const Client = require("@replit/database");
const ENV = require("dotenv").config().parsed || {};

const client = new Client(process.env.REPLIT_DB_URL || ENV.REPLIT_DB_URL);

const data = new SlashCommandSubcommandBuilder()
    .setName("import")
    .setDescription("匯入列表")
    .addStringOption((option) => option.setName("json").setDescription("JSON 格式列表或其網址").setRequired(true));

async function run({ player, interaction }) {
    await interaction.deferReply();

    let list = {};
    const input = interaction.options.getString("json");

    try {
        let _list = null;
        try {
            _list = JSON.parse(input);
        } catch {
            const req = await fetch(input);
            if (!req.ok) throw new Error(req.status);
            _list = await req.json();
        }
        if (typeof _list.name !== "string" || !Array.isArray(_list.list)) throw new Error();
        list.name = _list.name;
        list.list = _list.list;
    } catch (err) {
        console.log(err);
        return await interaction.editReply("資料格式不符");
    }

    if (list.name.length < 2 || list.name.length > 30) return await interaction.editReply("列表名稱長度需在 2 ~ 30 字元之間");
    if (await client.get(`${interaction.guildId}-${list.name}`)) return await interaction.editReply("此列表名稱已存在");

    const raw = list.list.map((x) => x.trim());
    const id = [];

    for (let i = 0; i < raw.length; i++) {
        const res = await player.search(raw[i], { searchEngine: QueryType.AUTO });
        res.tracks.forEach((x) => {
            if (x.url.match(/^https?:\/\/(www\.)?youtube\.com\/watch\?v=([^&]+)/))
                id.push(x.url.match(/^https?:\/\/(www\.)?youtube\.com\/watch\?v=([^&]+)/)[2]);
        });
    }

    list.list = [...new Set(id.filter((x) => x.length === 11))];

    await client.set(`${interaction.guildId}-${list.name}`, list);
    await interaction.editReply(`已建立列表「**${list.name}**」 - **${list.list.length}** 個項目`);
}

module.exports = { data, run };
