const Sequelize = require('sequelize');
require('dotenv').config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: "localhost",
    dialect: "mysql"
});

sequelize.authenticate().then(() => {
    console.log('db running');
}).catch((error) => {
    console.log('error: ' + error);
})

module.exports = sequelize;
