var path = require('path');
var authRouterFunc = require("./auth");

var db = null;

function indexEndpoint(req,res){
    if (req.session.isAuthenticated) {
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
    var que = req.query
    console.log(que)
    var lesson = await db.Lesson.findOne({
        where: {
            lang1: que.lang1,
            lang2: que.lang2,
            num: que.num
        }
    });

    var progresses = await lesson.getUserProgresses({where: {UserId: req.session.user.id}})
    var progress;
    if(progresses.length==0){
        progress = await db.UserProgress.create({currentPage: 1, completed: false}) 
        await req.session.user.addUserProgress(progress)
        await lesson.addUserProgress(progress)
    } else{
        progress = progresses[0]
    }

    var pages = await lesson.getPages({where: {page: progress.currentPage}})
    var page = pages[0]

    var obj = {
        lang1: lesson.lang1,
        lang2: lesson.lang2,
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

