var path = require('path');
var authRouter = require("./auth");

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

function aTest(req,res){
    var obj = {
        lang1: "Python",
        lang2: "Java",
        lessonname: "Semicolons and Brackets",
        unitnumber: "1",
        arr: [{"type": "regular", "text": "Here are two functions that print the bigger of the two arguments:"},
              {"iscode":true,"type": "code", "text": "def print_bigger(a, b):\n    if a > b:\n        print(a)\n    else:\n        print(b)"},
              {"iscode":true,"type": "code", "text": "import java.io.*;\n\nvoid printBigger(int a, int b){\n    if (a > b) {\n        System.out.println(a); \n    } else {\n        System.out.println(b); \n    } \n}"},
              {"type": "regular", "text": "Notice that the overall structure of the code is very similar, but the specific syntax is quite different. For instance, instead of using colons and indentation, Java uses curly brackets ("},
              {"type": "codetext", "text": "{"},
              {"type": "regular", "text": ", "},
              {"type": "codetext", "text": "}"},
              {"type": "regular", "text": ") to specify function and if-statement bodies. Also, statements in Java end in a semicolon ("},
              {"type": "codetext", "text": ";"},
              {"type": "regular", "text": "). There are some other big differences that we will explore soon, but these two are the most visible - and easy to forget!"},
              {"istable":true, "type": "table", "array": [{" ":"Code Blocks and Control Flow","Python":"Use colons and indentation","Java":"Use opening and closing curly brackets: {, }"},
              {" ":"Semicolons Ending Statements","Python":"Unnecessary (and proscribed)","Java":"Necessary"}
              ]}
        ]
     };     
    

    res.render('ahhhhh', obj);
}

module.exports = function(app){
    app.use('/auth', authRouter);

    app.get("/", indexEndpoint);
    app.get("/hbsTest", hbsTest);
    app.get("/aTest", aTest);

    app.get("/*", function(req,res){
        res.send("Not a valid page");
    });
}

