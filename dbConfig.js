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

const LessonPlan = sequelize.define('LessonPlan', {
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
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['lang1', 'lang2']
            }
        ]
    }
);

const Lesson = sequelize.define('Lesson', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        unit: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        num: { 
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
    }
);

LessonPlan.hasMany(Lesson, {foreignKey: 'lessonPlanId'});
Lesson.belongsTo(LessonPlan, {foreignKey: 'lessonPlanId'}, {onDelete: 'CASCADE'});

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

Lesson.hasMany(Page, {foreignKey: 'lessonId'});
Page.belongsTo(Lesson, {foreignKey: 'lessonId', onDelete: 'CASCADE'});

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

LessonPlan.hasMany(User, {foreignKey: 'selectedLessonPlanId'});
User.belongsTo(LessonPlan, {foreignKey: 'selectedLessonPlanId'});

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

User.hasMany(UserProgress, {foreignKey: 'userId'});
UserProgress.belongsTo(User, {foreignKey: 'userId', onDelete: 'CASCADE'});

Lesson.hasMany(UserProgress, {foreignKey: 'lessonId'});
UserProgress.belongsTo(Lesson, {foreignKey: 'lessonId', onDelete: 'CASCADE'});

const Question = sequelize.define('Question', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    type: {
        type: DataTypes.ENUM("multipleChoice", "code"),
        allowNull: false
    },
    data: {
        type: DataTypes.JSON,
        allowNull: false
    }
});

Lesson.hasMany(Question, {foreignKey: 'lessonId'});
Question.belongsTo(Lesson, {foreignKey: 'lessonId', onDelete: 'CASCADE'});

const UserAnswer = sequelize.define('UserAnswer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    data: {
        type: DataTypes.JSON,
        allowNull: false
    },
    correct: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

UserProgress.hasMany(UserAnswer, {foreignKey: 'userProgressId'});
UserAnswer.belongsTo(UserProgress, {foreignKey: 'userProgressId', onDelete: 'CASCADE'});

Question.hasMany(UserAnswer, {foreignKey: 'questionId'});
UserAnswer.belongsTo(Question, {foreignKey: 'questionId', onDelete: 'CASCADE'});

module.exports = {
    sequelize: sequelize,
    LessonPlan: LessonPlan,
    Lesson: Lesson,
    Page: Page,
    User: User,
    UserProgress: UserProgress,
    Question: Question,
    UserAnswer: UserAnswer
};
