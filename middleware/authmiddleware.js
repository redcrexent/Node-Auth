const jwt = require('jsonwebtoken');

const requireAuth = function (req, res, next) {

    const token = req.cookies['jwt-auth'];

    if (token) {

        jwt.verify(token, 'Dont Reveal my key', (err, decodedstring) => {

            if (err) 
                res.redirect('/login');
            else {
                console.log(decodedstring);
                next();
            }

        })

    } else {
        res.redirect('/login');
    }

}

module.exports = {
    requireAuth
};