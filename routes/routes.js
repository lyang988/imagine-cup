var path = require('path');
var authRouterFunc = require("./auth");

var db = null;

async function indexEndpoint(req, res, next){
    if (req.session.isAuthenticated) {
        var lessonPlan = await db.LessonPlan.findByPk(req.session.selectedLessonPlanId);

        var obj = {
            "lang1": "Python",
            "lang2": "Java",
            "info":[
                {"unitnumber": 1, "unitlessons": [{"lesson":"Semicolons and Brackets", "completed": true, "num":1}, {"lesson":"Simple Datatypes: Ints", "completed": false, "num":2}]},
                {"unitnumber": 2, "unitlessons": [{"lesson":"Printing Simple Strings", "completed": false, "num":3}, {"lesson":"Doubles Floats and Longs", "completed": false, "num":4}]}
            ]
        }
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

    var progresses = await lesson.getUserProgresses({where: {UserId: req.session.userId}});
    var progress;
    if(progresses.length === 0){
        progress = await db.UserProgress.create({currentPage: 1, completed: false});
        user = await db.User.findByPk(req.session.userId);
        await user.addUserProgress(progress);
        await lesson.addUserProgress(progress);
    } else if (progresses.length === 1) {
        progress = progresses[0];
    } else {
        return next(new Error("Too many progresses"));
    }

    var pages = await lesson.getPages({where: {page: progress.currentPage}});
    if (pages.length !== 1) return next(new Error("Not one page"));

    var page = pages[0];

    var obj = {
        lang1: lessonPlan.lang1,
        lang2: lessonPlan.lang2,
        lessonname: lesson.name,
        unitnumber: lesson.unit,
        arr: page.pageData.arr
    };

    res.render('ahhhhh', obj);
}

module.exports = function(app, dbInjected) {
    db = dbInjected;

    app.use('/auth', authRouterFunc(db));

    app.get("/", indexEndpoint);
    app.get("/hbsTest", hbsTest);
    app.get("/aTest", aTest);

    app.get("/*", function(req,res){
        res.send("Not a valid page");
    });
}

