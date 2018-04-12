const fs = require('fs');
const express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// MongoDB Stuff
var mongoose = require('mongoose');
var url = 'mongodb://user:user@ds137207.mlab.com:37207/notesdb34';

mongoose.connect(url, function(error) {
    if (error){
        console.log("Sorry something happened: " + error);
    } else {
        console.log("Connected to MongoDB database.")
    }
});

var Schema = mongoose.model('Notes', {
    notes: String
});

// Express 'Routes'
app.use('/client', express.static('client/'));
app.use('/js', express.static('client/js'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
http.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});

app.get('/getNotes', function (request, result) {
    console.log("Data requested, and sent.");
    
    Schema.find({}, function (error, notes) {
            if (error) {
                console.log("Sorry we had issues searching the database: " + error)
            } else {
                result.send(notes);
            }
        });
});

app.post('/deleteNote', function (request, result) {
    console.log(request.body);
});

app.post('/submitNote', function (request, result) {
    console.log(request.body);
    
    var newNote = Schema(request.body);
    newNote.save(function (error) {
    if (error) {
        console.log("Sorry the document was not saved: " + error);
    } else {
        console.log("Document was saved!");
        
        Schema.find({}, function (error, notes) {
            if (error) {
                console.log("Sorry we had issues searching the database: " + error)
            } else {
                io.emit('important', notes);
            }
        });
    }
});
    
    result.send(200);
});

console.log("hello");