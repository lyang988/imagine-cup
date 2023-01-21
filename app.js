var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var hbs = require('express-handlebars')

require('dotenv').config();

var app = express();
var path = require('path');

const { appendFile } = require('fs');
const http = require('http');

const db = require('./dbConfig');
const test = require('./test');

db.sequelize.authenticate().then(() => {
    console.log("Database connected");
    db.sequelize.sync({force: true}).then(() => {
        console.log("Database synced");

        var lessonPlanPromise = Promise.all(
            test.lessonPlans.map(async (lessonPlan) => {
                await db.LessonPlan.create(lessonPlan);
            })
        );

        lessonPlanPromise.then((_) => {
            var lessonPromises = Promise.all(
                test.lessons.map(async (lesson) => {
                    var dbLesson = await db.Lesson.create(lesson.lesson);
                    var dbLessonPlan = await db.LessonPlan.findOne({where: lesson.lessonPlan});
                    await dbLessonPlan.addLesson(dbLesson);
                })
            );

            lessonPromises.then((_) => {
                var pagePromises = Promise.all(
                    test.pages.map(async (page) => {
                        var dbPage = await db.Page.create(page.page);
                        var dbLesson = await db.Lesson.findOne({where: {name: page.lessonName}});
                        await dbLesson.addPage(dbPage);
                    })
                );

                pagePromises.then((_) => {
                    var questionPromises = Promise.all(
                        test.questions.map(async (question) => {
                            var dbQuestion = await db.Question.create(question.question);
                            var dbLesson = await db.Lesson.findOne({where: {name: question.lessonName}});
                            await dbLesson.addQuestion(dbQuestion);
                        })
                    );

                    questionPromises.then((_) => {
                        console.log("Done");
                    }).catch((err) => {
                        console.log("Unable to create questions: " + err);
                    });
                }).catch((err) => {
                    console.log("Unable to create pages: " + err);
                });
            }).catch((err) => {
                console.log("Unable to create lessons: " + err);
            });
        }).catch((err) => {
            console.log("Unable to create lesson plans: " + err);
        });
    }).catch((err) => {
        console.log("Error syncing database: " + err);
    });
}).catch((err) => {
    console.log("Error connecting to database: " + err);
});
  
app.set("trust proxy", process.env.NODE_ENV === "production");

app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
    }
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname,'static')));

  app.set('view engine', 'hbs');

require('./routes/routes')(app, db);

// -------------- listener -------------- //
// // The listener is what keeps node 'alive.' 

var listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0", function() {
    console.log("Express server started");
});