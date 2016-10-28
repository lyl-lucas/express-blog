var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var passport = require('passport');
var User = require('../models/User');

// 渲染注册表单
router.post('/register', function(req, res) {
    var 
        username = req.body.username,
        email = req.body.email,
        password = req.body.password,
        md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    User.create({
        username: username,
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

// 验证注册邮箱和用户名ajax使用(jquery-validation)
router.get('/validate/:field', function(req, res){
    let query={},
        field = req.params.field;
    query[field]=req.query[field];
    res.status(200);
    res.set("Content-Type", "application/json");
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");    
    User.findOne({
        'where':query
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
    res.render('register.html',{
      github : req.session.github
    });
});


// 登录表单
router.get('/login',function(req, res){
    res.render('login.html',{github:req.session.github});
});

// 提交登录表单
router.post('/login',function(req, res){
    var 
        email = req.body.email,
        password = req.body.password,
        remember = req.body.remember;
        console.log(email);
    User.findOne({
        'where':{
            email: email
        }
    }).then(function(user){
        if(user.verifyPassword(password)){
            if(!remember){
                req.session.cookie.expires = false;
            };
            // 是否需要绑定
            if(req.session.github){
                if(user.github){
                    req.flash('flash_error', '该用户已绑定github账号');
                    res.redirect('login'); // 登录失败
                }else{
                    user.github = req.session.github;
                    user.save().then(function(user){
                    return null;
                    });
                    req.session.github = null;
                }            
            }
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

router.get("/github", passport.authenticate("github", {session: false}));
router.get("/github/callback", passport.authenticate("github", {
  session: false,
  failureRedirect: '/auth/login',
  successFlash: '登录成功'
}), function (req, res) {
  let github = req.user.profileUrl;
  User.findOne({
      where:{
          github: github,
      }
  }).then(function(user){
      if(user){
          req.session.user = user; //把用户信息存入session
          req.flash('flash_success', '登录成功');
          res.redirect('/'); // 登录成功,返回主页
      };
      req.session.github = github;
      req.flash('flash_success', '登录成功,请完善用户信息');
      res.redirect('/auth/profile'); // 重定向到填写用户信息路由
  })
});

router.get('/profile',function(req, res){
    res.render('bind-profile.html')
});

router.post('/profile', function(req, res){
    var 
        username = req.body.username,
        email = req.body.email,
        password = req.body.password,
        md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    User.create({
        username: username,
        email: email,
        password: password,
        github: req.session.github //创建新用户,并绑定github
    }).then(function (u){
        console.log('created.' + JSON.stringify(u));
        //req.session.user = newUser; // 用户信息存入 session
        req.flash('flash_success', '绑定成功!');
        req.session.github = null;
        req.session.user = user;
        res.redirect('／');//绑定成功后,转到首页
    }).catch(function (err){
        console.log('failed:' + err);
        req.flash('flash_error','不明原因绑定失败,请重试');
        return res.redirect('register');
    });
})


router.get('/logout',function(req, res){
    req.session.user = null;
    req.flash('flash_success','登出成功');
    res.redirect('/');
});



module.exports = router;
