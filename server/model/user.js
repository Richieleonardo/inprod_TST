const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id: String,
    name : String, 
    email: String,
    password: String,
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')){
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
})
const ChatUser = mongoose.model('ChatUser', UserSchema);

module.exports = ChatUser;