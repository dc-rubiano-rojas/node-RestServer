// =========================== 
// PUERTO
// ===========================
process.env.PORT = process.env.PORT || 3000;



// =========================== 
// ENTORNO
// ===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



// =========================== 
// Vencimiento del Token
// ===========================
// 60 seg
// 60 min
// 24 hrs
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;




// =========================== 
// SEED de autenticación
// ===========================
// Declare una variable en Heroku para que cuando yo suba esto a github 
// el seed de producción no quede visible
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';




// =========================== 
// BASE DE DATOS
// ===========================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
// Se creo esta variable desde el CLI con heroku config:set MONGO_URI=""
// Esto para ocultar el url de mi app al momento de subir a github
process.env.URLDB = urlDB;



// =========================== 
// Google Client ID
// ===========================
// process.env.CLIENT_ID = process.env.CLIENT_ID || '55420895426-ifq2j9ka1015jrs00821ibv01o6edoc7.apps.googleusercontent.com';