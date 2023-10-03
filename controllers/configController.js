/* Ricardo Antonio Chiché Caal */
'use strict'

var Config = require ('../models/config');
var fs = require('fs');
var path = require('path');

const obtener_config_admin = async function(req,res){
    if (req.user){//validando el permiso de quien lo ejecuta
        if(req.user.role == 'Admin'){
            let reg = await Config.findById({_id:"650b9b4ba25736624e165278"});//es porque siempre sera este registro, no tendria que haber mas, solo se actualizara el mismo
            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'No posees el permiso necesario para consultar'})
        }
    }else{
        res.status(500).send({message: 'El usuario no es de tipo Admin'})
    }
}

const actualiza_config_admin = async function(req,res){
    if (req.user){//validando el permiso de quien lo ejecuta
        if(req.user.role == 'Admin'){

            let data = req.body;
            if(req.files){
                //para extraer el nombre de la img a guardar en la bd
                var img_path = req.files.logo.path;
                //cuando se imprime en consola el elemento logo, vienen varios atributos pero se necesita el atributo "path"
                // pero en este atributo viene algo como 'uploads\\proveedores\\NKHQEXvV6HgTEiPzoJdDmdvf.png', por lo que se debe partir en 3 bloques y extraer solo el ultimo donde esta el nombre
                var name = img_path.split('/');
                var logo_name = name[2]; //lo que se dividio arriba, lo guarda en los bloques 0,1 y 2, en el 2 esta lo que se requiere
                let reg = await Config.findByIdAndUpdate({_id:"650b9b4ba25736624e165278"},{//es porque siempre sera este registro, no tendria que haber mas, solo se actualizara el mismo
                    //para enviarlo como array
                    categorias: JSON.parse(data.categorias),
                    titulo: data.titulo,
                    serie: data.serie,
                    //aqui si envio el nombre del nuevo logo
                    logo: logo_name,
                    correlativo: data.correlativo,
                });

                //IMPORTANTE, aqui se eliminará la imagen reemplazada para evitar archivos basura en el servidor, como buena practica
                //se usa el file system en la carpeta de fotos de configuraciones, se le manda el parametro de logo que se creo en la funcion de arriba llamada reg
                fs.stat('./uploads/configuraciones/'+reg.logo, function(err){
                    if(!err){// si no hay error, se eliminara el antiguo
                        fs.unlink('./uploads/configuraciones/'+reg.logo, (err)=>{
                            if(err) throw err;//capturar al error
                        });
                    }
                })
                res.status(200).send({data:reg});
            }else{
                let reg = await Config.findByIdAndUpdate({_id:"650b9b4ba25736624e165278"},{//es porque siempre sera este registro, no tendria que haber mas, solo se actualizara el mismo
                categorias: data.categorias,
                titulo: data.titulo,
                serie: data.serie,
                correlativo: data.correlativo,
            });
            res.status(200).send({data:reg});
            }

        }else{
            res.status(500).send({message: 'No posees el permiso necesario para consultar'})
        }
    }else{
        res.status(500).send({message: 'El usuario no es de tipo Admin'})
    }
}

const obtener_logo = async function (req,res){
    var img = req.params['img'];
    console.log(img);
    //se usa el file system en la carpeta de fotos de proveedores, se le manda el parametro de arriba img
    //se coloca una funcion encuentre un error
    fs.stat('./uploads/configuraciones/'+img, function(err){
        if(!err){//en caso de no recibir el error, se manda la img
            let path_img = './uploads/configuraciones/'+img;
            //cuando la encuentre se manda al front
            res.status(200).sendFile(path.resolve(path_img));
        }else{//en caso de que si haya error
            //se manda una imagen por defecto que dice que no encontro la imagen de la ruta solicitada
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    })
}

const obtener_config_publico = async function(req,res){
    let reg = await Config.findById({_id:"650b9b4ba25736624e165278"});//es porque siempre sera este registro, no tendria que haber mas, solo se actualizara el mismo
    res.status(200).send({data:reg});
}

module.exports = {
    obtener_config_admin,
    actualiza_config_admin,
    obtener_logo,
    obtener_config_publico
}