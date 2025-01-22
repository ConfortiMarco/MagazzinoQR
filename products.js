const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const QRCode = require('qrcode');

const router = express.Router();

const {saveProduct, listProducts, getInfoProducts, deleteById, updateProduct} = require('./db');
const {checkAddProducts,islogged} = require('./checks');
const { warning, info, error, debug } = require('./logger');

router.use(info)
router.use(warning)
router.use(error)
router.use(debug)
router.use(express.static('public'));
router.use(express.json());
router.use(express.urlencoded({extended:true}));

router.use(session({
    secret: 'secretkey',
    store: MongoStore.create({
        mongoUrl: "mongodb://localhost:27017/magazzino",            
        collectionName: 'sessions', 
    }),
    resave: true,
    saveUnitialized: true
}))

router.get('/', islogged, async (req, res,next) => {
    let products = await listProducts();
    res.render("products",{documentName: "Products", products: products});
});

router.get('/add', islogged,  (req, res,next) => {
    res.render("addProduct",{documentName: "Add Product"});
});

router.post('/add', islogged, checkAddProducts, (req,res,next) => {
    let name = req.body.name;
    let price = req.body.price;
    let quantity = req.body.quantity;
    saveProduct({name: name, price: price, quantity: quantity, qr: null});
    info(req,res,next,`Creazione del prodotto con i seguenti dati: ${ name } , ${ price }, ${ quantity }, utente ${req.session.email}`)
    res.redirect('/products');
});

router.get('/scan', islogged, (req, res,next) => {
    res.render('scan');
});

router.get('/info/:id', islogged, async (req, res,next) => {
    const id = req.params.id;
    getInfoProducts(id).then((product) => {
        res.render('info', {documentName: "Info Prodotto "+product.name ,product: product});
    }
    ).catch(err => {
        console.error('Errore', err);
    });
});


router.get('/qr/:id', islogged, (req,res,next) => {
    const id = req.params.id;
    getInfoProducts(id).then((product) =>{
        res.render('qr', {documentName:"Qr code del prodotto "+product.name, product: product})
    }).catch(err => {
        console.error('Errore', err);
    });
});


router.delete('/delete/:id', islogged, (req, res,next) => {
    const id = req.params.id;
    warning(req,res,next,`Eliminazione del prodotto con il seguente id: ${ id }, utente: ${req.session.email}`)
    deleteById(id).then((docs) => {
      res.status(200).send({docs})
    }).catch((e) => {
      res.status(400)
    });
  });

router.get('/edit/:id', islogged, (req,res,next) => {
    const id = req.params.id;
    getInfoProducts(id).then((product) =>{
        res.render('edit', {documentName:"Pagina di modifica del prodotto "+product.name, product: product})
    }).catch(err => {
        console.error('Errore', err);
    });
})

router.post('/edit', checkAddProducts, islogged, (req,res,next) => {
    const id = req.body._id;
    let name = req.body.name;
    let price = req.body.price;
    let quantity = req.body.quantity;
    product = {name: name,price: price,quantity: quantity};
    updateProduct(id,product);
    warning(req,res,next,`Modifica del prodotto con il seguente id: ${ id }, utente: ${req.session.email}`)
    res.redirect('/products');
});

module.exports = router;