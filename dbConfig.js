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
        allowNull: false,
        validate: {
            min: 1
        }
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
            allowNull: false,
            validate: {
                min: 1
            }
        },
        num:{ 
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        numPages: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        }
    },
    {
        indexes: [
            {
                unique: false,
                fields: ['lang1', 'lang2']
            }
        ]
    }
);

Lesson.hasMany(Page, {foreignKey: 'lessonId'});
Page.belongsTo(Lesson, {foreignKey: 'lessonId'});

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    msAccountId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

const UserProgress = sequelize.define('UserProgress', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    currentPage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
        }
    },
    completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
});

User.hasMany(UserProgress);
UserProgress.belongsTo(User);

Lesson.hasMany(UserProgress);
UserProgress.belongsTo(Lesson);

module.exports = {
    sequelize: sequelize,
    Page: Page,
    Lesson: Lesson,
    User: User,
    UserProgress: UserProgress
};
