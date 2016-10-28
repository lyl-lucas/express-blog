const db = require('./db');
var User = require('./models/User.js');
db.sync();
console.log('init db ok.');