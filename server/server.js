require('./config/config');

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/usuario', function(req, res) {
    res.json('Get Usuario')
});

app.post('/usuario', function(req, res) {

    const body = req.body;

    if (!body.nombre) {

        res.status(400).json({
            ok: false,
            message: 'El nombre es necesario'
        });

    } else {

        res.status(200).json({
            persona: body
        })
    }

});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;

    res.status(200).json({
        id
    })
});

app.delete('/usuario', function(req, res) {
    res.json('DELETE Usuario')
});



app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT);
})