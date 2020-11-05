const express = require('express');
const fileUpload = require('express-fileupload');

const Usuario = require('../models/usuarios.model');
const Producto = require('../models/producto.model');

// Para saber si un archivo existe
const fs = require('fs');

// Para crear un ruta
const path = require('path');

const app = express();

// useTempFiles: true -> es para que me cree el objeto correctamente
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se seleccionado ningun archivo'
            }
        });
    }


    // VALIDAR TIPO
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.lastIndexOf(tipo) < 0) {
        // No encontro ninguno
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(',')
            }
        })
    }

    // Si viene un archivo cae aqui
    // archivo es el nombre que se le va a poner cuando hagamos un input
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    // Aca selecciono la ultima posicion del arreglo que me creo el split()
    let extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones Permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        // Quiere decir que no lo encontro
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(','),
                ext: extension
            }
        })
    }

    // Cambiar Nombre Al Archivo
    // Para que sea un nombre unico por image.
    // ejemplo: 2131341-123.jpg
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (tipo === 'usuarios') {
            // Aqui ya se que la imagen se cargo
            // Actualizo la imagen en un usuario
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo)
        }


    });

});


function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario No exite'
                }
            })
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
            })
        })
    })
}


function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Producto No exite'
                }
            })
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.status(200).json({
                ok: true,
                producto: productoGuardado,
            })
        })

    })
}


function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        // unlinkSync() para borrar un archivo
        fs.unlinkSync(pathImagen)
    };
}


module.exports = app;