module.exports = (function () {
	var db = require("krakendb")
	var ne = require("node-encrypt")

	// db.loaddb("user")

	if (db.dbexists("user")) {
		db.loaddb("user")
	} else {
		db.newdb("user", ["email", "password", "friends"])
		db.exportdb();
	}

	process.env.ENCRYPTION_KEY = "f66de9e326b4a7defaa0b1e0f015a140";

	var funcs = {};

	funcs.signup = function (un, email, pw, pc) {
		if (!db.isset(un) && !db.isset(email)) {
			if (pw == pc) {
				ne.encrypt({ text: pw }, (err, password) => {
					if (err)
						return "An error occured.";
					db.push(un, [email, password, []]);
					db.exportdb();
				});
				return 1;
				fs.mkdirSync(`user-data/${un}`)
			} else {
				return "Passwords don't match.";
			}
		} else {
			return "The Username or Email is taken.";
		}
	}
	funcs.login = function (un, pw) {
		if (db.indb(un)) {
			var pass = 1;
			// console.log("checking passwords")
			ne.decrypt({ cipher: db.getItem(un, 'password') }, (err, plaintext) => {
				pass = plaintext === pw ? 2 : 3;
			})
			while (pass) {
				if (pass !== 1)
					return pass;
			}
		} else {
			return 4;
		}
	}

	return funcs;
})()
