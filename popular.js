

const buscarPeliculasPopulares = async () => {

    const API_KEY_ = 'c7d88753768eedf47e4b16a8d964b98d';
        // obtenemos la region desde donde se visita la pagina, en caso de no poder obtener la region 
    // se pone la region en ingles
    const regionActual = new Intl.DateTimeFormat().resolvedOptions().locale || "en-US";
    const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY_}&language=${regionActual}`;

    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) {
            throw new Error(`HTTP error! Status: ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        return datos;

    } catch (error) {
        console.error("Error al consultar los más populares:", error);
        return null; // Devuelve null en caso de error
    }
};

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

document.addEventListener("DOMContentLoaded", async () => {
    const resultados = await buscarPeliculasPopulares();

    if (resultados.results) {
        mostrarResultados(resultados.results);
    }

    console.log(resultados.results)
});
