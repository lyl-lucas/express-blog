var express = require('express');
var nunjucks = require('nunjucks');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var authroutes = require('./routes/auth');
var flash = require('connect-flash');
var session = require('express-session');
var config = require('./config');

var app = express();

function createEnv(path, opts) {
    var
        autoescape = opts.autoescape && true,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path, {
                noCache: noCache,
                watch: watch,
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            });
    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}

var env = createEnv('views', {
    watch: true,
    filters: {
        hex: function (n) {
            return '0x' + n.toString(16);
        }
    }
});

// nunjucks.configure('views', {
//     autoescape: true,
//     express: app
// });


app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));

// 使用session
// app.use(session({
//   secret: config.cookieSecret,
//   key: config.db,//cookie name
//   cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
// }));

app.use(session({
  secret: config.cookiesecret,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
}));

// 表单解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// 加入flash
app.use(flash());

// var env = nunjucks.configure('views');
// 使得res.render指向env.render
env.express(app);
app.use(express.static(path.join(__dirname,'static')));

// 处理flash响应
app.use(function (req, res, next) {
    res.locals.flash_success = req.flash('flash_success');
    res.locals.flash_error = req.flash('flash_error'); 
    res.locals.current_user = req.session.user;       
    next();
});

routes(app);
app.use('/auth', authroutes);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});