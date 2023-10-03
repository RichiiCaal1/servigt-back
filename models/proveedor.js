'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProveedorSchema = Schema({
    nombres: {type: String, required: true},
    //sera parte del URL cuando se consulte a este proveedor, lo tomara de los nombres
    slug: {type: String, required: true},
    //donde iran las fotos del trabajo que realiza el proveedor
    contacto: {type: String, required: true},
    galeria: [{type: Object, required: false}],
    portada: {type: String, required: true},
    descripcion: {type: String, required: true},
    contenido: {type: String, required: true},
    nventas: {type: Number, default: 0, required: true},
    npuntos: {type: Number, default: 0, required: true},
    categoria: {type: String, required: true},
    estado: {type: String, default: 'Edicion', required: true},
    createdAt: {type:Date, default:Date.now, require:true}
})

module.exports = mongoose.model('proveedor',ProveedorSchema);