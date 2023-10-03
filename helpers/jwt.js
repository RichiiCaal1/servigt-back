/* Ricardo Antonio Chiché Caal */
'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
//contraseña para encriptar los datos
var secret = 'ricardocaal';

exports.createToken = function(user){
    //elementos del webtoken
    var payload = {
        sub: user._id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        role: user.rol,
        //duracion del token
        iat: moment().unix(),
        exp: moment().add(7,'days').unix()
    }
    //se retorna el jwt y se encripta con el secret
    return jwt.encode(payload,secret);

}
