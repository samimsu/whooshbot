module.exports = {
    name: 'greet',
    description: 'greet',
    execute(message) {
        message.channel.send(`Hello there ${message.author}`);
    },
};