function initialize() {
    process.stdout.write("正在初始化...");

    // Timezone
    process.env.TZ = "Asia/Taipei";

    // Load from .env
    require("dotenv").config();

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write("初始化完成！\n");
}

module.exports = initialize;
