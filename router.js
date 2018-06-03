var express = require('express');
var router = express.Router();
var auth = require("./auth");

var title = "Photo";

router.get('/', function(req, res, next) {
  res.render('index', { title });
});
router.get('/signup', function(req, res) {
	res.render('signup', { title });
})
router.get('/login', function (req, res) {
	res.render('login', { title })
})

router.post('/signup', function(req, res) {
	var signup = auth.signup(req.body.un, req.body.email, req.body.pw, req.body.pc);
	req.session.signedIn = signup == 1;

	if (signup != 1)
		res.render("signup", { title })
	else
		res.redirect("/dashboard")
})
router.get('/dashboard', function (req, res) {
	// console.log(req.session);
	if (req.session.signedIn)
		res.render("dashboard", { title })
	else
		res.redirect("/signup")
})

module.exports = router;
