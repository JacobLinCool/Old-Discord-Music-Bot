const Client = require("@replit/database");
const ENV = require("dotenv").config().parsed || {};

const client = new Client(process.env.REPLIT_DB_URL || ENV.REPLIT_DB_URL);

(async () => {
    console.log(await client.list());
})();
