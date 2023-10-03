/* Ricardo Antonio Chiché Caal */
'use strict'

var express = require('express');
var clienteController = require('../controllers/ClienteController');

var api = express.Router();
//para utilizar el archivo authenticate.js, el cual protege nuestra api donde se aplique en las rutas de abajo
var auth = require ('../middlewares/authenticate');

api.post('/registro_cliente',clienteController.registro_cliente);
api.post('/login_cliente',clienteController.login_cliente);

api.get('/listar_clientes_filtro_admin/:tipo/:filtro',auth.auth,clienteController.listar_clientes_filtro_admin); //se pasa por parametro el tipo y filtro, a demas de proteger nuestra ruta con authenticate.js
api.post('/registro_cliente_admin',auth.auth, clienteController.registro_cliente_admin)//se manda el midleware auth al api de la funcion de registro_cliente_admin de clientecontroller

//se manda el midleware auth al api de la funcion de obtener_cliente_admin de clientecontroller y el parametro que se usara para consultar el cliente
api.get('/obtener_cliente_admin/:id',auth.auth,clienteController.obtener_cliente_admin);
//se manda el midleware auth al api de la funcion de actualizar_cliente_admin de clientecontroller y el parametro que se usara para actualizar el cliente
api.put('/actualizar_cliente_admin/:id',auth.auth,clienteController.actualizar_cliente_admin);
//se manda el midleware auth al api de la funcion de eliminar_cliente_admin de clientecontroller y el parametro que se usara para eliminar el cliente
api.delete('/eliminar_cliente_admin/:id',auth.auth,clienteController.eliminar_cliente_admin);
//api publica para obtener el cliente
api.get('/obtener_cliente_guest/:id',auth.auth,clienteController.obtener_cliente_guest);
//api para actualizar el cliente desde lado cliente
api.put('/actualizar_perfil_cliente_guest/:id',auth.auth,clienteController.actualizar_perfil_cliente_guest);

//CONTACTO
api.post('/enviar_mensaje_contacto',clienteController.enviar_mensaje_contacto);

//REVIEW
api.post('/emitir_review_proveedor_cliente',auth.auth,clienteController.emitir_review_proveedor_cliente);
api.get('/obtener_review_proveedor_cliente/:id',clienteController.obtener_review_proveedor_cliente);
api.get('/obtener_reviews_cliente/:id',auth.auth,clienteController.obtener_reviews_cliente);
module.exports = api;