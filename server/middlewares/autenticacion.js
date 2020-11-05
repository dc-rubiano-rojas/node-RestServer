const jwt = require('jsonwebtoken');



// =============================
//  Verifica Token
// =============================
let verificaToken = (req, res, next) => {

    // Aqui obtengo los headers 
    // en el get pongo el nombre como lo envie
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        };

        // en el decoded viene el payload que se creo
        // y lo estamos poniendo en una nuevo variable llamada usuairo
        req.usuario = decoded.usuario;
        next();
    });
};



// =============================
//  Verifica AdminRole
// =============================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        // return;
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }
};


// =============================
//  Verifica Token para Imagen
// =============================
let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        };

        // en el decoded viene el payload que se creo
        // y lo estamos poniendo en una nuevo variable llamada usuairo
        // dentro del request
        req.usuario = decoded.usuario;
        next();
    });

}

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}