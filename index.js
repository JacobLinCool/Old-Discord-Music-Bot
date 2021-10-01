const config = require("dotenv").config().parsed || {};
const { run } = require("./src/main");

if (!config.id) config.id = process.env.id;
if (!config.token) config.token = process.env.token;
if (!config.playing) config.playing = process.env.playing;
run(config);

require("./server");
