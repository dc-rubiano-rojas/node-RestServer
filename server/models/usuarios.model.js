const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// el VALUE me muestra lo que recibimos
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

const Schema = mongoose.Schema;


const usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
    img: { type: String },
    role: { type: String, default: 'USER_ROLE', enum: rolesValidos },
    estado: { type: Boolean, default: true },
    google: { type: Boolean, default: false },
});


// Para que no me regrese la contraseña
// el .toJSON en un schema siempre es llamado cuando se intenta imprimir
// o cuando intenta pasarse a un json
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    delete userObject.password;
    return userObject;
}


// El path me muestra me muestra en este caso el 'email' que es como esta nombrado en el modelo
// plugin me esta leyendo el unique: true del email
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });


module.exports = mongoose.model('Usuario', usuarioSchema);