const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./routes/authroute')
const cookieParser = require('cookie-parser')
const {requireAuth} = require("./middleware/authmiddleware");
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

app.get('/logout', requireAuth, (req, res) => {
    res.cookie('jwt-auth', '', {maxAge: 1});
    res.redirect("/login")
});

app.get('/', requireAuth, (req, res) => {
    res.render('home', {Title: 'Home'});
});

app.get('/smoothies', requireAuth, (req, res) => {
    res.render('smothies', {Title: 'Smoothies'});
});
app.use(authRoute)
