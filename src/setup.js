const { Player } = require("discord-player");
const { Client, Intents } = require("discord.js");

let config, client, player;

function setup(cfg) {
    config = cfg;
    if (!client) {
        client = new Client({
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
            disableMentions: "everyone",
        });
    }
    if (!player) {
        player = new Player(client);
    }
    return { config, client, player };
}

exports.setup = setup;
