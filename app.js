const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./routes/authroute')
const cookieParser = require('cookie-parser')
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}))

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

var dbURI = 'mongodb://localhost:27017/NodeAuth?readPreference=primary&appname=nodeauth';

mongoose
    .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then((result) => {
        //        console.log('coonected to db')
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err)
    });

//Auth
app.use((req, res, next) => {

    const url = req.url;
    const jwt = req.cookies["jwt-auth"];

    if (!jwt && !(url.indexOf('login') > 0) && url.indexOf("signup") < 0) {
        res.redirect("/login");
    }
    console.log(req);

    console.log('In another Middle ware');
    next();
});

app.get('/', (req, res) => {
    //console.log(req.cookies["jwt-auth"]);
    console.log(req.cookies["jwt-auth"]);
    const jwtauth = req.cookies["jwt-auth"];
    if (jwtauth) 
        res.render('home', {Title: 'Home'});
    else 
        res.redirect("/login");
    }
);

app.get('/smoothies', (req, res) => {

    // console.log(req.cookies.get('jwt-auth'));
    const jwtauth = req.cookies["jwt-auth"];
    if (jwtauth) 
        res.render('smothies');
    else 
        res.redirect("/login");
    }
);
app.use(authRoute)

// 404 app.use((req, res) => {     res         .status(404) .render('404',
// {Title: 'Not Found 404'}); });