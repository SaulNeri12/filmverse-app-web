

const BASE_URL = "https://api.themoviedb.org/3/";

const TipoBusqueda = Object.freeze({
    POR_NOMBRE: "search/multi",
    FILTRADA:   "discover/movie",
    POPULARES:  "movie/popular"
});

export function Busqueda(tipoBusqueda = TipoBusqueda.POR_NOMBRE) {
    this.urlPreparada = BASE_URL;
    this.filtros = [];
    this.tipoBusqueda = tipoBusqueda | TipoBusqueda.POR_NOMBRE;
};

Busqueda.prototype.setTipoBusqueda = tipo => {
    this.tipoBusqueda = tipo;
};

Busqueda.prototype.___prepararUrl___ = () => {
    this.urlPreparada = BASE_URL;
    this.urlPreparada.concat(this.tipoBusqueda);
}

Busqueda.prototype.prepararUrl = () => {
    this.filtros.forEach(filtro => {
        const {nombre, valor} = filtro;

        console.log(nombre);
        console.log(valor);
    });
};

Busqueda.prototype.agregarFiltro = (filtro = {}) => {
    if (filtro == {}) return;

    this.filtros.append(filtro);
};

Busqueda.prototype.eliminarFiltro = nombre => {
    delete this.filtros[nombre];
};

export function Peliculas() {  

};

Peliculas.prototype.buscarPeliculasPorNombre = nombre => {
    
};

Peliculas.prototype.buscarPeliculasPorFiltro = busqueda => {
    
};
