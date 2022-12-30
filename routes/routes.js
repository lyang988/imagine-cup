var path = require('path');
login = require("./login");
var viewpath = path.join(__dirname, "../views")
module.exports =  function(app){
    app.get("/abc", login.abc)
    app.get("/def", login.def)

    app.get("/", function(req,res){
        res.sendFile(path.join(viewpath, 'homepage.html'));
    })
}
