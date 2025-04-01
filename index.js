
import {
    mostrarResultados,
    mostrarNoResultados,
    mostrarError,
    buscarPelicula
} from "./utils.js";


// manejador de evento cuando se presiona el boton "Ver Mas"
document.querySelector("#btn-siguiente").addEventListener("click", async () => {
    const contenedor = document.querySelector('.contenedor-resultados');

    let pagina = parseInt(contenedor.getAttribute("data-page"));

    const consulta = document.querySelector("#input-busqueda").value.trim();

    const nuevaPaginaResultados = await buscarPelicula(consulta, ++pagina);

    const resultados = nuevaPaginaResultados.results;

    //console.log(resultados)

    if (resultados) {
        mostrarResultados(resultados, false);
    }

    contenedor.setAttribute("data-page", pagina.toString())
});
