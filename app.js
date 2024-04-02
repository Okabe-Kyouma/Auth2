const express = require('express');
const mongoose = require('mongoose');
const user = require('./model/user');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

mongoose.connect('mongodb://127.0.0.1:27017/Auth')
  .then(() => console.log('Connected!'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

let isLoggedIn = (req,res,next)=>{

  if(req.session.username){
    next();
  }
  else{
    res.redirect('/login');
  }

}

app.get('/', isLoggedIn, (req, res) => {
  res.render('home');
})


app.get('/signup', (req, res) => {
  res.render('signup');
})

app.post('/signup', async (req, res) => {

  const {
    username,
    password,
    email
  } = req.body;

  const ex = user.findOne({
    username
  });

  if (ex == null) {

    const hashPass = await bcrypt.hash(password, 10);

    await user.create({
      username,
      password: hashPass,
      email
    }, );


    res.redirect('/login');

  }

});

app.get('/login', (req, res) => {

  res.render('login');

});

app.post('/login', async (req, res) => {
  const {
    username,
    password
  } = req.body;

  const ex = await user.findOne({
    username
  });

  if (ex != null) {

    const flag = await bcrypt.compare(password, ex.password);

    if (flag) {
      req.session.username = username;
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  } else {
    res.redirect('/signup');
  }

})

app.listen('4000', () => {
  console.log("server Started at port 4000");
});