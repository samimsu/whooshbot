const fetch = require('node-fetch');
const $ = require('cheerio');
const fs = require('fs');
const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: 'g',
    description: 'google search results',
    async execute(message, args) {
        const query = args.join(' ');
        console.log('query = ', query);
        const googleSearchUrl = 'https://www.google.com/search?q=';
        const queryUrl = googleSearchUrl + query;
        const page = await fetchPage(queryUrl);
        // console.log(page);
        const resultsObj = $('.kCrYT', page);
        // const firstResult = $('.kCrYT', resultsObj);
        // console.log(resultsObj.first().siblings().first().text());
        // console.log(Object.keys(resultsObj.children()));
        // console.log(resultsObj.children()[0]);
        // savePage(resultsObj.parent().html(), `${query.replace(':', ' ')}.html`);
        // savePage(page, `${query.replace(':', ' ')}.html`);
        let resultText = `${resultsObj.first().text()} ${resultsObj.siblings().text()}`
            .replace('Disclaimer', '')
            .replace('View all', '');
        if (!resultText || resultText.length >= 250) resultText = ':warning: Not found.';
        console.log(resultText);
        const embed = new MessageEmbed()
            .setColor('RED')
            .setDescription(resultText);
        message.channel.send(embed);
    },
};

async function fetchPage(url) {
    try {
        console.log(url);
        const res = await fetch(url);
        const page = await res.text();
        console.log(res.status, res.statusText);
        return page;
    } catch (err) {
        console.log(err);
    }
}

function savePage(data, filename) {
    fs.writeFileSync(filename, data);
    console.log('page saved');
}