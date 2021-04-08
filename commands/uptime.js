module.exports = {
    name: 'uptime',
    description: 'Get bot uptime',
    execute(message) {
        const uptimeMS = message.client.uptime;
        const seconds = parseInt(Math.floor(uptimeMS / 1000));
        const minutes = parseInt(Math.floor(seconds / 60));
        const hours = parseInt(Math.floor(minutes / 60));
        const days = parseInt(Math.floor(hours / 24));

        message.channel.send(`${uptimeMS}ms = ${seconds}s = ${minutes}m =  ${hours}h = ${days}d`);
    },
};