# express-blog
express + mysql + sequelize + jquery-validation + nunjucks + bootstrap

##运行
```
$ npm install
$ node init-db.js //初始化数据库
$ node app.js
```
##10月25日
###文件简介
- `config.js`保存数据库和cookie等相关配置
- `db.js`对model定义进行规范
- `init-db.js`初始化数据库,当model有修改时,目前只有User一个模型,所以还没有进行自动化
- `routes/auth.js`认证路由注册

###注册登录功能
- 使用jquery-validation对注册信息的填写进行检查,并通过remote和`auth/validate`交互来确认邮箱是否已经被注册
- 使用connect-flash显示成功和错误信息
- `body-parser`对表单提交内容解析
- `express-session`纪录用户登录状态
