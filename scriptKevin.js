const API_KEY = 'c7d88753768eedf47e4b16a8d964b98d';
const API_URL = 'https://api.themoviedb.org/3/search/multi?api_key=' + API_KEY + '&language=es-ES&query=';

document.getElementById('btn-buscar').addEventListener('click', () => {
    const query = document.getElementById('input-busqueda').value.trim();
    if (query) {
        buscarPelicula(query);
    }
});

async function buscarPelicula(query) {
    try {
        const response = await fetch(API_URL + encodeURIComponent(query));
        const data = await response.json();
        mostrarResultados(data.results);
    } catch (error) {
        alert('Error al buscar:', error);
    }
}

function mostrarResultados(resultados) {
    const contenedor = document.querySelector('.contenedor-resultados');
    contenedor.innerHTML = ''; 

    resultados.slice(0, 10).forEach(pelicula => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('resultado');
        
        const imagen = pelicula.poster_path 
            ? `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`
            : 'imagenes/no-image.png'; 

        
        const descripcionCompleta = pelicula.overview || 'Sin descripción disponible.';
        const descripcionLimitada = descripcionCompleta.length > 171 ? descripcionCompleta.substring(0, 171) + '...' : descripcionCompleta;

        
        const genero = pelicula.genre_ids && pelicula.genre_ids.length > 0 
            ? getGeneroNombre(pelicula.genre_ids[0]) 
            : 'Desconocido';

        tarjeta.innerHTML = `

            <image src="${imagen}" alt="Portada de la película" class="portada"></image>
             
            <div class="informacion-pelicula">
                <h3 class="titulo"><i>${pelicula.title || pelicula.name}</i></h3>
                <p class="fecha-lanzamiento">${pelicula.release_date || pelicula.first_air_date || 'Fecha desconocida'}</p>
                <p class="genero"><b>Género:</b> ${genero}</p>
                <p class="calificacion"><b>Calificación: </b> ${pelicula.vote_average.toFixed(1)} </p>
                <p class="numero-votos"><b>numero de votos: </b>${pelicula.vote_count}</p>
                <p class="descripcion"><b>Descripción:</b> ${descripcionLimitada}</p>
            </div>
        `;

        contenedor.appendChild(tarjeta);
    });
}


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