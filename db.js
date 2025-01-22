const mongoose = require('mongoose');
const QRCode = require('qrcode');
const { createHash } = require('crypto');

mongoose.set('strictQuery')
mongoose.pluralize(null)
mongoose.connect("mongodb://localhost:27017/magazzino");

const User = mongoose.model('users', {
    email: String,
    password: String,
    role: String
});

const Product = mongoose.model('products', {
    name: String,
    price: Number,
    quantity: Number,
    qr: String
})

const saveProduct = (product) => {
    const prod = new Product(product);
    prod.save().then(async (doc) => {
        const qr = await create(doc.id);
        updateProductQR(doc.id,qr);
        return doc;
    }).catch(err => {
        console.error('Errore', err);
    });
}

async function create(id){
    const qrCode = await QRCode.toDataURL(id);
    return qrCode;
}

const updateProductQR = async (id, qr) => {
    try {
        const result = await Product.updateOne(
            { _id: id }, 
            { qr: qr } 
        );
        console.log('Documenti aggiornati:', result);
    } catch (err) {
        console.error('Errore durante l\'aggiornamento del prodotto:', err);
        throw err;
    }
}

const saveUser = async (user) => {
    const usr = new User(user);
    usr.password = createHash('sha256').update(usr.password).digest('base64');
    if (await checkEmailUsage(usr.email)) {
        console.error('Email già in uso');
        return ;
    } else {
        usr.save().then((doc) => {
            console.log('Utente salvato' + doc);
        }).catch(err => {
            console.error('Errore', err);
        });
    }

}

const listProducts = () => {
    return Product.find().then(products => {
        return products;
    }).catch(err => {
        console.error('Errore', err);
    });
}

const checkLogin = async (email, password) => {
    password = createHash('sha256').update(password).digest('base64');
    return await User.find({ email: email, password: password }).then(users => {
        return users.length > 0;
    }).catch(err => {
        return false;
    });
}

function checkEmailUsage(email) {
    return User.find({ email: email })
        .then(user => {
            console.log(user);
            return user.length > 0;
        })
        .catch(err => {
            console.error('Errore', err);
            return false;
        });
}

const getInfoProducts = async (id) => {
    try {
        const product = await Product.findById(id);
        return product;
    }
    catch (err) {
        console.error('Errore', err);
        throw err;
    }
}

const deleteById = async (id) => {
    try{
        await Product.findByIdAndDelete(id);
        return id;
    }catch{
        return "error"
    }
}

const updateProduct = async (id,product) => {
    try {
        const result = await Product.updateOne(
            { _id: id }, 
            { name: product.name, price: product.price, quantity: product.quantity}
        );
        
    } catch (err) {
        console.error('Errore durante l\'aggiornamento del prodotto:', err);
        throw err;
    }
}

module.exports = { saveProduct, saveUser, listProducts, checkLogin, getInfoProducts, deleteById, updateProduct};
