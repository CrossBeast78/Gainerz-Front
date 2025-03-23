const Request = require('./public/src/models/Request.js'); // Debe ser 'Request' en mayúscula
const Set = require('./public/src/models/Set.js');
// Usa 'Request' en vez de 'request'
const requ = new Request(12, 'c2u', 'c2u', new Date(), false, 'c2u', '3');
const seet= new Set(2,'13', '32');
console.log(seet);
console.log(requ);
