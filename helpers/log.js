async function log(client, msg) {
    const loggingChannel = await client.channels.fetch(process.env.logging_channel_id);
    loggingChannel.send(msg);
    return;
}

module.exports = { log };