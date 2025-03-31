const API_KEY = 'c7d88753768eedf47e4b16a8d964b98d';
const API_URL = 'https://api.themoviedb.org/3/search/multi?api_key=' + API_KEY + '&language=es-ES&query=';

// Función para mostrar indicador de carga
function mostrarCargando() {
    const contenedorResultados = document.querySelector('.contenedor-resultados');
    contenedorResultados.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Buscando películas...</p>
        </div>
    `;
}

// Configuración de listeners de eventos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const campoBusqueda = document.getElementById('input-busqueda');
    const botonBuscar = document.getElementById('btn-buscar');

    // Buscar al hacer clic en el botón
    botonBuscar.addEventListener('click', () => {
        const consulta = campoBusqueda.value.trim();
        if (consulta) {
            mostrarCargando();
            buscarPelicula(consulta);
        }
    });

    // Buscar al presionar Enter en el campo de búsqueda
    campoBusqueda.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const consulta = campoBusqueda.value.trim();
            if (consulta) {
                mostrarCargando();
                buscarPelicula(consulta);
            }
        }
    });

    // Desplazamiento suave hacia los resultados
    botonBuscar.addEventListener('click', () => {
        setTimeout(() => {
            document.querySelector('.contenedor-resultados').scrollIntoView({
                behavior: 'smooth'
            });
        }, 500);
    });
});

// Función principal para buscar películas a través de la API
async function buscarPelicula(consulta) {
    try {
        const respuesta = await fetch(API_URL + encodeURIComponent(consulta));
        const datos = await respuesta.json();

        if (datos.results && datos.results.length > 0) {
            mostrarResultados(datos.results);
        } else {
            mostrarNoResultados(consulta);
        }
    } catch (error) {
        mostrarError(error);
    }
}

// Función para mostrar resultados de búsqueda

function mostrarResultados(resultados) {
    const contenedor = document.querySelector('.contenedor-resultados');
    contenedor.innerHTML = '';

    // Limitamos a 10 resultados para mejor rendimiento
    resultados.slice(0, 10).forEach(pelicula => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('resultado');
        // Añadimos un ID único para la funcionalidad de favoritos
        tarjeta.dataset.id = `${pelicula.media_type}-${pelicula.id}`;

        // Verificamos si hay imagen de portada, si no usamos imagen por defecto
        const imagen = pelicula.poster_path
            ? `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`
            : 'imagenes/no-image.png';

        // Determinamos el tipo de contenido (película, serie o persona)
        const tipo = pelicula.media_type === 'movie' ? 'Película' : pelicula.media_type === 'tv' ? 'Serie' : 'Persona';

        // Limitamos la descripción para mejor visualización
        const descripcionCompleta = pelicula.overview || 'Sin descripción disponible.';
        const descripcionLimitada = descripcionCompleta.length > 171 ? descripcionCompleta.substring(0, 171) + '...' : descripcionCompleta;

        // Obtenemos el nombre del género a partir del ID
        const genero = pelicula.genre_ids && pelicula.genre_ids.length > 0
            ? getGeneroNombre(pelicula.genre_ids[0])
            : 'Desconocido';

        // Creamos representación visual de calificación con estrellas
        const calificacion = pelicula.vote_average || 0;
        const estrellas = generarEstrellas(calificacion);

        // Estructura HTML de la tarjeta de resultado con contenedor para imagen
        tarjeta.innerHTML = `
            <div class="portada-container">
                <img src="${imagen}" alt="Portada de ${pelicula.title || pelicula.name}" class="portada">
            </div>
            <div class="informacion-pelicula">
                <div class="header-info">
                    <h3 class="titulo">${pelicula.title || pelicula.name}</h3>
                    <span class="tipo-badge">${tipo}</span>
                </div>
                <p class="fecha-lanzamiento">${formatearFecha(pelicula.release_date || pelicula.first_air_date) || 'Fecha desconocida'}</p>
                <p class="genero"><b>Género:</b> ${genero}</p>
                <p class="calificacion"><b>Calificación: </b> ${pelicula.vote_average ? pelicula.vote_average.toFixed(1) : '0.0'} <span class="star-rating">${estrellas}</span></p>
                <p class="numero-votos"><b>Número de votos: </b>${pelicula.vote_count ? pelicula.vote_count.toLocaleString() : '0'}</p>
                <p class="descripcion"><b>Descripción:</b> ${descripcionLimitada}</p>
                <button class="btn-detalles">Ver detalles</button>
            </div>
        `;

        contenedor.appendChild(tarjeta);

        // Añadir evento de clic para toda la tarjeta
        tarjeta.addEventListener('click', () => {
            // Aquí se podría abrir un modal con detalles o navegar a una página de detalles
            console.log(`Clic en: ${pelicula.title || pelicula.name}`);
        });
    });
}

// Función para mostrar mensaje cuando no hay resultados
function mostrarNoResultados(consulta) {
    const contenedor = document.querySelector('.contenedor-resultados');
    contenedor.innerHTML = `
        <div class="no-resultados">
            <img src="imagenes/no-results.png" alt="No hay resultados" class="no-results-img">
            <h2>No se encontraron resultados para "${consulta}"</h2>
            <p>Intenta con otro término de búsqueda</p>
        </div>
    `;
}

// Función para mostrar mensaje de error
function mostrarError(error) {
    const contenedor = document.querySelector('.contenedor-resultados');
    contenedor.innerHTML = `
        <div class="error-message">
            <h2>Ocurrió un error al realizar la búsqueda</h2>
            <p>Por favor, intenta de nuevo más tarde</p>
            <small>Detalles técnicos: ${error.message}</small>
        </div>
    `;
}

// Función para generar representación visual de estrellas según calificación
function generarEstrellas(calificacion) {
    const estrellasTotales = 5;
    const porcentajeEstrellas = (calificacion / 10) * estrellasTotales;
    const estrellasCompletas = Math.floor(porcentajeEstrellas);
    const estrellaMedia = porcentajeEstrellas % 1 >= 0.5 ? 1 : 0;
    const estrellasVacias = estrellasTotales - estrellasCompletas - estrellaMedia;

    let estrellas = '';

    // Añadir estrellas completas
    for (let i = 0; i < estrellasCompletas; i++) {
        estrellas += '★';
    }

    // Añadir media estrella si es necesario
    if (estrellaMedia) {
        estrellas += '⯪'; // Representación de media estrella
    }

    // Añadir estrellas vacías
    for (let i = 0; i < estrellasVacias; i++) {
        estrellas += '☆';
    }

    return estrellas;
}

// Función para formatear fechas en formato español

function formatearFecha(fechaStr) {
    if (!fechaStr) return null;

    const fecha = new Date(fechaStr);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
}

// Función para obtener el nombre del género a partir del ID
function getGeneroNombre(genreId) {
    const generos = {
        28: 'Acción',
        12: 'Aventura',
        16: 'Animación',
        35: 'Comedia',
        80: 'Crimen',
        99: 'Documental',
        18: 'Drama',
        10751: 'Familiar',
        14: 'Fantasía',
        36: 'Historia',
        27: 'Terror',
        10402: 'Música',
        9648: 'Misterio',
        10749: 'Romántico',
        878: 'Ciencia ficción',
        10770: 'Película de TV',
        53: 'Suspenso',
        10752: 'Bélica',
        37: 'Western'
    };

    return generos[genreId] || 'Desconocido';
}