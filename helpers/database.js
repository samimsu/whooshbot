const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const ProductsTable = sequelize.define('products', {
    product_id: {
        type: Sequelize.STRING,
        unique: true,
    },
    product_url: Sequelize.STRING,
    model: Sequelize.STRING,
    brand: Sequelize.STRING,
    color: Sequelize.STRING,
    price: Sequelize.STRING,
    old_price: Sequelize.STRING,
    sizes: Sequelize.STRING,
    img_url: Sequelize.STRING,
    keywords: Sequelize.STRING,
});

async function keywordInProductsTable(keyword) {
    const productData = await ProductsTable.findOne({ where: { keywords: keyword } });
    if (productData) return true;
    return false;
}

async function productInProductsTable(product) {
    try {
        const productData = await ProductsTable.findOne({ where: { product_id: product.productId } });
        if (!productData) return false;
        const productDb = {
            productId: productData.get('product_id'),
            productUrl: productData.get('product_url'),
            model: productData.get('model'),
            brand: productData.get('brand'),
            color: productData.get('color'),
            price: productData.get('price'),
            oldPrice: productData.get('old_price'),
            sizes: productData.get('sizes'),
            imgUrl: productData.get('img_url'),
            keywords: productData.get('keywords'),
        };
        product.sizes = product.sizes.map(size => size.label).join(' ');
        return Object.values(productDb).join('') === Object.values(product).join('');
    } catch (e) {
        console.log(e);
    }
}

async function addProductToProductsTable(productData) {
    try {
        await ProductsTable.create({
            product_id: productData.productId,
            product_url: productData.productUrl,
            model: productData.model,
            brand: productData.brand,
            category: productData.category,
            color: productData.color,
            price: productData.price,
            old_price: productData.oldPrice,
            sizes: productData.sizes ? productData.sizes.map(size => size.label).join(' ') : 'No sizes found.',
            img_url: productData.imgUrl,
            keywords: productData.keywords,
        });
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            console.log('product already exists in database, attempting update...');
            return await updateProductInProductsTable(productData);
        }
        return console.log('Something went wrong with adding a product.', e);
    }
}

async function updateProductInProductsTable(productData) {
    try {
        await ProductsTable.update({
            product_id: productData.productId,
            product_url: productData.productUrl,
            model: productData.model,
            brand: productData.brand,
            category: productData.category,
            color: productData.color,
            price: productData.price,
            old_price: productData.oldPrice,
            sizes: productData.sizes,
            img_url: productData.imgUrl,
        }, { where: { product_id: productData.productId } });
        return console.log(`Product ${productData.productId} updated in database.`);
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return;
        }
        return console.log('Something went wrong with updating the product.', e);
    }
}

module.exports = {
    ProductsTable,
    keywordInProductsTable,
    productInProductsTable,
    addProductToProductsTable,
};