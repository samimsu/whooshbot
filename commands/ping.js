module.exports = {
    name: 'ping',
    description: 'Delete messages',
    execute(message) {
        message.channel.send('pong');
    },
};