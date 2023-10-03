/* Ricardo Antonio Chiché Caal */
'use strict'
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var port = process.env.PORT || 4201;

//declarar la ruta de cliente
var cliente_route = require('./routes/cliente');
//declarar la ruta de admin
var admin_route = require('./routes/admin');
//declarar la ruta de proveedores
var proveedor_route = require('./routes/proveedor');
//declarar la ruta de configuracion
var config_route = require('./routes/config');

/*mongoose.connect('mongodb://127.0.0.1:27017/PGII',(err, res)=>{
    if(err){
        console.log(err);
    }else{

        app.listen(port,function(){
            console.log('Servidor corriendo en el puerto ' + port);
        });
    }
});*/

mongoose
  .connect('mongodb://127.0.0.1:27017/PGII', {useUnifiedTopology: true, useNewUrlParser: true})
  .then(() => {
    app.listen(port,function(){
      console.log('Servidor corriendo en el puerto ' + port);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json({limit: '50mb', extended:true}));

  app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});

//uso de apis
app.use('/api',cliente_route);  
app.use('/api',admin_route);
app.use('/api',proveedor_route);
app.use('/api',config_route);

module.exports = app;