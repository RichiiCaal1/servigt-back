'use strict'

var Proveedor = require('../models/proveedor');
var Review = require('../models/review');

//para manejar archivos
var fs = require('fs');
//para la ruta de la imagen
var path = require('path');

//para registrar los proveedores
const registro_proveedor_admin = async function (req,res){
    if (req.user){//validando el permiso de quien lo ejecuta
        if(req.user.role == 'Admin'){
            let data = req.body;
            //para extraer el nombre de la img a guardar en la bd
            var img_path = req.files.portada.path;
            //cuando se imprime en consola el elemento portada, vienen varios atributos pero se necesita el atributo "path"
            // pero en este atributo viene algo como 'uploads\\proveedores\\NKHQEXvV6HgTEiPzoJdDmdvf.png', por lo que se debe partir en 3 bloques y extraer solo el ultimo donde esta el nombre
            var name = img_path.split('/');
            var portada_name = name[2]; //lo que se dividio arriba, lo guarda en los bloques 0,1 y 2, en el 2 esta lo que se requiere
            //aqui es donde toma los nombres y lo convertimos en un slug para utilizarlo en la URL del registro
            //los nombres se pasan a minusculas y los espacios pasan a ser guiones, despues de todo esto se envia la data con el valor de slug alo conseguido en la siguiente linea
            data.slug = data.nombres.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
            //en portada se envia el nombre que se obtuvo al partir en bloques el path del elemento
            data.portada = portada_name;
            //guardar el registro
            let reg = await Proveedor.create(data);
            //respuesta al front al realizar todos estos procesos
            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'No posees el permiso necesario para consultar'})
        }
    }else{
        res.status(500).send({message: 'El usuario no es de tipo Admin'})
    }
}

const listar_proveedores_admin = async function (req,res){
    if (req.user){//validando el permiso de quien lo ejecuta
        if(req.user.role == 'Admin'){
            //pasar la variable como parametro
            var filtro = req.params['filtro'];
            //crear el listado
            let reg = await Proveedor.find({nombres: new RegExp(filtro,'i')});
            //mandar una respuesta al encontrar los proveedores
            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'No posees el permiso necesario para consultar'})
        }
    }else{
        res.status(500).send({message: 'El usuario no es de tipo Admin'})
    }
}

