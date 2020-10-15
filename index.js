const fs = require('fs');
const Discord = require('discord.js');
const fetch = require('node-fetch');
const $ = require('cheerio');

const client = new Discord.Client();

client.once('ready', () => {
    console.log('Logged in as', client.user.tag);

    let count = 0;
    const scrapeInterval = process.env.scrape_interval;
    const main = async function main() {
        const nikeFeed = JSON.parse(fs.readFileSync('./nike-feed.json'));
        count++;
        console.log('Count = ', count);
        const channel = await client.channels.fetch(process.env.posting_channel_id);
        const embed = new Discord.MessageEmbed();
        console.log('scraping...');
        const productData = await nikeComScrape();
        if (productData.length) {
            console.log('scrape completed!');
            for (const product of[...productData].reverse()) {
                if (nikeFeed.map(prod => prod.image).includes(product.image)) {
                    console.log(`EXISTS: ${product.title} (${product.desc})`);
                } else {
                    nikeFeed.push(product);
                    embed.setTitle(product.title);
                    embed.setURL(product.link);
                    embed.setDescription(product.desc);
                    embed.setImage(product.image);
                    await channel.send(embed);
                    console.log(`POSTED: ${product.title} (${product.desc})`);
                }
            }
            fs.writeFileSync('./nike-feed.json', JSON.stringify(nikeFeed, null, 4));
            console.log('nike-feed.json created!');
        } else {
            console.log('scrape aborted!');
        }
        setTimeout(main, scrapeInterval);
    };
    main();
});

client.login(process.env.token);

async function nikeComScrape() {
    const url = 'https://www.nike.com/my/launch';
    const productData = [];
    try {
        let res = await fetch(url);
        let body = await res.text();
        const products = $('.product-card', body);
        const links = $('.card-link', products);
        const captions = $('.copy-container', products);
        const titles = $('.headline-5', captions);
        const descs = $('.headline-3', captions);
        for (let i = 0; i < captions.length; i++) {
            const link = `https://www.nike.com${links[i].attribs.href}`;
            res = await fetch(link);
            body = await res.text();
            const img = $('meta[property="og:image"]', body);
            const data = {
                title: titles[i].children[0].data,
                desc: descs[i].children[0].data,
                link: link,
                image: img[0].attribs.content,
            };
            productData.push(data);
        }
    } catch (err) {
        console.log(err);
    }
    return productData;
}
