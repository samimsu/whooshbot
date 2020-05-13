module.exports = {
    name: 'ping',
    description: 'ping pong',
    execute(message) {
        message.channel.send('pong');
    },
};