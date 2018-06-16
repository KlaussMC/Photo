module.exports = (function() {
	'use strict';
	var fs = require('fs')
	var funcs = {}

	var extensions = ["png", "jpg", "gif", "bmp", "ico"];

	funcs.getAlbums = function(user) {
		return fs.readdirSync(`user-data/${user}`);
	}
	funcs.loadAlbum = function(user, albumName) {
		var album = {
			photos: []
		};
		var files = fs.readdirSync(`user-data/${user}/${albumName}`)
		for (var i = 0; i < files.length; i++) {
			var extension = files[i].split(".").pop().toLowerCase();
			if (extensions.indexOf(extension) > -1) {
				album.photos.push( { title: files[i], file: null } ) // file: fs.readFileSync(`user-data/${user}/${albumName}/${files[i]}`)
			} else if (files[i] == "album.json") {
				album = Object.assign(album, JSON.parse(fs.readFileSync(`user-data/${user}/${albumName}/album.json`, 'utf8')));
			}
		}
		// console.log(files);
		return album;
	}
	funcs.getImage = function (user, album, image) {
		console.log(user, album, image);
		// return null;
		return fs.readFileSync(`user-data/${user}/${album}/${image}`)
	}

	return funcs;
})();
