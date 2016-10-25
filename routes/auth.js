var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/User');

// 渲染注册表单
router.post('/register', function(req, res) {
    var 
        email = req.body.email,
        password = req.body.password,
        md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    User.create({
        email: email,
        password: password
    }).then(function (u){
        console.log('created.' + JSON.stringify(u));
        //req.session.user = newUser; // 用户信息存入 session
        req.flash('flash_success', '注册成功!');
        res.redirect('login');//注册成功后,转到登录页面
    }).catch(function (err){
        console.log('failed:' + err);
        req.flash('flash_error','不明原因注册失败,请重试');
        return res.redirect('register');
    });
});

// 验证注册邮箱ajax使用
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
    var email = req.body.email,
        password = req.body.password;
    User.findOne({
        'where':{
            email: email
        }
    }).then(function(user){
        if(user.verifyPassword(password)){
            req.session.user = user; //把用户信息存入session
            req.flash('flash_success', '登录成功');
            res.redirect('/'); // 登录成功,返回主页
        } else {
            req.flash('flash_error', '用户名或密码错误');
            res.redirect('login'); // 登录失败
        }
    }).catch(function(err){
        console.log(err);
        req.flash('flash_error', '用户名或密码错误');
        res.redirect('login'); // 登录失败
    })
});


router.get('/logout',function(req, res){
    req.session.user = null;
    req.flash('flash_success','登出成功');
    res.redirect('/');
})


module.exports = router;
