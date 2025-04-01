

const BASE_URL = "https://api.themoviedb.org/3/";

const TipoBusqueda = Object.freeze({
    POR_NOMBRE: "search/multi",
    FILTRADA:   "discover/movie",
    POPULARES:  "movie/popular"
});

export function Busqueda(tipoBusqueda = TipoBusqueda.POR_NOMBRE) {
    this.urlPreparada = BASE_URL;
    this.filtros = [];
    this.tipoBusqueda = tipoBusqueda || TipoBusqueda.POR_NOMBRE;
    this.regionIdioma = new Intl.DateTimeFormat().resolvedOptions().locale || "en-US";
};

Busqueda.prototype.setTipoBusqueda = tipo => {
    this.tipoBusqueda = tipo;
};

Busqueda.prototype.prepararUrl = () => {

    this.urlPreparada = BASE_URL;
    this.urlPreparada.concat(this.tipoBusqueda);    

    // se le asigna el API Key para poder realizar las concultas
    this.urlPreparada.concat("?", "api_key", "=", "c7d88753768eedf47e4b16a8d964b98d");

    this.filtros.forEach(filtro => {
        const {nombre, valor} = filtro;
        this.urlPreparada.concat("&", nombre, "=", valor);
    });

    this.urlPreparada.concat("&language=", this.regionIdioma);
};

Busqueda.prototype.agregarFiltro = function(filtro = {}) {
    if (filtro == {}) return;

    this.filtros.append(filtro);
};

Busqueda.prototype.eliminarFiltro = nombre => {
    delete this.filtros[nombre];
};

export function Peliculas() {  

};

Peliculas.prototype.buscarPeliculasPorNombre = function(nombre) {
    const busqueda = new Busqueda(TipoBusqueda.POR_NOMBRE);
    busqueda.agregarFiltro({nombre: "query", valor: nombre});
    busqueda.prepararUrl();

    return fetch(busqueda.urlPreparada)
        .then(res => res.json())
        .catch(err => console.error("Error al buscar películas por nombre:", err));
};

Peliculas.prototype.buscarPeliculasPorFiltro = (busqueda) => {
    busqueda.prepararUrl();

    return fetch(busqueda.urlPreparada)
        .then(res => res.json())
        .catch(err => console.error("Error al buscar películas por filtro:", err));
};
