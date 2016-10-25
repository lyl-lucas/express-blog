var express = require('express');
var User = require('../models/User');


/* GET home page. */
module.exports = function(app){
    app.get('/', function(req, res) {
        console.log('start.....');
        res.render('index.html',{name:'jack'});
    });

} 
