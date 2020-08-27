const User = require('../models/user');
const jwt = require('jsonwebtoken');

function handleError(err) {
    console.log(err.message, err.code);

    let errors = {
        email: '',
        password: ''
    }

    if (err.message == "Email not found") {
        errors.email = "Incorrect email.";
        return errors;
    }

    if (err.message == "Password not matched") {
        errors.password = "Incorrect password.";
        return errors;
    }

    if (err.code == 11000) {
        errors.email = "Email Already Registered";
        return errors;
    }

    if (err.message.includes('user validation failed')) 
        Object.values(err.errors).forEach(({properties}) => {

            errors[properties.path] = properties.message;
        });
    console.log(Object.values(errors));
    return errors;
}

const maxAge = 3 * 60 * 60 * 24;
function createToken(id) {
    return jwt.sign({
        id
    }, "Dont Reveal my key", {expiresIn: maxAge});
}

module.exports.signup_get = (req, res) => {
    res.render('signup', {Title: 'Signup'});
}
module.exports.signup_post = async(req, res) => {
    const {name, email, password} = req.body;

    try {

        const user = await User.create({name, email, password});
        const token = createToken(user._id);
        res.cookie('jwt-auth', token, {
            httpOnly: true,
            maxAge: (maxAge * 1000)
        });

        res
            .status(201)
            .json({user: user._id});

    } catch (err) {
        // console.log(err);

        var response = handleError(err);
        res
            .status(400)
            .json({error: response});
    }

    //  res.send('new signup');
}
module.exports.login_get = (req, res) => {
    // console.log(req);
    //console.log(req.cookies["jwt-auth"]);
    res.render('login', {Title: 'Login'});
};
module.exports.login_post = async(req, res) => {

    const {email, password} = req.body;
    try {
        const user = await User.login(email, password);

        const token = createToken(user._id);
        res.cookie('jwt-auth', token, {
            httpOnly: true,
            maxAge: (maxAge * 1000)
        });

        res
            .status(201)
            .json({user: user._id});

    } catch (err) {

        const errors = handleError(err)
        res
            .status(400)
            .json({error: errors});
    }
};
