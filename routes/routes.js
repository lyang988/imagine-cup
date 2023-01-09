var path = require('path');
var authRouterFunc = require("./auth");

var db = null;

function indexEndpoint(req,res){
    if (req.session.isAuthenticated) {
        res.sendFile('homepage.html', {root: path.join(__dirname, '../views')});
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
    var pages = await db.Page.findAll({
        include: {
            model: db.Lesson
        }
    });

    var obj = {
        lang1: pages[0].Lesson.lang1,
        lang2: pages[0].Lesson.lang2,
        lessonname: pages[0].Lesson.name,
        unitnumber: pages[0].Lesson.unit,
        arr: pages[0].pageData.arr
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

