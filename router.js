'use strict';
var express = require('express');
var router = express.Router();
var auth = require("./auth");
var main = require('./main')

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

	req.session.user = req.body.un;
	req.session.signedIn = signup == 1;
	req.session.fromSignup = true;

	if (signup != 1)
		req.session.error = signup

	res.redirect("/dashboard")
})
router.post('/login', function(req, res) {
	var login = auth.login(req.body.un, req.body.pw)
	// console.log(login)?
	req.session.user = req.body.un;
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
	// console.log(main);
	if (req.session.signedIn)
		res.render("dashboard", { title, albums: main.getAlbums(req.session.user), useSecondHeader: req.session.signedIn })
	else {
		if (req.session.fromSignup)
			res.redirect("/signup")
		else
			res.redirect('/login')
	}
})
router.put('/dashboard', function (req, res) {
	var ajax = req.xhr;
	if (ajax) {
		var albumName = Object.keys(req.body)[0];
		var album = main.loadAlbum(req.session.user, albumName)
		res.send(JSON.stringify({title: album.title, photos: album.photos}));
	}
})
router.get('/image/:album/:image', function (req, res) {
	if (req.session.signedIn) {
		if (req.params.album) {
			if (req.params.image) {
				res.send(main.getImage(req.session.user, req.params.album, req.params.image))
				return;
			}
		}
	}
	req.session.error = "You need to be logged in to view this image."
	res.redirect('/login')
})
router.get('/logout', function (req, res) {
	req.signedIn = false;
	req.session.destroy();
	res.redirect('/login')
})

router.get('/upload', function (req, res) {
	if (req.session.signedIn) {
		res.render('upload', { title, sizeLimit: 5, useSecondHeader: req.session.signedIn, albums: main.getAlbumList(req.session.user) })
	} else {
		// res.send('you need to sign in to upload images')
		req.session.error = "You need to sign in to upload images."
		res.redirect('/login')
	}
})
router.post('/dashboard', function (req, res) {
	var ajax = req.xhr;
	if (ajax) {
		if (req.session.signedIn) {
			res.send('1');
			console.log("recieved", Object.keys(req.body)[0])
		} else {
			res.send('0')
		}
	}
})
module.exports = router;
