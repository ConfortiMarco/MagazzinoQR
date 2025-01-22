const express = require('express');
const session = require('express-session');
const hbs = require('hbs');
const MongoStore = require('connect-mongo');

const {debug, info, warning, error} = require('./logger');
const {checkEmail,checkFiels,islogged} = require('./checks');
const {saveUser, checkLogin} = require('./db');

const app = express();

const products = require('./products.js')

app.use('/products',products)

app.use(debug);
app.use(info);
app.use(warning);
app.use(error);
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(session({
    secret: 'secretkey',
    store: MongoStore.create({
        mongoUrl: "mongodb://localhost:27017/magazzino",            
        collectionName: 'sessions', 
    }),
    resave: true,
    saveUnitialized: true
}))

app.set('view engine','hbs');
hbs.registerPartials(__dirname+"/views/templates")

app.get('/', (req, res, next) => {
    res.render("login",{documentName: "Login"});
});

app.post('/login', checkFiels, async (req, res, next) => {
    let email = req.body.typeEmailX;
    let password = req.body.typePasswordX;
    info(req,res,next,`Tentativo login da parte di utente con l'email ${email}`)
    if(await checkLogin(email,password)){
        req.session.email = email;
        res.redirect('/products/');
    }else{
        res.redirect('/');
    }
});

app.get('/register', (req, res,next) => {
    res.render("register",{documentName: "Register"});
});

app.post('/register', checkEmail, checkFiels, (req,res,next) => {
    let email = req.body.typeEmailX;
    let password = req.body.typePasswordX;
    saveUser({email: email, password: password, role: 'user'});
    info(req,res,next,`Tentativo di registrazione con email: ${email}`)
    res.redirect('/');
});

app.get('/logout', islogged, (req,res,next) => {
    info(req,res,next,`Logout da parte di utente con l'email ${req.session.email}`)
    req.session.destroy();
    res.redirect('/');
});


app.listen(8000, () => {
    console.log("Server avviato sulla porta 8000")
});