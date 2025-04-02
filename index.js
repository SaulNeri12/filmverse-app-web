
import {
    mostrarResultados,
    mostrarNoResultados,
    mostrarError,
    buscarPelicula
} from "./utils.js";

document.addEventListener('DOMContentLoaded', function () {
    const navItems = document.querySelectorAll('.navbar-title');
    const inicioNav = navItems[0];
    const contenedorBuscador = document.querySelector('.contenedor-buscador');

    inicioNav.addEventListener('click', function () {
        window.scrollTo({
            top: contenedorBuscador.offsetTop - 70,
            behavior: 'smooth'
        });

        document.querySelector('#input-busqueda').value = '';
        const contenedorResultados = document.querySelector('.contenedor-resultados');
        contenedorResultados.innerHTML = '';
        contenedorResultados.setAttribute('data-page', '1');

        document.querySelector('.paginacion-botones').style.display = 'none';

        const tituloBusqueda = document.querySelector('#titulo-busqueda');
        if (tituloBusqueda) {
            tituloBusqueda.textContent = '';
        }
    });

    const contactoNav = navItems[2];
    const contactoSection = document.querySelector('#contacto');

    contactoNav.addEventListener('click', function () {
        window.scrollTo({
            top: contactoSection.offsetTop - 70,
            behavior: 'smooth'
        });
    });

    const favoritosNav = document.querySelector('#favoritos-nav');

    favoritosNav.addEventListener('click', function () {
        console.log("Mostrar favoritos - función a implementar");
    });
});

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
