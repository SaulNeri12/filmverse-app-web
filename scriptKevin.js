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