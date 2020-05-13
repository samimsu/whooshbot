module.exports = {
    name: 'uptime',
    description: 'Get bot uptime',
    execute(message) {
        message.channel.send(message.client.uptime);
    },
};