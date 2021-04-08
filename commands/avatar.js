module.exports = {
    name: 'avatar',
    description: 'Get use avatar',
    execute(message) {
        const avatar = message.author.displayAvatarURL();
        message.channel.send(avatar);
    },
};