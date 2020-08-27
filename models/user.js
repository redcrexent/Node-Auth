const mongoose = require('mongoose');
const {isEmail, isAlpha} = require('validator')
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({

    name: {
        type: String,
        trim: true,
        validate: [isAlpha, "Provide a valid name"]
    },
    email: {
        type: String,
        required: [
            true, "Please enter an email"
        ],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Provide a valid email address"]
    },
    password: {
        type: String,
        required: [
            true, "Please enter Password"
        ],
        minlength: [
            6, "Password must be atleast 6 characters long"
        ],
        trim: true
    }

})

userSchema.post('save', function (doc, next) {

    console.log('User saved to database', doc);
    next();
});

userSchema.pre('save', async function (next) {

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    //console.log('User is about to be saved to database',this);
    next();
});

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({email});
    if (user != null) {

        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        } else {
            throw Error("Password not matched");
        }

    } else {
        throw Error("Email not found");
    }
}

const User = mongoose.model('user', userSchema);
module.exports = User;