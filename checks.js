function validateEmail (email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

const checkEmail = (req,res,next) => {
    let email = req.body.typeEmailX;

    if(validateEmail(email)){
        next();
    }else{
        res.status(400).send("Email non valida");
    }
}

const checkFiels = (req,res,next) => {
    let email = req.body.typeEmailX;
    let password = req.body.typePasswordX;

    if(email && password){
        next();
    }else{
        res.status(400).send("Campi non compilati");
    }
}

const checkAddProducts = (req,res,next) => {
    let name = req.body.name;
    let price = req.body.price;
    let quantity = req.body.quantity;

    if(name && price && quantity && !isNaN(price) && !isNaN(quantity)){
        next();
    }else{
        res.status(400).send("Campi non compilati o inseriti dati errati");
    }
}

const islogged = (req,res,next) => {
    if(req.session.email){
        next();
    }else{
        res.status(400).send("Login non effettuato");
    }
}

module.exports = {checkEmail,checkFiels,checkAddProducts,islogged};