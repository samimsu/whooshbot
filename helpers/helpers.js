const Sequelize = require('sequelize');

function initializeDB() {
    const sequelize = new Sequelize('database', 'user', 'password', {
        host: 'localhost',
        dialect: 'sqlite',
        logging: false,
        storage: 'database.sqlite',
    });
    const Products = sequelize.define('products', {
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
    Products.sync();
}
// function isKeywordInDatabase(keyword) { return true / false }

// if isKeywordInDatabase(keyword) postProductEmbed(product)
// else addProductToDatabase(product);

module.exports = {
    initializeDB,
    // isKeywordInDatabase,
};