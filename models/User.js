const db = require('../db');

module.exports = db.defineModel('users', {
    email: {
        type: db.STRING(100),
        unique: true
    },
    password: db.STRING(100)
});


// ,{
//     emailExists: function(email){
//         this.findOne({
//             'where':{email: email}
//         }).then(function(u){
//             return rep.;
//         })
// }}