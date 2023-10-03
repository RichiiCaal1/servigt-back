/* Ricardo Antonio Chiché Caal */
'use strict'

var express = require('express');
var configController = require('../controllers/configController');

var api = express.Router();
//para utilizar el archivo authenticate.js, el cual protege nuestra api donde se aplique en las rutas de abajo
var auth = require ('../middlewares/authenticate');
//middleware para almacenar la imagen
var multiparty = require ('connect-multiparty');
//la ruta donde se guardara la img
var path = multiparty({uploadDir:'./uploads/configuraciones'});


api.put('/actualiza_config_admin/:id',[auth.auth,path],configController.actualiza_config_admin);
api.get('/obtener_config_admin',auth.auth,configController.obtener_config_admin);
// sin middleware porque sera un objeto publico
api.get('/obtener_logo/:img',configController.obtener_logo);
api.get('/obtener_config_publico',configController.obtener_config_publico);

module.exports = api;