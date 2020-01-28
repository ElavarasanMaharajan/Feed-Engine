var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	name: String,
	email: String,	
	password: String,
	mobile: String
}),
userSchema.methods.validPassword = function( pwd ) {
    // EXAMPLE CODE!
    return ( this.password === pwd );
};
User = mongoose.model('User', userSchema);

module.exports =User;