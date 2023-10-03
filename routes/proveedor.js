/* Ricardo Antonio Chiché Caal */
'use strict'

var express = require('express');
var proveedorController = require('../controllers/proveedorController');

var api = express.Router();
//para utilizar el archivo authenticate.js, el cual protege nuestra api donde se aplique en las rutas de abajo
var auth = require ('../middlewares/authenticate');
//middleware para almacenar la imagen
var multiparty = require ('connect-multiparty');
//la ruta donde se guardara la img
var path = multiparty({uploadDir:'./uploads/proveedores'});
//llamando al api creado en proveedor controller
//se hace un arreglo para llamar los dos middlewares
api.post('/registro_proveedor_admin',[auth.auth,path], proveedorController.registro_proveedor_admin);
//api para consultar los proveedores de la bd con sus parametros en la URL por ser de tipo GET
api.get('/listar_proveedores_admin/:filtro?',auth.auth,proveedorController.listar_proveedores_admin);
//api para consultar la foto de los proveedores de la bd con sus parametros en la URL por ser de tipo GET y sin middleware por ser data publica
api.get('/obtener_portada/:img',proveedorController.obtener_portada);
//api para obtener el ID de los proveedores de la bd con sus parametros en la URL por ser de tipo GET
api.get('/obtener_proveedor_admin/:id',auth.auth,proveedorController.obtener_proveedor_admin);
//api para actualizar un proveedor por iD, y se hace un arreglo para llamar los dos middlewares donde si utilizare el path
api.put('/actualizar_proveedor_admin/:id',[auth.auth,path],proveedorController.actualizar_proveedor_admin);
//api para eliminar el proveedor por ID
api.delete('/eliminar_proveedor_admin/:id',auth.auth,proveedorController.eliminar_proveedor_admin);
//api para actualizar las imagenes en el array de galeria del proveedor
api.put('/agregar_imagen_galeria_admin/:id',[auth.auth,path],proveedorController.agregar_imagen_galeria_admin);
//api para eliminar las imagenes en el array de galeria del proveedor
api.put('/eliminar_imagen_galeria_admin/:id',auth.auth,proveedorController.eliminar_imagen_galeria_admin);

//apis publicas
api.get('/listar_proveedores_publico/:filtro?',proveedorController.listar_proveedores_publico);
api.get('/obtener_proveedores_slug_publico/:slug',proveedorController.obtener_proveedores_slug_publico);
api.get('/listar_proveedores_recomendados_publico/:categoria',proveedorController.listar_proveedores_recomendados_publico);

api.get('/listar_proveedores_disponibles_publico', proveedorController.listar_proveedores_disponibles_publico);
//reviews
api.get('/obtener_reviews_proveedor_publico/:id',proveedorController.obtener_reviews_proveedor_publico);
module.exports = api;