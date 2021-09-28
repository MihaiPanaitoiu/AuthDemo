const express = require('express')
const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const session = require('express-session');

//connecting mongoose
mongoose.connect("mongodb://localhost:27017/AuthDemo", {useNewUrlParser: true, useUnifiedTopology: true,})
    .then(() => {
        console.log("MONGO connection OPEN!");
    })
    .catch((err) => {
        console.log("oh no !MONGO connection error");
        console.log(err);
    });


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({extended:true}));
app.use(session({secret: 'notagoodsecretlmao', saveUninitialized:true, resave:false}));


const requireLogin = (req, res, next) => {
    if(!req.session.user_id) {
       return res.redirect('/login')
    }
    next();
}



app.get('/', (req, res) => {
    res.send('This is the home page');
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async(req, res) => {
    const {username, password} = req.body
    const user = new User({username,password})
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/');
})

app.get('/login', (req, res)=>{
    res.render('login');
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
   const foundUser = await User.findAndValidate(username, password);
    if (foundUser) {
        req.session.user_id = foundUser._id
        res.redirect('/secret');
    } else {
        res.send('incorrect username or password')
    }
})

app.post('/logout', (req, res) => {
    //this inly removes the user id from session, so is enough for authentication
    req.session.user_id = null;
    //this destroys the session
    // req.session.destroy();
    res.redirect('/login');
})


app.get('/secret', requireLogin, (req, res) => {
    res.render('secret')
})

app.get('/topsecret', requireLogin, (req, res)=> {
    res.send('this is top secret')
})


app.listen(3000, ()=> {
    console.log('Serving your app')
})