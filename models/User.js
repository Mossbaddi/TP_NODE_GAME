// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;


const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
		min: 3,
		max: 255
	},
	email: {
		type: String,
		required: true,
		min: 6,
		max: 255
	},
	password: {
		type: String,
		required: true,
		min: 6,
		max: 1024
	},
	date: {
		type: Date,
		default: Date.now
	},
	description: {
		type: String,
		required: false,
		min: 0,
		max: 4096
	},
	avatar: {
		type: String,
		default: "/images/Peon/peon.png",
		min: 0,
		max: 255
	},
	BG: {
		type: String,
		default: "/images/Background/battleground1.png",
		min: 0,
		max: 255
	},
	class: {
		type: String,
		default: "Peon"
	},
	NombreDeVictoires: {
		type: Number,
		default: 0,
		min: 0
	},
	NombreDeDefaites: {
		type: Number,
		default: 0,
		min: 0
	},
	NombreDeMatchs: {
		type: Number,
		default: 0,
		min: 0
	},
	role: {
		type: String,
		default: "user"
	}
});


// Export model

module.exports = mongoose.model('User', UserSchema);