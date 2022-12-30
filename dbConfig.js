const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('salmon', 'azureadmin', process.env.SQL_PASSWORD, {
    host: 'llyaal.mysql.database.azure.com',
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            require: true
        }
    }
});

sequelize.authenticate().then(() => {
    console.log('Database connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

module.exports = sequelize;
