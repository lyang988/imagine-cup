var express = require('express');
var app = express();
var mysql = require('mysql');
var path = require('path')

const { appendFile } = require('fs');
const http = require('http');

require('./routes/routes')(app);

app.set('views', __dirname + '/views')
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