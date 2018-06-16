(function () {

	window.vars = {
		fullScreen: false,
		openAlbum: null,
		loadasbuffer: false,
		openImage: null,
		imageIndex: 0
	}

	window.vars.loadAlbum = function(album) {
		// console.log('loading album ' + album)

		window.vars.viewer = document.querySelector('.albumView')

		window.vars.viewer.style.display = "grid";
		window.vars.viewer.querySelector('.images').innerHTML = "Loading Album...";

		window.vars.openAlbum = album;

		var xhr = new XMLHttpRequest();
		xhr.open('put', '/dashboard', true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send(album);

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				try {
					window.vars.viewer.querySelector('.images').innerHTML = "";
					window.vars.displayAlbum(JSON.parse(xhr.responseText))
				} catch(e) {
					null;
				}
			}
		}
	}
	window.vars.displayAlbum = function(items) {
		window.vars.albumbuffer = items;
		window.vars.viewer.querySelector('.albumName').innerHTML = items.title;
		for (var i = 0; i < items.photos.length; i++) {
			window.vars.viewer.querySelector(".images").innerHTML += `<li class='photo' onclick='vars.loadImage(${i})'>
			<div class='thumbnail'><img class='thumbnailImg'></div>
			<label class='title'>${items.photos[i].title}</label>
			</li>`
		}
		window.vars.generateThumbnails();
	}
	window.vars.generateThumbnails = function() {
		for (var i = 0; i < window.vars.albumbuffer.photos.length; i++) {
			var getImageResult = window.vars.albumbuffer.photos[i].file.data;
			var b64encoded = btoa(String.fromCharCode.apply(null, getImageResult));
			var datajpg = "data:image/jpg;base64," + b64encoded;
			document.querySelector("#imgDisplayContainer").style.display = "block";
			document.querySelectorAll(".thumbnailImg").src = datajpg;
		}
	}
	window.vars.closeAlbum = function() {
		window.vars.viewer.style.display = "none";
		window.vars.openAlbum = null;
	}
	window.vars.closeImage = function() {
		window.vars.fullScreen = false;
		window.vars.viewer.querySelector('#imgDisplayContainer').style.display = "none";
		window.vars.hideControls();
		window.vars.openImage = null;
	}
	window.vars.loadImage = function(i) {
		if (!i) {
			i = window.vars.imageIndex;
		}

		window.vars.fullScreen = false;
		var fs = document.querySelector("#viewer");
		fs.className = window.vars.fullScreen ? "smallscreen" : "fullscreen";
		var display = document.querySelector("#imgDisplayContainer");
		display.className = window.vars.fullScreen ? "smallscreen" : "fullscreen";

		console.log(window.vars.openAlbum)
		document.querySelector("#imgDisplayContainer").style.display = "block";
		if (window.vars.loadasbuffer) {
			var getImageResult = window.vars.albumbuffer.photos[i].file.data;
			var b64encoded = btoa(String.fromCharCode.apply(null, getImageResult));
			var datajpg = "data:image/jpg;base64," + b64encoded;
			document.querySelector("#viewer").src = datajpg;
		} else {
			window.vars.openImage = '/image/' + window.vars.openAlbum + '/' + window.vars.albumbuffer.photos[i].title;
			window.vars.imageIndex = i;
			document.querySelector("#viewer").src = window.vars.openImage
		}
	}

	window.vars.showControls = function() {
		window.vars.interrupted = true;
		document.querySelector('.controls').style.bottom = '0';
	}
	window.vars.showControlsWithTimer = function(forceResume) {
		if (forceResume)
			window.vars.interrupted = false;
		document.querySelector('.controls').style.bottom = '0';
		setTimeout(() => {
			if (!window.vars.interrupted || forceResume) window.vars.hideControls()}, 2000);
	}
	window.vars.hideControls = function() {
		window.vars.interrupted = false;
		document.querySelector('.controls').style.bottom = '-5vh';
	}

	window.vars.download = function() {
		// null;
		window.open(window.vars.openImage, "_blank")
	}
	window.vars.prev = function() {
		// null;
		if (window.vars.imageIndex <= 0)
			window.vars.imageIndex = window.vars.albumbuffer.photos.length - 1;
		else
			window.vars.imageIndex -= 1;
		window.vars.loadImage()
	}
	window.vars.next = function() {
		// null;
		if (window.vars.imageIndex >= window.vars.albumbuffer.photos.length - 1)
			window.vars.imageIndex = 0;
		else
			window.vars.imageIndex += 1;
		window.vars.loadImage()
	}
	document.querySelector("#fsbtn").addEventListener("click", e => {
		var fs = document.querySelector("#viewer");
		window.vars.fullScreen = !window.vars.fullScreen;
		fs.className = window.vars.fullScreen ? "smallscreen" : "fullscreen";
		var display = document.querySelector("#imgDisplayContainer");
		display.className = window.vars.fullScreen ? "smallscreen" : "fullscreen";
		var src = window.vars.fullScreen ? "fullscreen.svg" : "smallscreen.svg";
		document.querySelector("#fsbtnimg").src= "/res/" + src;
	});
})();
