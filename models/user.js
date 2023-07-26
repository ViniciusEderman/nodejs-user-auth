const Sequelize = require('sequelize');
const db = require('./db');

// model user
const User = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

const verifyTable = async () => {
    try {
      const tableExists = await db.queryInterface.showAllTables();
      const tableName = 'users';
      
      if(!tableExists.some((table) => table === tableName)) {
        await User.sync();
        console.log('Table created.');
      } else {
          console.log('Table already exists.');
        }
    } catch (err) {
        console.log('error: ' + err);
    }   
}

verifyTable();

module.exports = User;
