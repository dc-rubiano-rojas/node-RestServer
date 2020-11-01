const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');
let Producto = require('../models/producto.model');

let app = express();


// Crear Producto
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    const producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    });
})


// Buscar Productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto
        .find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.status(200).json({
                ok: true,
                productos: productosDB
            })
        })
})



// Obtener Productos
app.get('/productos', verificaToken, (req, res) => {

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;

    Producto
        .find({ disponible: true })
        .skip(skip)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productosDB) {
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'No hay productos registrados'
                    }
                })
            }

            res.status(200).json({
                ok: true,
                productos: productosDB,
                pagina
            })
        })
})



// Obtener un Producto
app.get('/producto/:id', verificaToken, (req, res) => {
    // populate: usuaio y categoria
    let id = req.params.id;

    Producto
        .findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'No hay producto registrado con ese ID'
                    }
                })
            }

            res.status(200).json({
                ok: true,
                producto: productoDB
            })
        })

})



// Actualizar Productos
app.put('/producto/:id', verificaToken, (req, res) => {
    // Grabar el usuario
    // Grabar una categoria del listado
    let id = req.params.id;
    let body = {
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        disponible: req.body.disponible,
        categoria: req.body.categoria,
    }

    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'No hay productos registrados con ese ID'
                }
            })
        }

        res.status(202).json({
            ok: true,
            producto: productoDB
        })
    })
})



// Borrar Productos
app.delete('/producto/:id', verificaToken, (req, res) => {
    // cambiar solo disponible a false

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'No hay productos registrados con ese ID'
                }
            })
        }

        res.status(200).json({
            ok: true,
            producto: productoDB
        })
    })
})





module.exports = app;