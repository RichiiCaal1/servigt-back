'use strict'

var jwt = require ('jwt-simple');
//para obtener la fecha actual y de expiracion
var moment = require ('moment');
//se usara el mismo secret que use para codificar el token que esta en el archivo jwt.js
var secret = 'ricardocaal';

exports.auth = function(req,res,next){
    //obtener la cabecera de la peticion
    if(!req.headers.authorization){//si no se esta enviando la cabecera Authorization
        return res.status(403).send({message: 'No se encontro la cabecera requerida'})//se le envia un error 403 correspondiente a que no encontro la cabecera
    }

    var token = req.headers.authorization.replace(/['"]+/g,'');
    var segment = token.split('.'); //para segmentar el token en 3

    if(segment.length !=3){
        return res.status(403).send({message: 'Token Invalido'})//se le envia un error 403 correspondiente a que el token ingresado no es valido por no ser de 3 partes
    }else{
        try {
            var payload = jwt.decode(token,secret);//token decodificado

            if(payload.exp <= moment().unix()){//excepcion por si el token ha expirado, el formato de expiracion esta en formato unix
                return res.status(403).send({message: 'Token Expirado'})//se le envia un error 403 correspondiente a que el token ingresado no es valido por no ser de 3 partes
            }

        } catch (error) {
            return res.status(403).send({message: 'Token Invalido'})//se le envia un error 403 correspondiente a que el token ingresado no es valido por no ser de 3 partes
        }
    }

    req.user = payload; //para recibir el token decodificado en cada peticion

    next();
}