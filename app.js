//Carregando os módulos
const express = require("express")
const handlebars = require("express-handlebars")
const bodyParser = require ("body-Parser") //Utilizado para receber dados de formulário
const mongoose = require("mongoose")
const app = express()
const path = require("path") // Utilizado para manipular pastas
const session = require("express-session")
const flash = require("connect-flash")
const usuarios = require("./rotas/usuario") //Importando a rota usuario
const passport = require("passport")
require("./config/auth")(passport)




//Config


//Sessão
app.use(session({
    secret: "sistemadelogin", //Chave para gerar sessão
    resave: true,
    saveUninitialized: true
}))

//Passport
app.use(passport.initialize())
app.use(passport.session())

//Flash
app.use(flash())

//Middleware
app.use (function(req, res, next){
   // console.log("Teste")
   res.locals.success_msg = req.flash("success_msg")//Criando variável global com locals
   res.locals.error_msg = req.flash("error_msg")
   res.locals.error = req.flash("error")
   //Armazenando os dados do usuario autenticado
   res.locals.user = req.user || null
   next()
})
    
//Body Parser
app.use (bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

    //Handlebars
    app.engine("handlebars", handlebars({defaultLayout: "main"})) //main é o template padrão da aplicação
    app.set("view engine", "handlebars")


//Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/bancologin",{
    }).then(function(){
        console.log("Conectado ao mongo")
    }).catch(function(erro){
        console.log("Erro ao se conectar")
    })
     

//Public 
    app.use(express.static(path.join(__dirname, "public")))

//Rotas

//Rota para home
app.get("/", function (req,res){
    res.render("index")
})


            
//Chamando as rotas
app.use("/usuarios", usuarios)



// Outros
const port = 8081 // Constante para armazenar a porta
app.listen(port, function(){
    console.log("Servidor Rodando!")
})



