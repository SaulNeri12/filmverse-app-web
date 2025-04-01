
import { 
    mostrarResultados,
    buscarPeliculasPopulares
} from "./utils.js";

const contenedor = document.querySelector('.contenedor-resultados');

document.addEventListener("DOMContentLoaded", async () => {
    const resultados = await buscarPeliculasPopulares();

    // se oculata el boton de "ver mas" cuando inicia la pagina
    document.querySelector(".paginacion-botones").style.display = "none";

    if (resultados.results) {
        mostrarResultados(resultados.results);
    }

    console.log(resultados.results)
});
