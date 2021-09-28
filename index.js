const express = require('express')
const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcrypt');

//connecting mongoose
mongoose.connect("mongodb://localhost:27017/AuthDemo", {useNewUrlParser: true, useUnifiedTopology: true,})
    .then(() => {
        console.log("MONGO connection OPEN!");
    })
    .catch((err) => {
        console.log("oh no !MONGO connection error");
        console.log(err);
    });

// //adding logic to check if there is an error
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', () => {
//     console.log('Database connected')
// });

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({extended:true}));


app.get('/', (req, res) => {
    res.send('This is the home page');
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async(req, res) => {
    const {username, password} = req.body
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hash
    })
    await user.save();
    res.redirect('/');
})

app.get('/login', (req, res)=>{
    res.render('login');
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({username});
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
        res.send('Yay, logged in');
    } else {
        res.send('incorrect username or password')
    }
})

app.get('/secret', (req, res) => {
    res.send('This is your secret')
})


app.listen(3000, ()=> {
    console.log('Serving your app')
})