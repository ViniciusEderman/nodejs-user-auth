const Sequelize = require('sequelize');
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
});

sequelize.authenticate().then(() => {
    console.log('db running');
}).catch((error) => {
    console.log('error: ' + error);
})

module.exports = sequelize;
