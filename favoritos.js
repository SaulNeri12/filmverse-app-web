
/**
 * @author Carlos Damian
 */

// scriptCarlosDamian.js - Sistema de Favoritos
document.addEventListener("DOMContentLoaded", () => {
    // Inicializar favoritos desde localStorage
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    
    // Configurar el elemento de navegación "Favoritos"
    configurarNavFavoritos();
    
    // Iniciar observador para detectar nuevas películas añadidas
    iniciarObservadorPeliculas();
    
    // Inicializar botones en películas existentes
    setTimeout(inicializarBotonesFavoritos, 500); // Pequeño retraso para asegurar que las películas se hayan cargado
    
    /**
     * Configura el elemento "Favoritos" en la barra de navegación
     */
    function configurarNavFavoritos() {
        const navFavoritos = document.getElementById("favoritos-nav");
        if (!navFavoritos) return;
        
        // Agregar contador de favoritos
        const contadorFavoritos = document.createElement("span");
        contadorFavoritos.classList.add("contador-favoritos");
        contadorFavoritos.textContent = favoritos.length;
        navFavoritos.appendChild(contadorFavoritos);
        
        // Añadir evento click
        navFavoritos.style.cursor = "pointer";
        navFavoritos.addEventListener("click", mostrarPanelFavoritos);
    }
    
    /**
     * Inicializa el observador de mutaciones para detectar nuevas películas
     */
    function iniciarObservadorPeliculas() {
        const contenedorResultados = document.querySelector(".contenedor-resultados");
        if (!contenedorResultados) return;
        
        const observador = new MutationObserver((mutaciones) => {
            let debeInicializar = false;
            
            mutaciones.forEach(mutacion => {
                if (mutacion.type === 'childList' && mutacion.addedNodes.length > 0) {
                    debeInicializar = true;
                }
            });
            
            if (debeInicializar) {
                setTimeout(inicializarBotonesFavoritos, 100);
            }
        });
        
        observador.observe(contenedorResultados, { childList: true, subtree: true });
    }
    
    /**
     * Inicializa botones de favoritos en todas las tarjetas de películas
     */
    function inicializarBotonesFavoritos() {
        // Busca todas las tarjetas de películas en el contenedor de resultados
        const contenedorResultados = document.querySelector(".contenedor-resultados");
        if (!contenedorResultados) return;
        
        // Usa el selector específico para tus tarjetas de resultados
        const tarjetasPeliculas = contenedorResultados.querySelectorAll(".resultado");
        
        tarjetasPeliculas.forEach(tarjeta => {
            // Verificar si ya tiene botón de favorito
            if (tarjeta.querySelector(".btn-favorito-estrella")) return;
            
            // Obtener ID para la película
            let peliculaId = tarjeta.dataset.id;
            
            // Si no tiene ID, generamos uno
            if (!peliculaId) {
                const titulo = tarjeta.querySelector(".titulo");
                const img = tarjeta.querySelector("img");
                
                if (titulo) {
                    peliculaId = `pelicula-${titulo.textContent.trim().replace(/\s+/g, '-').toLowerCase()}`;
                } else if (img && img.alt) {
                    peliculaId = `pelicula-${img.alt.trim().replace(/\s+/g, '-').toLowerCase()}`;
                } else if (img && img.src) {
                    // Extraer nombre de archivo de la URL de la imagen
                    const urlPartes = img.src.split('/');
                    peliculaId = `pelicula-${urlPartes[urlPartes.length - 1].split('.')[0]}`;
                } else {
                    // Generar ID aleatorio como último recurso
                    peliculaId = `pelicula-${Math.random().toString(36).substring(2, 11)}`;
                }
                
                // Guardar el ID en el elemento para futuras referencias
                tarjeta.dataset.id = peliculaId;
            }
            
            // Obtener título e imagen
            let tituloPelicula = "Película";
            let imagenPelicula = "";
            
            // Intentar encontrar el título
            const elementoTitulo = tarjeta.querySelector(".titulo");
            if (elementoTitulo) tituloPelicula = elementoTitulo.textContent.trim();
            
            // Intentar encontrar la imagen
            const elementoImagen = tarjeta.querySelector(".portada");
            if (elementoImagen) imagenPelicula = elementoImagen.src;
            
            // Crear botón de favoritos
            const botonFavorito = document.createElement("button");
            botonFavorito.classList.add("btn-favorito-estrella");
            botonFavorito.dataset.id = peliculaId;
            botonFavorito.innerHTML = `<i class="fa-star ${favoritos.includes(peliculaId) ? 'fas' : 'far'}"></i>`;
            
            // Agregar botón a la tarjeta
            tarjeta.appendChild(botonFavorito);
            
            // Agregar evento click
            botonFavorito.addEventListener("click", function(e) {
                e.stopPropagation(); // Evitar propagación del clic
                toggleFavorito(peliculaId, tituloPelicula, imagenPelicula, this);
            });
        });
    }
    
    /**
     * Alterna el estado de favorito de una película
     */
    function toggleFavorito(peliculaId, tituloPelicula, imagenPelicula, boton) {
        // Obtener lista actual de favoritos
        const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
        const estrella = boton.querySelector("i");
        
        if (favoritos.includes(peliculaId)) {
            // Quitar de favoritos
            const index = favoritos.indexOf(peliculaId);
            favoritos.splice(index, 1);
            estrella.classList.remove("fas");
            estrella.classList.add("far");
        } else {
            // Agregar a favoritos
            favoritos.push(peliculaId);
            estrella.classList.remove("far");
            estrella.classList.add("fas");
            
            // Guardar información adicional
            guardarInfoPelicula(peliculaId, tituloPelicula, imagenPelicula);
        }
        
        // Actualizar localStorage
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        
        // Actualizar contador en la navegación
        actualizarContadorFavoritos(favoritos.length);
    }
    
    /**
     * Guarda información adicional sobre la película en localStorage
     */
    function guardarInfoPelicula(id, titulo, imagen) {
        const peliculasInfo = JSON.parse(localStorage.getItem("peliculasInfo")) || [];
        const infoPelicula = {
            id: id,
            titulo: titulo,
            imagen: imagen
        };
        
        // Verificar si ya existe esta película
        const indexExistente = peliculasInfo.findIndex(p => p.id === id);
        
        if (indexExistente !== -1) {
            peliculasInfo[indexExistente] = infoPelicula;
        } else {
            peliculasInfo.push(infoPelicula);
        }
        
        localStorage.setItem("peliculasInfo", JSON.stringify(peliculasInfo));
    }
    
    /**
     * Actualiza el contador de favoritos en la navegación
     */
    function actualizarContadorFavoritos(cantidad) {
        const contador = document.querySelector(".contador-favoritos");
        if (contador) contador.textContent = cantidad;
    }
    
    /**
     * Muestra el panel de películas favoritas
     */
    function mostrarPanelFavoritos() {
        // Eliminar panel existente si hay uno
        const panelExistente = document.querySelector(".panel-favoritos");
        if (panelExistente) {
            panelExistente.remove();
            return;
        }
        
        // Obtener lista actual de favoritos
        const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
        
        // Crear panel
        const panelFavoritos = document.createElement("div");
        panelFavoritos.classList.add("panel-favoritos");
        
        // Agregar encabezado
        const headerPanel = document.createElement("div");
        headerPanel.classList.add("header-panel-favoritos");
        headerPanel.innerHTML = `
            <h3>Mis Películas Favoritas</h3>
            <button class="btn-cerrar-panel">&times;</button>
        `;
        panelFavoritos.appendChild(headerPanel);
        
        // Agregar evento al botón cerrar
        headerPanel.querySelector(".btn-cerrar-panel").addEventListener("click", () => {
            panelFavoritos.remove();
        });
        
        // Crear contenedor para las películas
        const contenedorPeliculas = document.createElement("div");
        contenedorPeliculas.classList.add("contenedor-peliculas-favoritas");
        
        if (favoritos.length === 0) {
            // Mostrar mensaje si no hay favoritos
            contenedorPeliculas.innerHTML = `
                <div class="mensaje-sin-favoritos">
                    <p>No tienes películas favoritas</p>
                    <p>Agrega tus películas favoritas haciendo clic en la estrella ⭐</p>
                </div>
            `;
        } else {
            // Obtener información detallada de las películas
            const peliculasInfo = JSON.parse(localStorage.getItem("peliculasInfo")) || [];
            
            // Mostrar cada película favorita
            favoritos.forEach(peliculaId => {
                // Buscar info de la película
                const infoPelicula = peliculasInfo.find(p => p.id === peliculaId) || {
                    id: peliculaId,
                    titulo: "Película desconocida",
                    imagen: "iconos/logo2.png"
                };
                
                // Crear elemento para la película
                const itemFavorito = document.createElement("div");
                itemFavorito.classList.add("item-favorito");
                itemFavorito.innerHTML = `
                    <img src="${infoPelicula.imagen}" alt="${infoPelicula.titulo}" onerror="this.src='iconos/logo2.png'">
                    <div class="info-favorito">
                        <h4>${infoPelicula.titulo}</h4>
                        <button class="btn-quitar-favorito" data-id="${peliculaId}">
                            <i class="fas fa-star"></i> Quitar de favoritos
                        </button>
                    </div>
                `;
                
                // Agregar evento para quitar de favoritos
                itemFavorito.querySelector(".btn-quitar-favorito").addEventListener("click", (e) => {
                    e.stopPropagation();
                    quitarDeFavoritos(peliculaId, itemFavorito);
                });
                
                contenedorPeliculas.appendChild(itemFavorito);
            });
        }
        
        panelFavoritos.appendChild(contenedorPeliculas);
        document.body.appendChild(panelFavoritos);
    }
    
    /**
     * Quita una película de la lista de favoritos
     */
    function quitarDeFavoritos(peliculaId, elementoFavorito) {
        // Obtener lista actual de favoritos
        const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
        
        // Quitar de la lista
        const index = favoritos.indexOf(peliculaId);
        if (index !== -1) {
            favoritos.splice(index, 1);
            
            // Actualizar localStorage
            localStorage.setItem("favoritos", JSON.stringify(favoritos));
            
            // Actualizar contador
            actualizarContadorFavoritos(favoritos.length);
            
            // Actualizar estrella en la tarjeta de película si está visible
            const botonEstrella = document.querySelector(`.btn-favorito-estrella[data-id="${peliculaId}"]`);
            if (botonEstrella) {
                const estrella = botonEstrella.querySelector("i");
                estrella.classList.remove("fas");
                estrella.classList.add("far");
            }
            
            // Eliminar elemento de la lista
            elementoFavorito.remove();
            
            // Mostrar mensaje si no hay más favoritos
            if (favoritos.length === 0) {
                const contenedor = document.querySelector(".contenedor-peliculas-favoritas");
                if (contenedor) {
                    contenedor.innerHTML = `
                        <div class="mensaje-sin-favoritos">
                            <p>No tienes películas favoritas</p>
                            <p>Agrega tus películas favoritas haciendo clic en la estrella ⭐</p>
                        </div>
                    `;
                }
            }
        }
    }
});