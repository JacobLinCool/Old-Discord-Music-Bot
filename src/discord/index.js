const { Player } = require("discord-player");
const { Client, Intents } = require("discord.js");

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
    disableMentions: "everyone",
});
const player = new Player(client, { ytdlOptions: { quality: "highestaudio", highWaterMark: 1 << 25 } });
const downloader = require("@discord-player/downloader").Downloader;
player.use("YOUTUBE_DL", downloader);

async function setup() {
    // Register Bot Commands
    const commands = await require("./commands")();
    client.commands = commands;

    // Register Discord.js Events
    require("./events")(client, { client, player, game: {} });

    // Register Discord Player Events
    require("./playerEvents")(player);

    // Login to Discord
    client.login(process.env.DC_TOKEN);

    return new Date();
}

exports.setup = setup;
