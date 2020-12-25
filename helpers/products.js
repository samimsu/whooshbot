const fetch = require('node-fetch');
const $ = require('cheerio');

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

async function fetchResultsPage(keyword) {
    const searchQuery = keyword.split(' ').join('+');
    const searchUrl = `https://www.sivasdescalzo.com/en/catalogsearch/result/?q=${searchQuery}`;
    const resultsPage = await fetchPage(searchUrl);
    return resultsPage;
}

async function fetchProductUrls(keyword) {
    const resultsPage = await fetchResultsPage(keyword);
    const messageNotice = hasMessageNotice(resultsPage);
    if (messageNotice) return console.log(messageNotice);
    const productPage = isProductPage(resultsPage);
    if (productPage) return [productPage];
    const productsObj = $('.product-item', resultsPage);
    const productUrlsObj = $('.product-item-info > a[href]', productsObj);
    const productUrls = [];
    for (let i = 0; i < productUrlsObj.length; i++) {
        productUrls.push(productUrlsObj[i].attribs.href);
    }
    return productUrls;
}

async function fetchProduct(productUrl, keyword) {
    const productPage = await fetchPage(productUrl);
    try {
        const productSummaryObj = $('.product-content-wrapper', productPage);
        const image = $('img', productPage)[0].attribs.src;
        const productId = $('li[data-attribute="sku"]', productPage).text().trim();
        const model = $('.product-data__model', productPage).text().trim();
        const brand = $('.product-data__brand-name', productPage).text().trim();
        const color = $('li[data-attribute="colorway"]', productPage).text().trim();
        const price = $('.product-data__price', productSummaryObj).text().trim().split(' ')[0];
        const oldPrice = $('.old-price', productSummaryObj).text().trim();
        const sizes = getSizes('script[type="text/x-magento-init"]', productPage);
        const productData = {
            productId: productId,
            productUrl: productUrl,
            model: model,
            brand: brand,
            color: color,
            price: price,
            oldPrice: oldPrice,
            sizes: sizes,
            imgUrl: image,
            keywords: keyword,
        };
        return productData;
    } catch (e) {
        console.log(`--- ${e} ---`);
    }
}

function hasMessageNotice(page) {
    const noticeMessageObj = $('.notice', page);
    const noticeMessage = noticeMessageObj.text();
    return noticeMessage.length ? noticeMessage : false;
}

function isProductPage(page) {
    const pageTypeObj = $('meta[property="og:type"]', page);
    if (!pageTypeObj.length) return false;
    const content = pageTypeObj[0].attribs.content;
    const pageUrlObj = $('meta[property="og:url"]', page);
    const url = pageUrlObj[0].attribs.content;
    return content.length ? url : false;
}

function getSizes(selector, context) {
    const tags = $(selector, context);
    const sizes = [];
    for (let j = 0; j < tags.length; j++) {
        const data = JSON.parse(tags[j].children[0].data.trim());
        const key = Object.keys(data)[0];
        if (key === '[data-role=swatch-options]') {
            const euSizes = data[key]['Svd_Catalog/js/svd.swatch.renderer']['jsonSwatchConfig'].map(size => size.eu).sort();
            const attribsObj = data[key]['Magento_Swatches/js/swatch-renderer']['jsonConfig']['attributes'];
            const attribsFirstKey = Object.keys(attribsObj)[0];
            const options = attribsObj[attribsFirstKey].options;
            for (const index in options) {
                const size = {
                    label: euSizes[index] ? euSizes[index] : options[index].label,
                    available: options[index].products.length ? true : false,
                };
                sizes.push(size);
            }
        }
    }
    return sizes;
}

module.exports = {
    fetchProductUrls,
    fetchProduct,
};