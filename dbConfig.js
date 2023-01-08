const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('salmon', 'azureadmin', process.env.SQL_PASSWORD, {
    host: 'llyaal.mysql.database.azure.com',
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            require: true
        }
    }
});

const Page = sequelize.define('Page', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    page: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pageData: {
        type: DataTypes.JSON,
        allowNull: false
    }
});

const Lesson = sequelize.define('Lesson', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    lang1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lang2: {
        type: DataTypes.STRING,
        allowNull: false
    },
    unit: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Lesson.hasMany(Page, {foreignKey: 'lessonId'});

module.exports = {sequelize: sequelize, Page: Page, Lesson: Lesson};
