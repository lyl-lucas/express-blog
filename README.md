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

##10月27日
###OAUTH功能,可用github账号直接登录
- 更改了User模型
- 登录时，可以填写资料创建新账号绑定
- 也可以绑定已有账号
- 处理逻辑是：github是否有绑定用户,是则直接登录,否则转到信息页面绑定,或可以登录账号绑定
