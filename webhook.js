const { WebhookClient } = require('discord.js');
// const { scrape_interval, keywords, webhook_id, webhook_token } = require('./config.json');
const { log } = require('./helpers/log.js');
const { ProductsTable } = require('./helpers/database.js');
const { fetchProductUrls, fetchProduct } = require('./helpers/products.js');
const { postProductEmbed } = require('./helpers/embeds.js');
const { keywordInProductsTable, productInProductsTable, addProductToProductsTable } = require('./helpers/database.js');


const execute = async function execute(client) {
    const webhook_id = process.env.webhook_id;
    const webhook_token = process.env.webhook_token;
    const keywords = [
        'jordan', 'dunk', 'air force 1', 'blazer', 'Yeezy', 'Travis Scott',
        'Off White', 'varsity', 'light grey', 'air max',
    ];
    const scrape_interval = process.env.scrape_interval;

    const hook = new WebhookClient(webhook_id, webhook_token);
    ProductsTable.sync();
    await log(client, 'Webhook program running!');
    main(hook, keywords, client);
    setTimeout(execute, scrape_interval);
};
// execute();

async function main(hook, keywords, client) {
    for (const keyword of keywords) {
        await log(client, '=================\n=================');
        await log(client, `fetching product urls for '${keyword}'...`);
        let productUrls = await fetchProductUrls(keyword);
        productUrls = productUrls.slice(0, 20);
        await log(client, 'product urls fetched');
        if (await keywordInProductsTable(keyword)) {
            for (const url of productUrls) {
                const product = await fetchProduct(url, keyword);
                if (!product) continue;
                if (await productInProductsTable(product)) {
                    continue;
                }
                await addProductToProductsTable(product);
                await postProductEmbed(hook, product);
                await log(client, 'embed posted');
            }
        } else {
            for (const url of productUrls) {
                const product = await fetchProduct(url, keyword);
                if (!product) continue;
                if (await productInProductsTable(product)) {
                    continue;
                }
                await addProductToProductsTable(product);
            }
        }
    }
    await log(client, 'FETCHING COMPLETE!');
}

module.exports = { execute };