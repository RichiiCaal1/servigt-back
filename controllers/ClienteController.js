/* Ricardo Antonio Chiché Caal */
'use strict'

var Cliente = require ('../models/cliente');
var Contacto = require ('../models/contacto');
var Review = require ('../models/review');

//paquete para encriptar la pass
var bycrypt = require('bcrypt-nodejs');
//se manda a llamar el helper jwt
var jwt = require('../helpers/jwt');

// const { use } = require('../routes/cliente');
//registro del cliente a nivel de backend
const registro_cliente = async function(req,res){

    var data = req.body;
    var clientes_arr = [];
    //busqueda de correo repetido
    clientes_arr = await Cliente.find({email:data.email});

    //reglas previas con if para un registro exitoso

    if(clientes_arr.length == 0){
        //registro
        // 
            if(data.password){// verificacion de la contraseña
                bycrypt.hash(data.password,null,null, async function(err,hash){ //funcion que recibe un error o la contrasena
                    if(hash){//cuando recibe las pass
                        data.password = hash; //la pass de entrada la convierte en la encriptacion recibida
                        var reg = await Cliente.create(data);
                        res.status(200).send({message:'Registro exitoso, inicia sesión con tus credenciales', data:reg});
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

//login del cliente
const login_cliente = async function(req,res){
    var data = req.body;
    //verificar que el correo existe en la bd
    var cliente_arr = [];

    cliente_arr = await Cliente.find({email:data.email});

    if(cliente_arr.length == 0){
        res.status(200).send({message: 'No se encontro el correo', data:undefined});
    }else{
        //Login
        let user = cliente_arr[0];

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

//constante para consultar los clientes
const listar_clientes_filtro_admin = async function(req,res){
    console.log(req.user);
    if(req.user){
        if(req.user.role == 'Admin'){
            let tipo = req.params['tipo'];
            let filtro = req.params['filtro'];
            console.log(tipo);
        
            if(tipo==null || tipo=='null'){
                //consulta a la coleccion de clientes
                let reg = await Cliente.find();
                res.status(200).send({data:reg});
            }else{//realiza el filtro por:
                if(tipo=='apellidos'){//realiza el filtro por: apellidos
                    let reg = await Cliente.find({apellidos:new RegExp(filtro,'i')});
                    res.status(200).send({data:reg});
                }else if(tipo=='correo'){//realiza el filtro por: correo
                    let reg = await Cliente.find({email:new RegExp(filtro,'i')});
                    res.status(200).send({data:reg});
                }
            }
        }else{
            res.status(500).send({message: 'No posees el permiso necesario para consultar'})
        }
    }else{
        res.status(500).send({message: 'No posees el permiso necesario para consultar'})
    }

}

//registro del cliente a nivel front
const registro_cliente_admin = async function(req,res){
    if(req.user){
        if(req.user.role=='Admin'){
            var data = req.body;

            bycrypt.hash('123456789',null,null,async function(err,hash){
                if(hash){
                data.password = hash;
                let reg = await Cliente.create(data); //por el tipo await se necesita el async
                res.status(200).send({data:reg});
                }else{
                res.status(200).send({message:'Hubo un error en el servidor', data:undefined});
                }
            })
        }else{
            res.status(500).send({message: 'No posees el permiso necesario para consultar'})
        }
    }else{
        res.status(500).send({message: 'No posees el permiso necesario para consultar'})
    }
}

const obtener_cliente_admin = async function(req,res){
//validar que sea un rol administrador
    if(req.user){
        if(req.user.role=='Admin'){
            var id=req.params['id'];
            try {
                var reg = await Cliente.findById({_id:id}); //para encontrar el registro por ID
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

const actualizar_cliente_admin = async function(req,res){
    if(req.user){
        if(req.user.role=='Admin'){
            var id=req.params['id'];
            var data = req.body;

            var reg = await Cliente.findByIdAndUpdate({_id:id},{
                nombres : data.nombres,
                apellidos : data.apellidos,
                email : data.email,
                telefono : data.telefono,
                f_nacimiento: data.f_nacimiento,
                dpi : data.dpi,
                genero : data.genero
            }); //para encontrar el registro por ID y actualizarlo
            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'No posees el permiso necesario para consultar'})
        }
    }else{
        res.status(500).send({message: 'No posees el permiso necesario para consultar'})
    }
}

const eliminar_cliente_admin = async function(req,res){
    if(req.user){
        if(req.user.role=='Admin'){

            var id=req.params['id'];

            let reg = await Cliente.findByIdAndRemove({_id:id});
            res.status(200).send({data:reg});
            
        }else{
            res.status(500).send({message: 'No posees el permiso necesario para consultar'})
        }
    }else{
        res.status(500).send({message: 'No posees el permiso necesario para consultar'})
    }
}

//volvemos la funcion de obtener_cliente_admin a publica para que loo utilice el cliente
const obtener_cliente_guest = async function(req,res){
    //validar que sea una sesion
        if(req.user){
            var id=req.params['id'];
            try {
                var reg = await Cliente.findById({_id:id}); //para encontrar el registro por ID
                res.status(200).send({data:reg});
            } catch (error) {//si hay error, para evitar un error de castigo en caso se coloque un ID erroneo y no lo encuentre
                res.status(200).send({data:undefined});
            }
        }else{
            res.status(500).send({message: 'No se ha encontrado el usuario'})
        }
    }


//volvemos la funcion de obtener_cliente_admin a publica para que loo utilice el cliente
const actualizar_perfil_cliente_guest = async function(req,res){
    //validar que sea una sesion
        if(req.user){
            var id=req.params['id'];
            var data = req.body;
            
            if(data.password){//se valida si hay o no contraseña porque no es obligatorio cada que se actualice un perfil y en caso lo hubiera, se debe encriptar la nueva contraseña
                //para encriptar la nueva pass
                bycrypt.hash(data.password,null,null, async function(err,hash){ //funcion que recibe un error o la contrasena
                    var reg = await Cliente.findByIdAndUpdate({_id:id},{
                        nombres : data.nombres,
                        apellidos : data.apellidos,
                        //no se enviara otro correo para evitar añadir otro registro
                        // email : data.email,
                        telefono : data.telefono,
                        f_nacimiento: data.f_nacimiento,
                        dpi : data.dpi,
                        genero : data.genero,
                        //aqui se envia pero la nueva pass encriptada en hash
                        password: hash,
                    }); //para encontrar el registro por ID y actualizarlo
                    //enviamos todo el nuevo registro
                    res.status(200).send({data:reg});
                });

            }else{
                var reg = await Cliente.findByIdAndUpdate({_id:id},{
                    nombres : data.nombres,
                    apellidos : data.apellidos,
                    //no se enviara otro correo para evitar añadir otro registro
                    // email : data.email,
                    telefono : data.telefono,
                    f_nacimiento: data.f_nacimiento,
                    dpi : data.dpi,
                    genero : data.genero
                }); //para encontrar el registro por ID y actualizarlo
                //enviamos todo el nuevo registro
                res.status(200).send({data:reg});
            }
        }else{
            res.status(500).send({message: 'No se ha encontrado el usuario'})
        }
    }

    //**********************CONTACTO */

const enviar_mensaje_contacto = async function(req,res){
    let data = req.body;
//para inicializar el estado en abierto
    data.estado = 'Abierto';
    let reg = await Contacto.create(data);
    res.status(200).send({data:reg});

}


//volvemos la funcion de obtener_cliente_admin a publica para que loo utilice el cliente
const emitir_review_proveedor_cliente = async function(req,res){
    //validar que sea una sesion
    if(req.user){
        let data = req.body;

        let reg = await Review.create(data);
        res.status(200).send({data:reg});

    }else{
        res.status(500).send({message: 'Por favor, inicia sesión para realizar esta acción.'})
    }
}

//volvemos la funcion de obtener_cliente_admin a publica para que loo utilice el cliente
const obtener_review_proveedor_cliente = async function(req,res){
    var id=req.params['id'];

    let reg = await Review.find({proveedor:id}).sort({createdAt:-1});
    res.status(200).send({data:reg});
}


const obtener_reviews_cliente = async function(req,res){
    //validar que sea una sesion
    if(req.user){
        var id=req.params['id'];

        let reg = await Review.find({cliente:id}).populate('cliente');
        res.status(200).send({data:reg});

    }else{
        res.status(500).send({message: 'Por favor, inicia sesión para realizar esta acción.'})
    }
}


module.exports = {
    registro_cliente,
    login_cliente,
    listar_clientes_filtro_admin,
    registro_cliente_admin,
    obtener_cliente_admin,
    actualizar_cliente_admin,
    eliminar_cliente_admin,
    obtener_cliente_guest,
    actualizar_perfil_cliente_guest,
    enviar_mensaje_contacto,
    emitir_review_proveedor_cliente,
    obtener_review_proveedor_cliente,
    obtener_reviews_cliente,
}