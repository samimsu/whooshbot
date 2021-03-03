async function log(client, msg) {
    try {
        console.log(msg);
        const loggingChannel = await client.channels.fetch(process.env.logging_channel_id);
        await loggingChannel.send(msg);
        console.log('channel fetched successfully and log message posted');
    } catch (error) {
        console.log(error);
    }
}

module.exports = { log };