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
// 24 hts
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

// Se creo esta variable desde el CLI con
// heroku config:set MONGO_URI="mongodb+srv://dancrr01:mQxN6W2Mr2oBgjOJ@cluster0.rptmd.mongodb.net/cafe"
// Esto para ocultar el url de mi app al momento de subir a github

process.env.URLDB = urlDB;