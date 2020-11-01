const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria.model');



// Crear nueva categoria
app.post('/categoria', verificaToken, (req, res) => {

    let categoria = new Categoria({
        descripcion: req.body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.status(200).json({
            ok: true,
            categoria: categoriaDB
        })
    })
});



// Mostrar una categoria por ID
// regresar id
app.get('/categoria/:id', verificaToken, (req, res) => {
    // Categoria.findById({});

    const id = req.params.id;

    Categoria
        .findById(id, (err, categoriaDB) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            };

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe esa categoria'
                    }
                })
            };

            res.status(200).json({
                ok: true,
                categoria: categoriaDB
            })

        })
        .populate('usuario', 'nombre email')
});



// Mostrar Todas las categorias
app.get('/categorias', verificaToken, (req, res) => {

    // El populate() va a revisar que ID o que objectsID existen
    // en la categoria que estoy solicitando y me va permitir cargar
    // información.
    // Como segundo argumaneto le puedo pasar que parametros quiero que muestre
    // el id no es necesario especificarlo porque siempre lo va mostrar por defecto

    // El sort() me permite ordenar en este caso por la descripción alfabeticamente
    Categoria
        .find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((error, categoriasDB) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                })
            };

            if (!categoriasDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No hay categorias'
                    }
                })
            };

            res.status(200).json({
                ok: true,
                categorias: categoriasDB
            })
        })
});



// Actualizar una categoria
app.put('/categoria/:id', verificaToken, (req, res) => {

    const id = req.params.id;

    const body = {
        descripcion: req.body.descripcion,
    }

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                error
            })
        };

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria que desea actualizar no existe'
                }
            })
        };

        res.status(200).json({
            ok: true,
            categoria: categoriaDB
        })
    })
});



// Borrar una categoria
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    const id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria que desa borrar no exite'
                }
            })
        }

        res.status(200).json({
            ok: true,
            message: 'La categoria fue borrrada correctamente'
        })
    });
});



module.exports = app;