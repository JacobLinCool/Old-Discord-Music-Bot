module.exports = async ({ client }) => {
    console.log(`✅ 已登入 ${client.user.username}\n>> 可在 ${client.guilds.cache.size} 伺服器上使用 (${client.users.cache.size} 位使用者)`);
    client.user.setActivity(process.env.PLAYING);
};
