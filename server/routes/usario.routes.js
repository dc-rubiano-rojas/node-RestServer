const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuarios.model');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express()


app.get('/usuario', verificaToken, (req, res) => {

    // El desde va a ser un parametro que le estamos pasando
    // y si no recibe nada que muestra la primera pagina (0)
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    // en el segundo parametro le puedo pasar que quiero que me 
    // muestre de cada usuario
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((error, usuarios) => {

            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            // Asi podemos contar registro
            // la condicion {} debe ser la misma que pasamos en el find()
            Usuario.countDocuments({ estado: true }, (error, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            })

        })
});



app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {

    const body = req.body;

    let usario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usario.save((error, usuarioDB) => {
        // Uso el return para que si entra en el error no siga y no tener que poner el else
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});



app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    // Con el pick de underscore (_) me permite seleccionar las propiedades que quiere tomar
    // para de esta forma no poder acualizar el password o si fue registrado por google
    let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

    // runValidators me corre las validaciones hechas anteriormente
    // new hace que devuelva el objeto modificado y no el antiguo
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, usuarioDB) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });
    })

});




app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    // Aca me borra el registro permanentemente
    // Usuario.findByIdAndRemove(id, (error, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (error, usuarioBorrado) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
});




module.exports = app;