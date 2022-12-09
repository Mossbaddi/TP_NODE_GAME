// Creer un serveur express

// Page de login

// Page d'inscription

// Page d'accueil

// Page Backoffice

// Base MongoDB

// Utilisation Mongoose

const express = require('express');
const app = express();

const port = 3000;
const bodyParser = require('body-parser');
// const session = require('express-session');
// const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const { render } = require('ejs');

const cookieParser = require("cookie-parser");
const sessions = require('express-session');



// console.log(process.env.MONGO_URL);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('views'));


const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
	secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
	saveUninitialized: true,
	cookie: { maxAge: oneDay },
	resave: false
}));

// Connexion à MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/TPNode', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log("Connected to MongoDB");
});


app.get('/', (req, res) => {
	console.log(req.session.user);
	res.render('index.ejs', { req: req });
});

app.get('/login', (req, res) => {
	if (req.session.user) {
		res.redirect('/backoffice');
	}
	else {
		res.render('login.ejs', { req: req });
	}
});

app.get('/register', (req, res) => {
	res.render('register.ejs', { req: req });
});

async function getUsers() {
	let users = await User.find({})
	return users;
}

app.get('/backoffice', (req, res) => {
	if (req.session.user) {
		getUsers().then((users) => {
			res.render('backoffice.ejs', { items: users, req: req });
		});
	}
	else {
		res.redirect('/login');
	}
});

app.get('/user/:id', (req, res) => {
	if (req.session.user) {
		User.findById(req.params.id, (err, user) => {
			if (err) {
				res.status(404).send("User not found");
			}
			else {
				res.render('user.ejs', { element: user, req: req });
			}
		});
	}
	else {
		res.redirect('/login');
	}
});

app.get('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/');
});


// Définition des routes POST

app.post('/register', [
	check('email').isEmail(),
	check('password').isLength({ min: 5 }),
	check('name').isLength({ min: 3 })
], (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	else {
		bcrypt.hash(req.body.password, 10, (err, hash) => {
			const user = new User({
				name: req.body.name,
				email: req.body.email,
				password: hash
			});
			user.save().then(() => {
				res.redirect('/login');
			}).catch((err) => {
				res.status(400).send('Impossible d\'enregistrer l\'utilisateur dans la base de données');
			});
		});
	}
});

app.post('/login', (req, res) => {

	const name = req.body.name;
	const password = req.body.password

	User.findOne({ name: name }).then((user) => {
		if (user) {
			bcrypt.compare(password, user.password, (err, same) => {
				if (same) {
					req.session.user = user;
					res.redirect('/menu');
				}
				else {
					console.log("wrong password");
					res.redirect('/login');
				}
			});
		}
		else {
			console.log("No user found");
			res.redirect('/login');
		}
	}).catch((err) => {
		console.log(err);
		res.status(400).send('Impossible de se connecter');
	})

});



app.delete('/api/delete/:id', (req, res) => {

	if (req.session.user) {
		User.findByIdAndDelete(req.params.id, (err, user) => {
			if (err) {
				res.status(404).send("User not found");
			}
			else {
				res.status(200).send("User deleted");
			}
		});
	}
	else {
		res.status(401).send("Unauthorized");
	}
});

app.post('/update/:id', (req, res) => {
	if (req.session.user) {
		User.findById(req.params.id, (err, user) => {
			if (err) {
				res.status(404).send("User not found");
			}
			else {
				user.name = req.body.name;
				user.email = req.body.email;
				user.description = req.body.description;
				user.class = req.body.class;
				user.NombreDeVictoires = req.body.nbvictoire;
				user.NombreDeDefaites = req.body.nbdefaite;
				user.NombreDeMatchs = req.body.nbmatchs;
				user.save().then(() => {
					res.redirect('/backoffice');
				}).catch((err) => {
					res.status(400).send('Impossible de mettre à jour l\'utilisateur');
				});
			}
		});
	}
	else {
		res.redirect('/login');
	}
});

app.get('/fight/:id', (req, res) => {
	if (req.session.user) {
		User.findById(req.params.id, (err, user) => {
			if (err) {
				res.status(404).send("User not found");
			}
			else {
				if (user.NombreDeMatchs == 0 && user.class == "Peon") {
					res.redirect('/choose/' + user._id);
				}
				else {
					res.render('fight.ejs', { element: user, req: req });
				}
			}
		});
	}
	else {
		res.redirect('/login');
	}
});

app.get('/choose/:id', (req, res) => {
	if (req.session.user) {
		User.findById(req.params.id, (err, user) => {
			if (err) {
				res.status(404).send("User not found");
			}
			else {
				res.render('choose.ejs', { element: user, req: req });
			}
		});
	}
	else {
		res.redirect('/login');
	}
});

app.post('/api/victoire', (req, res) => {
	if (req.session.user) {
		User.findById(req.session.user._id, (err, user) => {
			user.NombreDeVictoires++;
			user.NombreDeMatchs++;
			user.save().then(() => {
				res.status(200)
				res.send() // TODO : Redirection vers la page de victoire
			}
			).catch((err) => {
				res.status(400).send('Impossible de mettre à jour l\'utilisateur');
			}
			);
		});
	}
	else {
		res.redirect('/login');
	}
});

app.post('/api/defaite', (req, res) => {
	if (req.session.user) {
		User.findById(req.session.user._id, (err, user) => {
			user.NombreDeDefaites++;
			user.NombreDeMatchs++;
			user.save().then(() => {
				res.status(200)
				res.send() // TODO : Redirection vers la page de victoire
			}
			).catch((err) => {
				res.status(400).send('Impossible de mettre à jour l\'utilisateur');
			}
			);
		});
	}
	else {
		res.redirect('/login');
	}
});


app.post('/api/choose/:id/:class', (req, res) => {
	if (req.session.user) {
		User.findById(req.params.id, (err, user) => {
			if (err) {
				res.status(404).send("User not found");
			}
			else {
				user.class = req.params.class;
				user.save().then(() => {
					res.redirect('/backoffice');
				}).catch((err) => {
					res.status(400).send('Impossible de mettre à jour l\'utilisateur');
				});
			}
		})
	} else {
		res.redirect('/login');
	}
});

app.get('/victory', (req, res) => {

	if (req.session.user) {
		res.render('victory.ejs', { element: req.session.user, req: req });
	}
	else {
		res.redirect('/login');
	}

});
app.get('/defeat', (req, res) => {

	if (req.session.user) {
		res.render('defeat.ejs', { element: req.session.user, req: req });
	}
	else {
		res.redirect('/login');
	}

});

app.get('/menu', (req, res) => {

	if (req.session.user) {
		res.render('menu.ejs', { element: req.session.user, req: req });
	}
	else {
		res.redirect('/');
	}

});
// Creer les routes pour les combats

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});