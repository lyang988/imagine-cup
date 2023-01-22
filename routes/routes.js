var path = require('path');
var authRouterFunc = require("./auth");

var db = null;

async function indexEndpoint(req, res, next){
    if (req.session.isAuthenticated) {
        var lessonPlan = await db.LessonPlan.findByPk(req.session.selectedLessonPlanId);

        if (!lessonPlan) return res.redirect("/changeLanguage");

        var lessons = await lessonPlan.getLessons({
            order: [
                ['unit', 'ASC'],
                ['num', 'ASC']
            ],
            include: {
                model: db.UserProgress,
                where: { userId: req.session.userId },
                required: false
            }
        });

        info = [];
        currentUnit = [];
        previousUnit = 1;
        for (var lesson of lessons) {
            var unit = lesson.unit;
            if (unit !== previousUnit) {
                info.push({unitnumber: previousUnit, unitlessons: currentUnit});
                currentUnit = [];
                previousUnit = unit;
            }

            var completed = false;
            if (lesson.UserProgresses.length !== 0) {
                completed = lesson.UserProgresses[0].completed;
            }

            currentUnit.push({lesson: lesson.name, completed: completed, num: lesson.num});
        }

        if (currentUnit.length !== 0) info.push({unitnumber: unit, unitlessons: currentUnit});

        var obj = {
            "lang1": lessonPlan.lang1,
            "lang2": lessonPlan.lang2,
            "info": info
        };

        res.render('homepage', obj)
    } else {
        res.sendFile('plslogin.html', {root: path.join(__dirname, '../views')});
    }
}

function hbsTest(req,res){
    var obj = {
        hi : "hello",
        abc: "xyz",
        ar: ["a ", "b ", "c"],
        m: {"um": "value", "something": "something else"}
    };

    res.render('hbstest', obj);
}

async function aTest(req, res, next){ 
    if (!req.session.isAuthenticated) {
        return res.redirect('/');
    }

    var que = req.query;

    var lessonPlan = await db.LessonPlan.findOne({
        where: {
            lang1: que.lang1,
            lang2: que.lang2
        }
    });

    if (!lessonPlan) return next(new Error("Lesson plan not found"));

    var lesson = await db.Lesson.findOne({
        where: {
            lessonPlanId: lessonPlan.id,
            num: que.num
        }
    });

    if (!lesson) return next(new Error("Lesson not found"));

    var [progress, created] = await db.UserProgress.findOrCreate({
        where: {
            userId: req.session.userId,
            lessonId: lesson.id
        },
        defaults: {
            currentPage: 1,
            completed: false
        }
    });

    // If it was created, we may have to set "completed" to true if there
    // are no questions
    if (created) {
        var firstQuestion = await db.Question.findOne({
            attributes: ['type'],
            where: {
                lessonId: lesson.id
            }
        });

        if (!firstQuestion) {
            progress.completed = true;
            await progress.save();
        }
    }

    var pages = await lesson.getPages({where: {page: progress.currentPage}});
    if (pages.length !== 1) return next(new Error("Not one page"));

    var page = pages[0];

    var modifiedArr = [];
    for (var elem of page.pageData.arr) {
        if (elem.isquestion) {
            var questionId = elem.questionId;
            var question = await db.Question.findByPk(
                questionId,
                {
                    include: {
                        model: db.UserAnswer,
                        where: {userProgressId: progress.id},
                        required: false
                    }
                }
            );

            if (question === null) return next(new Error("Question not found"));

            var questionData = JSON.parse(question.data);

            if (question.type === "multipleChoice") {
                if (question.UserAnswers.length === 0) {
                    questionData.currentAnswer = null;
                } else if (question.UserAnswers.length === 1) {
                    questionData.currentAnswer = JSON.parse(question.UserAnswers[0].data).answer;
                } else {
                    return next(new Error("Too many answers"));
                }

                var options = [];
                for (var option of questionData.options) {
                    options.push({option: option, questionId: questionId});
                }

                modifiedArr.push({
                    isMultipleChoice: true,
                    questionId: questionId,
                    question: questionData.question,
                    options: options,
                    questionId: questionId,
                    answer: questionData.answer,
                    currentAnswer: questionData.currentAnswer
                });
            } else {
                return next(new Error("Question type not supported"));
            }
        } else {
            modifiedArr.push(elem);
        }
    }

    var obj = {
        lang1: lessonPlan.lang1,
        lang2: lessonPlan.lang2,
        lessonname: lesson.name,
        unitnumber: lesson.unit,
        arr: modifiedArr,
        ideval : ['int multiply() {', '\t// MODIFY CODE FROM HERE;', '\treturn c;','}'],
        json: function(obj) {
            return JSON.stringify(obj);
        }
    };

    res.render('ahhhhh', obj);
}

