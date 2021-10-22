const express = require("express")
const router = express.Router() //
const mongoose = require("mongoose")
//Model de usuário
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs") //hash boladão!!
const passport = require("passport")
        

// Rotas

//Rota para registro
router.get("/registro", function(req, res){
    res.render("usuarios/registro")
})

//Validação formulário de registro
router.post("/registro", function(req, res){
    var erros = []

    if (!req.body.nome || req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido!"})
    }

    if (!req.body.email || req.body.email == undefined || req.body.email == null){
        erros.push({texto: "E-mail inválido!"})
    }

    if(!req.body.senha || req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha inválida!"})
    }

    //Verificando o tamanho da senha
    if(req.body.senha.length < 4){
        erros.push({texto: "Senha muito curta!"})
    }

    //Verifcando se as senhas são iguais
    if (req.body.senha != req.body.senha2){
        erros.push({texto: "Senhas diferentes, tente novamente!"})
    }

    //Caso haja algum erro, a página de registro é renderizada e os erros são exibidos

    if(erros.length > 0){
        res.render("usuarios/registro", {erros: erros})
    }else{
            Usuario.findOne({email: req.body.email}).then(function(usuario){
            //Caso haja algum usuário cadastrado com aquele e-mail
            if(usuario){
                req.flash("error_msg", "Já existe uma conta com esse E-mail!")
                res.redirect("/usuarios/registro")
            }else{
                const novoUsuario = new Usuario ({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

            //Hash na senha
            bcrypt.genSalt(10, function(erro, salt){
                bcrypt.hash(novoUsuario.senha, salt, function(erro, hash){
                    if(erro){
                        req.flash("error_msg", "Houve um erro ao salvar o usuário")
                        res.redirect("/")
                    }
                    //Passando o hash que foi gerado para a senha do novo usuário
                    novoUsuario.senha = hash

                    novoUsuario.save().then(function(){
                        req.flash("success_msg", "Usuário criado com sucesso")
                        res.redirect("/")
                    }).catch(function(erro){
                        req.flash("error_msg", "Houve um erro ao salvar o usuário, tente novamente")
                        res.redirect("/usuarios/registro")
                    })
                })
            })
        }
    }).catch(function(erro){
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/")
    })
  }

})

//Rota para Login
router.get("/login", function(req, res){
    res.render("usuarios/login")
})

router.post("/login", function(req, res, next){
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)
})

//Logout
router.get("/logout", function(req, res){
    req.logout()
    req.flash("success_msg", "Desconectado com sucesso!")
    res.redirect("/")
})



module.exports = router