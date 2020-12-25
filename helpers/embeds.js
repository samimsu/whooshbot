const { MessageEmbed } = require('discord.js');

async function postProductEmbed(hook, product) {
    const embed = await getProductEmbed(product);
    hook.send(embed);
    console.log(`${product.productId} embed posted.`);
    return;
}

async function getProductEmbed(product) {
    const oldPriceDesc = product.oldPrice ? ` ~~${product.oldPrice}~~` : '';
    const sizesDesc = getSizesDesc(product.sizes);
    const img = await downloadImage(product.imgUrl, 'product');

    const embed = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${product.model} - ${product.brand} - ${product.color}`)
        .setDescription(`\`${product.productId}\``)
        .addField('Site', '[sivasdescalzo](https://www.sivasdescalzo.com)', true)
        .addField('Price', `${product.price}${oldPriceDesc}`, true)
        .addField('Sizes', sizesDesc)
        .attachFiles(img)
        .setThumbnail(`attachment://${img}`)
        .setURL(product.productUrl);
    return embed;
}

function getSizesDesc(sizes) {
    if (!sizes.length) return 'No sizes found.';
    let sizeDesc = '';
    for (const size of sizes) {
        if (size.available) {
            sizeDesc += `${size.label} `;
        } else {
            sizeDesc += `~~${size.label}~~ `;
        }
    }
    return sizeDesc.trim();
}

async function downloadImage(imgUrl, filename) {
    const download = require('image-downloader');
    const options = {
        url: imgUrl,
        dest: `${filename.trim().replace(' ', '-')}.jpg`,
    };
    try {
        const file = await download.image(options);
        return file.filename;
    } catch (err) {
        console.error(err);
    }
}

module.exports = { postProductEmbed };