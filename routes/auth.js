var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/User');

// 渲染注册表单
router.post('/register', function(req, res) {
    var 
        email = req.body.email,
        password = req.body.password;
    // 检验用户两次输入的密码是否一致,交给前端处理
    // if (password_re != password) {
    //     req.flash('error', '两次输入的密码不一致!'); 
    //     return res.redirect('/reg');//返回注册页
    // };
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    User.create({
        email: email,
        password: password
    }).then(function (u){
        console.log('created.' + JSON.stringify(u));
        //req.session.user = newUser; // 用户信息存入 session
        req.flash('flash_success', '注册成功!');
        res.redirect('/');//注册成功后,转到登录页面
    }).catch(function (err){
        console.log('failed:' + err);
        req.flash('flash_error','注册失败');
        return res.redirect('/');
    });
});

router.get('/validate', function(req, res){
    let email = req.query.email;
    res.status(200);
    res.set("Content-Type", "application/json");
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");    
    User.findOne({
        'where':{
            'email':email
        }
    }).then(function (u){
        if(u){
            res.send(false);
        } else {
            res.send(true);
        }
    })

});

// 提交注册表单,申请了两回？
router.get('/register', function(req, res) {
    res.render('register.html');
});


// 登录表单
router.get('/login',function(req, res){
    res.render('login.html')
});

// 提交登录表单
router.post('/login',function(req, res){

});




module.exports = router;
