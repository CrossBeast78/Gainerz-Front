import * as Models from "./public/src/models/Index.js";

const normalSet = new Models.NormalSet(1, "Normal", "Descripción", [8, 12]);
console.log(normalSet);

const dropSet = new Models.Dropset(1, "Drop", "Descripción", [[8, 80], [6, 60]]);
console.log(dropSet);

const restPause = new Models.RestPause(1, "Rest-Pause", "Descripción", [3, 15, 10]);
console.log(restPause);

const rir = new Models.RIR(1, "RIR", "Descripción", [8, 2]);
console.log(rir);

const notification = new Models.Notification("123", "Entrenador", "Nuevo aviso", "Tu rutina ha cambiado");
console.log(notification);

const SearchResult= new Models.SearchResult('123', 'coach', 'Juan', 'img.com')
console.log(SearchResult)