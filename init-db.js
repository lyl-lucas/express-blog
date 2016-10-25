var User = require('./models/User.js');
User.sync();
console.log('init db ok.');