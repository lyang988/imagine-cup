var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var authRouter = require('./routes/auth');

var app = express();
var path = require('path');

const { appendFile } = require('fs');
const http = require('http');

const sequelize = require('./dbConfig');
  
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

require('./routes/routes')(app);
app.use('/auth', authRouter);

app.set('views', __dirname + '/views');
// Default Catch 
app.get("/*", function(req,res){
    res.send("Not a valid page");
})

app.use(express.static(path.join(__dirname,'static')))

// -------------- listener -------------- //
// // The listener is what keeps node 'alive.' 

var listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0", function() {
    console.log("Express server started");
});