const obtener_portada = async function (req,res){
    var img = req.params['img'];
    console.log(img);
    //se usa el file system en la carpeta de fotos de proveedores, se le manda el parametro de arriba img
    //se coloca una funcion encuentre un error
    fs.stat('./uploads/proveedores/'+img, function(err){
        if(!err){//en caso de no recibir el error, se manda la img
            let path_img = './uploads/proveedores/'+img;
            //cuando la encuentre se manda al front
            res.status(200).sendFile(path.resolve(path_img));
        }else{//en caso de que si haya error
            //se manda una imagen por defecto que dice que no encontro la imagen de la ruta solicitada
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    })
}


const obtener_proveedor_admin = async function(req,res){
    //validar que sea un rol administrador
        if(req.user){
            if(req.user.role=='Admin'){
                var id=req.params['id'];
                try {
                    var reg = await Proveedor.findById({_id:id}); //para encontrar el registro por ID
                    res.status(200).send({data:reg});
                } catch (error) {//si hay error, para evitar un error de castigo en caso se coloque un ID erroneo y no lo encuentre
                    res.status(200).send({data:undefined});
                }
            }else{
                res.status(500).send({message: 'No posees el permiso necesario para consultar'})
            }
        }else{
            res.status(500).send({message: 'No posees el permiso necesario para consultar'})
        }
    }

//para registrar los proveedores
const actualizar_proveedor_admin = async function (req,res){
    if (req.user){//validando el permiso de quien lo ejecuta
        if(req.user.role == 'Admin'){
            //pasarle el id que vamos a actualizar
            let id = req.params['id'];
            let data = req.body;

            if(req.files){//para valdiar que esta llegando una imagen
                //para extraer el nombre de la img a guardar en la bd
                var img_path = req.files.portada.path;
                //cuando se imprime en consola el elemento portada, vienen varios atributos pero se necesita el atributo "path"
                // pero en este atributo viene algo como 'uploads\\proveedores\\NKHQEXvV6HgTEiPzoJdDmdvf.png', por lo que se debe partir en 3 bloques y extraer solo el ultimo donde esta el nombre
                var name = img_path.split('/');
                var portada_name = name[2]; //lo que se dividio arriba, lo guarda en los bloques 0,1 y 2, en el 2 esta lo que se requiere

                let reg = await Proveedor.findByIdAndUpdate({_id:id},{//se actualizara el id y toda la estructura con la imagen nueva
                    nombres: data.nombres,
                    contacto: data.contacto,
                    categoria: data.categoria,
                    descripcion: data.descripcion,
                    contenido: data.contenido,
                    //aqui enviamos el split necesario para mandar el nombre nuevo de la nueva imagen
                    portada: portada_name
                });

                //IMPORTANTE, aqui se eliminará la imagen reemplazada para evitar archivos basura en el servidor, como buena practica
                //se usa el file system en la carpeta de fotos de proveedores, se le manda el parametro de portada que se creo en la funcion de arriba llamada reg
                fs.stat('./uploads/proveedores/'+reg.portada, function(err){
                    if(!err){// si no hay error, se eliminara el antiguo
                        fs.unlink('./uploads/proveedores/'+reg.portada, (err)=>{
                            if(err) throw err;//capturar al error
                        });
                    }
                })

                //enviar la respuesta al front
                res.status(200).send({data:reg});

            }else{//cuando no hay imagen
                let reg = await Proveedor.findByIdAndUpdate({_id:id},{//se actualizara el id y toda la estructura menos la imagen
                    nombres: data.nombres,
                    contacto: data.contacto,
                    categoria: data.categoria,
                    descripcion: data.descripcion,
                    contenido: data.contenido,
                });
                //enviar la respuesta al front
                res.status(200).send({data:reg});
            }
        }else{
            res.status(500).send({message: 'No posees el permiso necesario para consultar'})
        }
    }else{
        res.status(500).send({message: 'El usuario no es de tipo Admin'})
    }
}

const eliminar_proveedor_admin = async function(req,res){
    if(req.user){
        if(req.user.role=='Admin'){

            var id=req.params['id'];

            let reg = await Proveedor.findByIdAndRemove({_id:id});
            res.status(200).send({data:reg});
            
        }else{
            res.status(500).send({message: 'No posees el permiso necesario para consultar esto'})
        }
    }else{
        res.status(500).send({message: 'No posees el permiso necesario para consultar esto'})
    }
}

const agregar_imagen_galeria_admin = async function(req,res){
    if (req.user){//validando el permiso de quien lo ejecuta
        if(req.user.role == 'Admin'){
            let id = req.params['id'];
            let data = req.body;

            
            var img_path = req.files.imagen.path;
            //cuando se imprime en consola el elemento portada, vienen varios atributos pero se necesita el atributo "path"
            // pero en este atributo viene algo como 'uploads\\proveedores\\NKHQEXvV6HgTEiPzoJdDmdvf.png', por lo que se debe partir en 3 bloques y extraer solo el ultimo donde esta el nombre
            var name = img_path.split('/');
            var imagen_name = name[2]; //lo que se dividio arriba, lo guarda en los bloques 0,1 y 2, en el 2 esta lo que se requiere

            let reg = await Proveedor.findByIdAndUpdate({_id:id},{ $push: {galeria:{
                imagen: imagen_name,
                _id: data._id
            }}});
            res.status(200).send({data:reg});

        }else{
            res.status(500).send({message: 'No posees el permiso necesario para consultar'})
        }
    }else{
        res.status(500).send({message: 'El usuario no es de tipo Admin'})
    }
}

const eliminar_imagen_galeria_admin = async function(req,res){
    if (req.user){//validando el permiso de quien lo ejecuta
        if(req.user.role == 'Admin'){
            let id = req.params['id'];
            let data = req.body;

            let reg = await Proveedor.findByIdAndUpdate({_id:id},{$pull: {galeria:{_id:data._id}}});
            res.status(200).send({data:reg});

        }else{
            res.status(500).send({message: 'No posees el permiso necesario para consultar'})
        }
    }else{
        res.status(500).send({message: 'El usuario no es de tipo Admin'})
    }
}
// metodos publicos

const listar_proveedores_publico = async function (req,res){
     //pasar la variable como parametro
    var filtro = req.params['filtro'];
    //crear el listado
    let reg = await Proveedor.find({nombres: new RegExp(filtro,'i')}).sort({createdAt:-1});
    //mandar una respuesta al encontrar los proveedores
    res.status(200).send({data:reg});
}


const obtener_proveedores_slug_publico = async function (req,res){
    //pasar el slug de cada elemento como parametro
   var slug = req.params['slug'];
   //crear el listado
   let reg = await Proveedor.findOne({slug: slug});
   //mandar una respuesta al encontrar los proveedores
   res.status(200).send({data:reg});
}

const listar_proveedores_recomendados_publico = async function (req,res){
    //pasar la variable como parametro
   var categoria = req.params['categoria'];
   //crear el listado
   let reg = await Proveedor.find({categoria: categoria}).sort({createdAt:-1}).limit(8);
   //mandar una respuesta al encontrar los proveedores
   res.status(200).send({data:reg});
}


const listar_proveedores_disponibles_publico = async function (req,res){
   //crear el listado
   let reg = await Proveedor.find().sort({createdAt:-1}).limit(8);
   //mandar una respuesta al encontrar los proveedores
   res.status(200).send({data:reg});
}

const obtener_reviews_proveedor_publico = async function (req,res){
    let id = req.params['id'];
    //populate para poder encontrar el atributo de los clientes que esta en otro esquema Schema
    let reviews = await Review.find({proveedor: id}).populate('cliente').sort({createdAt:-1})
    res.status(200).send({data:reviews});
 }

module.exports = {
    registro_proveedor_admin,
    listar_proveedores_admin,
    obtener_portada,
    obtener_proveedor_admin,
    actualizar_proveedor_admin,
    eliminar_proveedor_admin,
    agregar_imagen_galeria_admin,
    eliminar_imagen_galeria_admin,
    listar_proveedores_publico,
    obtener_proveedores_slug_publico,
    listar_proveedores_recomendados_publico,
    listar_proveedores_disponibles_publico,
    obtener_reviews_proveedor_publico,    
}