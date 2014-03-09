/**
*
* Module dependencies
*
**/

var connect = require("connect")
   ,users = require('./users')

/**
*
* Create Server
*
**/

var server = connect(
	 connect.logger('dev')
   ,connect.bodyParser()
   ,connect.cookieParser()
   ,connect.session({ secret: 'my app secret' })
   ,function (req, res, next) {//已登入且在目錄 詢問是否登出
   		if ('/' == req.url && req.session.logged_in) {
   			res.writeHead(200, {'Content-Type': 'text/html' });
   			res.end(
   					'Welcome back, <b>' + req.session.name + '</b>. '
   					+ '<a href="/logout">Logout</a>'
   			);
   		} else {
   			next();
   		}
   }
   ,function (req, res, next) {//在目錄抓取使用者輸入(GET)的帳號密碼
   		if ('/' == req.url && 'GET' == req.method) {
   			res.writeHead(200, {'Content-Type': 'text/html' });
   			res.end([
   					'<form action="/login" method="POST">'
   					,	'<fieldset>'
   					,		'<legend> Please Log in </legend>'
   					,		'<p>User: <input type="text" name="user"></p>'
   					,		'<p>Password: <input type="password" name="password"></p>'
   					,		'<button>Submit</button>'
   					,	'</fieldset>'
   					,'</form>'
   				].join(''));
   		} else {
   			next();
   		}
   }
   ,function (req, res, next) {//跳到/login目錄且提交(POST)帳號密碼
   		if ('/login' == req.url && 'POST' == req.method) {
   			res.writeHead(200, {'Content-Type': 'text/html'})
   			if (!users[req.body.user] || req.body.password != users[req.body.user].password) {
   				res.end('Bad Username/Password');
   			} else {
   				req.session.logged_in = true;
   				req.session.name = users[req.body.user].name;
   				res.end('Authenticated!');
   			}
   		} else {
   			next();
   		}
   }
   ,function (req, res, next) {
   	if ('/logout' == req.url) {
   		req.session.logged_in = false;
   		res.writeHead(200);
   		res.end('Logged out!');
   	} else {
   		next();
   	}
   }
);

