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

db.sequelize.authenticate().then(() => {
    console.log("Database connected");
    db.sequelize.sync({force: true}).then(() => {
        console.log("Database synced");
        db.LessonPlan.create({
            lang1: "Python",
            lang2: "Java"
        }).then((lessonPlan) => {
            db.Lesson.create({
                lessonPlanId: lessonPlan.id,
                unit: 1,
                num: 1,
                name: "Semicolons and Brackets",
                numPages: 1
            }).then((lesson) => {
                db.Page.create({
                    page: 1,
                    pageData: { arr:
                        [{"type": "regular", "text": "Here are two functions that print the bigger of the two arguments: (Top- Python, Bottom- Java)"},
                {"iscode":true,"language": "python","type": "code", "text": "def print_bigger(a, b):\n    if a > b:\n        print(a)\n    else:\n        print(b)"},
                {"iscode":true,"language": "java","type": "code", "text": "import java.io.*;\n\nvoid printBigger(int a, int b){\n    if (a > b) {\n        System.out.println(a); \n    } else {\n        System.out.println(b); \n    } \n}"},
                {"type": "regular", "text": "Notice that the overall structure of the code is very similar, but the specific syntax is quite different. For instance, instead of using colons and indentation, Java uses curly brackets ("},
                {"iscodetext":true,"language": "java","type": "codetext", "text": "{"},
                {"type": "regular", "text": ", "},
                {"iscodetext":true,"language": "java", "type": "codetext", "text": "}"},
                {"type": "regular", "text": ") to specify function and if-statement bodies. Also, statements in Java end in a semicolon ("},
                {"iscodetext":true,"language": "java","type": "codetext", "text": ";"},
                {"type": "regular", "text": "). There are some other big differences that we will explore soon, but these two are the most visible - and easy to forget!\n "},
                {"islinebreak": true, "type": "linebreak"},
                {"isquestion": true, "questionId": 1},
                {"istable":true, "type": "table", "array": [{" ":"Code Blocks and Control Flow","Python":"Use colons and indentation","Java":"Use opening and closing curly brackets: {, }"},
                {" ":"Semicolons Ending Statements","Python":"Unnecessary (and proscribed)","Java":"Necessary"}
                ]}
            ]
                    },
                    lessonId: lesson.id
                }).then((page) => {
                    db.Question.create({
                        type: "multipleChoice",
                        data: JSON.stringify({
                            question: "The answer is A",
                            options: ["A", "B", "C", "D"],
                            answer: "A"
                        }),
                        lessonId: lesson.id
                    }).then((question) => {
                        console.log("Question created");
                    }).catch((err) => {
                        console.log("Error creating question: " + err);
                    });
                }).catch((err) => {
                    console.log("Error creating page: " + err);
                });
            }).catch((err) => {
                console.log("Error creating lesson: " + err);
            });
        }).catch((err) => {
            console.log("Error creating lesson plan: " + err);
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