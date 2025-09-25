// script.js
document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('coronary-map-container');
    const form = document.getElementById('finding-form');
    const findingsList = document.getElementById('findings-list');
    const coordXInput = document.getElementById('coord-x');
    const coordYInput = document.getElementById('coord-y');

    let clickCoords = null;

    // 1. Capturar las coordenadas del clic en la imagen
    mapContainer.addEventListener('click', (event) => {
        // Calcula la posición del clic relativa a la esquina superior izquierda de la imagen
        const rect = mapContainer.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Guarda las coordenadas para el formulario
        clickCoords = { x, y };
        coordXInput.value = x;
        coordYInput.value = y;
        
        console.log(`Clic en: X=${x}, Y=${y}`);
        alert('Ubicación seleccionada. Ahora completa y envía el formulario.');
    });

    // 2. Manejar el envío del formulario para añadir un hallazgo
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que la página se recargue

        if (!clickCoords) {
            alert('Por favor, haz clic en la imagen para seleccionar una ubicación primero.');
            return;
        }

        const artery = form.elements['artery'].value;
        const cadsRads = form.elements['cads-rads'].value;
        
        // Crea y añade el marcador visual en la imagen
        addMarker(clickCoords.x, clickCoords.y, cadsRads, artery);

        // Añade el hallazgo a la lista del resumen
        addFindingToList(artery, cadsRads);

        // Resetea el formulario y las coordenadas
        form.reset();
        clickCoords = null;
        coordXInput.value = '';
        coordYInput.value = '';
    });

    // Función para crear un marcador visual en el mapa
    function addMarker(x, y, cadsRads, artery) {
        const marker = document.createElement('div');
        marker.className = `marker cads-${cadsRads}`;
        marker.style.left = `${x}px`;
        marker.style.top = `${y}px`;
        marker.title = `${artery} - CAD-RADS ${cadsRads}`; // Tooltip al pasar el mouse
        
        mapContainer.appendChild(marker);
    }

    // Función para añadir el texto del hallazgo a la lista
    function addFindingToList(artery, cadsRads) {
        const listItem = document.createElement('li');
        listItem.textContent = `Arteria: ${artery}, Nivel: CAD-RADS ${cadsRads}`;
        findingsList.appendChild(listItem);
    }
});