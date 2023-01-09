var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');

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
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname,'static')));

require('./routes/routes')(app);

// -------------- listener -------------- //
// // The listener is what keeps node 'alive.' 

var listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0", function() {
    console.log("Express server started");
});