async function changeLanguage(req, res, next){
    if (!req.session.isAuthenticated) {
        return res.redirect('/');
    }

    var lessonPlans = await db.LessonPlan.findAll();

    var selectedLessonPlans = lessonPlans.filter(lp => lp.id === req.session.selectedLessonPlanId);
    var lang1;
    var lang2;

    if (selectedLessonPlans.length === 0) {
        lang1 = "Please select";
        lang2 = "Please select";
    } else if (selectedLessonPlans.length === 1) {
        lang1 = selectedLessonPlans[0].lang1;
        lang2 = selectedLessonPlans[0].lang2;
    } else {
        return next(new Error("Lesson plan PK not unique"));
    }

    var langMap = {};
    var lang1s = new Set();
    var lang2s = new Set();
    for (var lessonPlan of lessonPlans) {
        if (langMap[lessonPlan.lang1] === undefined) {
            langMap[lessonPlan.lang1] = [];
        }
        langMap[lessonPlan.lang1].push(lessonPlan.lang2);

        lang1s.add(lessonPlan.lang1);
        lang2s.add(lessonPlan.lang2);
    }

    var obj = {
        lang1: lang1,
        lang2: lang2,
        langMap: langMap,
        lang1s: Array.from(lang1s),
        lang2s: Array.from(lang2s),
        json: function(obj) {
            return JSON.stringify(obj);
        }
    };

    // var obj = {
    //     lang1 : "Java",
    //     lang2: "Python",
    //     lang1s: ["Java", "Python", "C++"],
    //     lang2s: ["Java", "Python", "Javascript", "C++", "Fakelanguage1", "lies", "MarinaSha"],
    //     langMap: {"Java": ["Python", "Javascript", "C++"], "Python":["Java", "Fakelanguage1", "lies"], "C++":["Python","MarinaSha"]},
    //     json: function(obj) {
    //         return JSON.stringify(obj);
    //       }
    // };

    res.render('changeLanguage', obj);
}

async function setLanguage(req, res, next) {
    var que = req.query;

    var lessonPlan = await db.LessonPlan.findOne({
        where: {
            lang1: que.lang1,
            lang2: que.lang2
        }
    });

    if (!lessonPlan) return next(new Error("Lesson plan not found"));

    await db.User.update(
        {selectedLessonPlanId: lessonPlan.id},
        {where: {id: req.session.userId}}
    );
    req.session.selectedLessonPlanId = lessonPlan.id;

    res.sendStatus(200);
}

async function updateLessonCompletion(userProgress, question) {
    var questionCount = await db.Question.count({
        where: {
            lessonId: question.lessonId
        }
    });

    var userCorrectAnswerCount = await db.UserAnswer.count({
        where: {
            userProgressId: userProgress.id,
            correct: true
        }
    });

    if (userCorrectAnswerCount !== questionCount) {
        userProgress.completed = false;
    } else {
        userProgress.completed = true;
    }

    await userProgress.save();
}

async function multipleChoiceAnswer(req, res, next) {
    if (!req.session.isAuthenticated) {
        return res.sendStatus(403);
    }

    var que = req.query;

    var question = await db.Question.findByPk(que.questionId);
    if (!question) return next(new Error("Question not found"));
    if (question.type !== "multipleChoice") return next(new Error("Question type not supported"));

    var progress = await db.UserProgress.findOne({
        where: {
            userId: req.session.userId,
            lessonId: question.lessonId
        }
    });
    if (!progress) return next(new Error("Progress not found"));

    var [userAnswer, _] = await db.UserAnswer.findOrCreate({
        where: {
            questionId: question.id,
            userProgressId: progress.id
        },
        defaults: {
            data: '',
            correct: false
        }
    });

    userAnswer.data = JSON.stringify({answer: que.selectedAnswer});
    userAnswer.correct = JSON.parse(question.data).answer === que.selectedAnswer;
    await userAnswer.save();

    await updateLessonCompletion(progress, question);

    if (userAnswer.correct) {
        res.send("Correct answer!");
    } else {
        res.send("Incorrect answer");
    }
}

async function accountPage(req, res, next) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/');
    }

    var user = await db.User.findByPk(req.session.userId);
    if (!user) return next(new Error("User not found"));

    var lessonPlans = await db.LessonPlan.findAll({
        include: {
            model: db.Lesson,
            include: {
                model: db.UserProgress,
                where: {
                    userId: req.session.userId,
                }
            },
            required: true
        }
    });

    var lessonPlanData = await Promise.all(lessonPlans.map(async (lessonPlan) => {
        var lessonCount = await db.Lesson.count({
            where: {
                lessonPlanId: lessonPlan.id
            }
        });

        var completedLessonCount = await db.Lesson.count({
            where: {
                lessonPlanId: lessonPlan.id
            },
            include: {
                model: db.UserProgress,
                where: {
                    userId: req.session.userId,
                    completed: true
                }
            }
        });

        return {lang1: lessonPlan.lang1, lang2: lessonPlan.lang2, completion: Math.round(completedLessonCount / lessonCount * 100)}
    }));

    var obj = {
        user: user.name,
        lessonplans: lessonPlanData
    }

    // var obj = {
    //     user : "atto",
    //     lessonplans: [{lang1: "lang1", lang2: "lang2", completion: 50}, {lang1: "Python", lang2: "Java", completion: 100},]
    // };

    res.render('account', obj);
}

async function deleteAccount(req, res, next) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/');
    }

    var user = await db.User.findByPk(req.session.userId);
    if (!user) return next(new Error("User not found"));

    await user.destroy();

    res.sendStatus(200);
}

module.exports = function(app, dbInjected) {
    db = dbInjected;

    app.use('/auth', authRouterFunc(db));

    app.get("/", indexEndpoint);
    app.get("/hbsTest", hbsTest);
    app.get("/lesson", aTest);
    app.get("/changeLanguage", changeLanguage);
    app.get("/setLanguage", setLanguage);
    app.get("/accountPage", accountPage);
    app.get("/multipleChoiceAnswer", multipleChoiceAnswer);
    app.get("/test", function(req, res){res.sendFile("views/test.html", {root: __dirname + "/../"})})

    app.post("/deleteAccount", deleteAccount);

    app.get("/*", function(req,res){
        res.send("Not a valid page");
    });
}

