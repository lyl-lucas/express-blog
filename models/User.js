const db = require('../db');
var crypto = require('crypto');

module.exports = db.defineModel('users', {
    username:{
        type: db.STRING(100),
        unique: true
    },
    email: {
        type: db.STRING(100),
        unique: true
    },
    password: db.STRING(100),
    github: {
        type: db.STRING(100),
        allowNull: true,
        unique: true
    }
},{},{
    verifyPassword: function(password){
        let md5 = crypto.createHash('md5'),
            password_md5 = md5.update(password).digest('hex');
        return this.password === password_md5;
    }
});


// ,{
//     emailExists: function(email){
//         this.findOne({
//             'where':{email: email}
//         }).then(function(u){
//             return rep.;
//         })
// }}