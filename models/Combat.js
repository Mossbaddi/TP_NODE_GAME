// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;


const UserSchema = new Schema({
	players: [{ type: Schema.Types.ObjectId, ref: 'User' }, { type: Schema.Types.ObjectId, ref: 'User' }],
	finished: { type: Boolean, default: false },
	turn: { type: Number, default: 0 },
	round: { type: Number, default: 0 },
	winner: { type: Schema.Types.ObjectId, ref: 'User', default: null }
});



// Export model

module.exports = mongoose.model('Combat', UserSchema);