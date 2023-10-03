/* Ricardo Antonio Chiché Caal */
'use strict'

var Admin = require('../models/admin');
var Contacto = require('../models/contacto');
//paquete para encriptar la pass
var bycrypt = require('bcrypt-nodejs');
//se manda a llamar el helper jwt
var jwt = require('../helpers/jwt');

const registro_admin = async function(req,res){

    var data = req.body;
    var admin_arr = [];
    //busqueda de correo repetido
    admin_arr = await Admin.find({email:data.email});

    //reglas previas con if para un registro exitoso

    if(admin_arr.length == 0){
        //registro
        // 
            if(data.password){// verificacion de la contraseña
                bycrypt.hash(data.password,null,null, async function(err,hash){ //funcion que recibe un error o la contrasena
                    if(hash){//cuando recibe las pass
                        data.password = hash; //la pass de entrada la convierte en la encriptacion recibida
                        var reg = await Admin.create(data);
                        res.status(200).send({data:reg});
                    }else{
                        res.status(200).send({message:'ErrorServer', data:undefined});
                    }
                })
             }else{// si no recibe pass y no encripta enviara el error que no hay pass
                res.status(200).send({message:'No hay una contraseña', data:undefined});
             }
    }else{
        res.status(200).send({message:'El correo ya existe en la base de datos', data:undefined});
    }
    //console.log(reg);


}

//login del admin
const login_admin = async function(req,res){
    var data = req.body;
    //verificar que el correo existe en la bd
    var admin_arr = [];

    admin_arr = await Admin.find({email:data.email});

    if(admin_arr.length == 0){
        res.status(200).send({message: 'El correo ingresado no existe', data:undefined});
    }else{
        //Login
        let user = admin_arr[0];

        //uso de  bcrypt para comparar la pass
        bycrypt.compare(data.password, user.password, async function(error,check){
            if(check){
                res.status(200).send({
                    data:user,
                    token: jwt.createToken(user)
                });
            }else{
                res.status(200).send({message: 'Contraseña no coincide', data:undefined});
            }
        });
    }

    //res.status(200).send({data:data});
}

const obtener_mensajes_admin = async function(req,res){
    if (req.user){//validando el permiso de quien lo ejecuta
        if(req.user.role == 'Admin'){
            let reg = await Contacto.find().sort({createdAt:-1});
            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'No posees el permiso necesario para consultar'})
        }
    }else{
        res.status(500).send({message: 'El usuario no es de tipo Admin'})
    }
}

const cerrar_mensaje_admin = async function(req,res){
    if (req.user){//validando el permiso de quien lo ejecuta
        if(req.user.role == 'Admin'){

            let id = req.params['id'];


            let reg = await Contacto.findByIdAndUpdate({_id:id},{estado: 'Cerrado'});
            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'No posees el permiso necesario para consultar'})
        }
    }else{
        res.status(500).send({message: 'El usuario no es de tipo Admin'})
    }
}

module.exports = {
    registro_admin,
    login_admin,
    obtener_mensajes_admin,
    cerrar_mensaje_admin,
}