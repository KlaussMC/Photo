var express = require('express');
var router = express.Router();
var auth = require("./auth");

var title = "Photo";

router.get('/', function(req, res, next) {
  res.render('index', { title });
});
router.get('/signup', function(req, res) {
	res.render('signup', { title, err: req.session.error });
})
router.get('/login', function (req, res) {
	res.render('login', { title, err: req.session.error })
})
router.post('/signup', function(req, res) {
	var signup = auth.signup(req.body.un, req.body.email, req.body.pw, req.body.pc);
	req.session.signedIn = signup == 1;
	req.session.fromSignup = true;

	if (signup != 1)
		req.session.error = signup

	res.redirect("/dashboard")
})
router.post('/login', function(req, res) {
	var login = auth.login(req.body.un, req.body.pw)
	console.log(login)
	req.session.signedIn = login === 2;
	req.session.fromSignup = false;
	// 1 is pending, 2 is a success, 3 is a password failure, 4 is unknown username
	if (login >= 3) {
		if (login == 4) {
			req.session.error = "Unknown Username";
		} else {
			req.session.error = "Wrong Password";
		}
	}
	res.redirect('/dashboard')
})
router.get('/dashboard', function (req, res) {
	// console.log(req.session);
	if (req.session.signedIn)
		res.render("dashboard", { title })
	else {
		if (req.session.fromSignup)
			res.redirect("/signup")
		else
			res.redirect('/login')
	}
})

module.exports = router;
