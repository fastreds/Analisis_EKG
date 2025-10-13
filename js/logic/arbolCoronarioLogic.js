import { posicionesDerecha, posicionesIzquierda, posicionesCodominancia } from '../data/posicionesDominancia.js';


export function initCoronarySketch() {
    // --- 1. INICIALIZACIÓN Y DECLARACIÓN DE CONSTANTES ---
    console.log('[arbolCoronarioLogic.js] Iniciando lógica del croquis...');
    const sketchContainer = document.getElementById('sketch-container');
    if (!sketchContainer) {
        console.error("El contenedor del croquis ('sketch-container') no se encontró. La inicialización del croquis ha fallado.");
        return;
    }
    
    // Elementos del DOM para la ventana modal
    const modal = document.getElementById('segment-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    
    // --- 2. ESTILOS Y DEFINICIONES SVG ---
    // Ruta de la imagen de fondo por defecto para el croquis.
    const defaultImagePath = "../../img/corazonSinetiquetas.png";

    // Definiciones SVG, incluyendo un filtro para dar un efecto 3D a los vasos.
    const svgDefs = `
        <defs>
            <filter id="filtro-tubo" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur"/>
                <feOffset in="blur" dx="2" dy="3" result="offsetBlur"/>
                <feSpecularLighting in="blur" surfaceScale="7" specularConstant="1.2" specularExponent="40" lighting-color="#eeeeee" result="specOut">
                    <fePointLight x="-5000" y="-10000" z="20000"/>
                </feSpecularLighting>
                <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
                <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint"/>
                <feMerge>
                    <feMergeNode in="offsetBlur"/>
                    <feMergeNode in="litPaint"/>
                </feMerge>
            </filter>
        </defs>
    `;

    // Plantillas HTML para los tres SVGs de dominancia (derecha, izquierda, codominancia).
    const sketches = {
        derecha: `<svg id="svg-derecha" viewBox="0 0 400 400">${svgDefs}<image href="${defaultImagePath}" class="bg-image" width="400" height="400"/></svg>`,
        izquierda: `<svg id="svg-izquierda" class="hidden" viewBox="0 0 400 400">${svgDefs}<image href="${defaultImagePath}" class="bg-image" width="400" height="400"/></svg>`,
        codominancia: `<svg id="svg-codominancia" class="hidden" viewBox="0 0 400 400">${svgDefs}<image href="${defaultImagePath}" class="bg-image" width="400" height="400"/></svg>`
    };
    sketchContainer.innerHTML = sketches.derecha + sketches.izquierda + sketches.codominancia;
    
    // --- 3. ESTADO DE LA APLICACIÓN ---
    // Variables para mantener el estado de los datos de los segmentos, el modo de edición y la gestión del modal.
    let segmentsData = [];
    let isEditMode = false;
    let originalSegmentParent = null;
    let originalSegmentNextSibling = null;

    // --- 4. FUNCIONES PRINCIPALES DE DIBUJO Y ACTUALIZACIÓN ---
    // Lee los datos del formulario y actualiza el croquis SVG con los marcadores y colores correspondientes.
    const updateSketchFromForm = () => { 
        const currentSVG = sketchContainer.querySelector('svg:not(.hidden)');
        if (!currentSVG) return;
        
        d3.select(currentSVG).selectAll('.plaque-marker, .stent-marker, .bridge-marker, .aneurysm-marker').remove();

        const segments = window.reportStructure.find(s => s.id === 'evaluacion_segmento').segments;
        segments.forEach(segment => {
            const group = d3.select(currentSVG).select(`#g-segment-${segment.id}`);
            if (group.empty()) return;
            
            const path = group.select('path');
            if (path.empty()) return;

            let maxStenosisValue = 0;
            const plaqueContainer = document.getElementById(`repeat-container-evaluacion_segmento-${segment.id}-findings-placas`);
            if (plaqueContainer) {
                plaqueContainer.querySelectorAll('.repeat-item').forEach((item, index) => {
                    const stenosisSelect = item.querySelector(`[name$="estenosis"]`);
                    if (stenosisSelect && stenosisSelect.value) {
                        const value = stenosisSelect.value;
                        let currentStenosisLevel = 0;
                        if (value.includes('Severa') || value.includes('Oclusión')) currentStenosisLevel = 4;
                        else if (value.includes('Moderada')) currentStenosisLevel = 3;
                        else if (value.includes('Leve')) currentStenosisLevel = 2;
                        else if (value.includes('Mínima')) currentStenosisLevel = 1;
                        maxStenosisValue = Math.max(maxStenosisValue, currentStenosisLevel);
                        
                        const point = path.node().getPointAtLength(path.node().getTotalLength() * (0.3 + index * 0.2));
                        group.append('circle')
                            .attr('class', `plaque-marker stenosis-${currentStenosisLevel}`)
                            .attr('cx', point.x)
                            .attr('cy', point.y)
                            .attr('r', 5);
                    }
                });
            }

            const stentContainer = document.getElementById(`repeat-container-evaluacion_segmento-${segment.id}-findings-stents`);
             if (stentContainer && stentContainer.querySelector('.repeat-item')) {
                const pathNode = path.node();
                const totalLength = pathNode.getTotalLength();
                const numCircles = Math.floor(totalLength / 10); // Un círculo cada 10px
                for (let i = 0; i <= numCircles; i++) {
                    const point = pathNode.getPointAtLength(i * (totalLength / numCircles));
                    group.append('circle')
                        .attr('class', 'stent-circle-marker')
                        .attr('cx', point.x)
                        .attr('cy', point.y)
                        .attr('r', 4); // Radio de los círculos del stent
                }
            }

            const bridgeCheckbox = document.getElementById(`evaluacion_segmento-${segment.id}-findings-has_puente`);
            if(bridgeCheckbox && bridgeCheckbox.checked){
                 group.insert('path', 'path:first-of-type')
                    .attr('class', 'bridge-marker')
                    .attr('d', path.attr('d'));
            }
            
            const aneurysmCheckbox = document.getElementById(`evaluacion_segmento-${segment.id}-findings-has_aneurisma`);
            if(aneurysmCheckbox && aneurysmCheckbox.checked){
                const point = path.node().getPointAtLength(path.node().getTotalLength() * 0.5);
                group.append('circle')
                    .attr('class', 'aneurysm-marker')
                    .attr('cx', point.x)
                    .attr('cy', point.y)
                    .attr('r', 8);
            }

            path.attr('class', `segment-path stenosis-${maxStenosisValue}`);
        });
    };
    
    // Muestra u oculta campos condicionales en el formulario según la selección del usuario (ej. mostrar detalles de estenosis).
    const handleTriggers = (element) => { 
        const triggerId = element.dataset.triggers;
        if (!triggerId) return;

        const parentContainer = element.closest('.repeat-item, .segment-container, .p-6');
        if (!parentContainer) {
            console.warn('No se encontró un contenedor padre lógico para el trigger:', element);
            return;
        }

        const targetIdSuffix = triggerId.replace('show_', '');
        const targetElement = parentContainer.querySelector(`[id$="-${targetIdSuffix}"]`);

        if (targetElement) {
            // Si es un radio button, oculta los targets de los otros radios del mismo grupo
            if (element.type === 'radio') {
                const groupName = element.name;
                const radiosInGroup = parentContainer.querySelectorAll(`input[type="radio"][name="${groupName}"]`);

                radiosInGroup.forEach(radio => {
                    if (radio !== element) {
                        const otherTriggerId = radio.dataset.triggers;
                        if (otherTriggerId) {
                            const otherTargetIdSuffix = otherTriggerId.replace('show_', '');
                            const otherTargetElement = parentContainer.querySelector(`[id$="-${otherTargetIdSuffix}"]`);
                            if (otherTargetElement) {
                                otherTargetElement.classList.add('hidden');
                            }
                        }
                    }
                });
            }

            // Muestra u oculta el target del elemento actual
            targetElement.classList.toggle('hidden', !element.checked);
        } else {
            console.warn('Elemento objetivo no encontrado para el trigger:', triggerId, 'en', parentContainer);
        }
    };

    // --- 5. LÓGICA DE LA VENTANA MODAL ---
    // Abre la ventana modal para editar un segmento específico, moviendo su formulario al modal.
    const openSegmentModal = (segmentId) => { 
        const segmentForm = document.getElementById(`form-segment-${segmentId}`);
        const segmentData = window.reportStructure.find(s => s.id === 'evaluacion_segmento').segments.find(s => s.id === segmentId);

        if (segmentForm && segmentData) {
            originalSegmentParent = segmentForm.parentNode;
            originalSegmentNextSibling = segmentForm.nextSibling;

            modalTitle.textContent = `Editando: ${segmentData.name}`;
            modalContent.innerHTML = '';
            modalContent.appendChild(segmentForm);

            modal.classList.remove('hidden');
        }
    };

    // Cierra la ventana modal y devuelve el formulario del segmento a su posición original en el DOM.
    const closeSegmentModal = () => { 
        const segmentForm = modalContent.querySelector('.segment-container');
        if (segmentForm && originalSegmentParent) {
            originalSegmentParent.insertBefore(segmentForm, originalSegmentNextSibling);
        }
        modal.classList.add('hidden');
        originalSegmentParent = null;
        originalSegmentNextSibling = null;
    };

    // --- 6. LÓGICA DE INTERACCIÓN 3D Y EDICIÓN ---
    // Configura el arrastre del ratón para simular una rotación 3D del croquis.
    const setup3DRotation = () => { 
        let rotation = { x: 0, y: 0 };
        const drag3D = d3.drag()
            .filter(() => !isEditMode)
            .on('start', () => {
                d3.select(sketchContainer).style('cursor', 'grabbing');
            })
            .on('drag', (event) => {
                const sensitivity = 0.25;
                rotation.y += event.dx * sensitivity;
                rotation.x -= event.dy * sensitivity;
                rotation.x = Math.max(-60, Math.min(60, rotation.x));
                d3.selectAll('#sketch-container svg')
                  .style('transform', `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`);
            })
            .on('end', () => {
                d3.select(sketchContainer).style('cursor', 'grab');
            });
        d3.select(sketchContainer).call(drag3D);
    };

    // Actualiza el <textarea> de depuración con las posiciones actuales de los segmentos en formato JSON.
    function updatePositionsArrayOutput() { 
        const output = document.getElementById('array-output');
        if (!output) return;
        const updatedSegments = segmentsData.map(seg => {
            const group = d3.select(`svg:not(.hidden)`).select(`#g-segment-${seg.id}`);
            const transform = group.empty() ? seg.transform : group.attr('transform');
            return {
                ...seg,
                transform: transform || "translate(0,0) rotate(0)"
            };
        });
        
        output.value = `export const newPositions = ${JSON.stringify(updatedSegments, (key, value) => key === 'points' ? undefined : value, 4)};`;
    }

    // Añade el comportamiento de arrastre a los grupos de segmentos para moverlos en el modo de edición.
    function addDragBehavior(group) { 
        const drag = d3.drag()
            .filter(() => isEditMode)
            .on('start', function(event) {
                d3.select(this).raise().style('cursor', 'grabbing');
                const transform = d3.select(this).attr('transform') || "translate(0,0) rotate(0)";
                const translateMatch = /translate\(([^,]+),([^)]+)\)/.exec(transform);
                const rotateMatch = /rotate\(([^)]+)\)/.exec(transform);

                this.__initialT = {
                    x: translateMatch ? parseFloat(translateMatch[1]) : 0,
                    y: translateMatch ? parseFloat(translateMatch[2]) : 0,
                };
                this.__initialR = rotateMatch ? parseFloat(rotateMatch[1]) : 0;
                this.__dragStart = { x: event.x, y: event.y };
            })
            .on('drag', function(event) {
                const bbox = this.getBBox();
                const rotateCenterX = bbox.x + bbox.width / 2;
                const rotateCenterY = bbox.y + bbox.height / 2;
                let newTransform;

                if (event.sourceEvent.shiftKey) {
                    const centerX = this.__initialT.x + rotateCenterX;
                    const centerY = this.__initialT.y + rotateCenterY;
                    const svgPoint = d3.pointer(event.sourceEvent, sketchContainer.querySelector('svg:not(.hidden)'));
                    const angle = Math.atan2(svgPoint[1] - centerY, svgPoint[0] - centerX) * 180 / Math.PI;
                    this.__initialR = angle;
                    newTransform = `translate(${this.__initialT.x}, ${this.__initialT.y}) rotate(${this.__initialR}, ${rotateCenterX}, ${rotateCenterY})`;
                } else {
                    const dx = event.x - this.__dragStart.x;
                    const dy = event.y - this.__dragStart.y;
                    newTransform = `translate(${this.__initialT.x + dx}, ${this.__initialT.y + dy}) rotate(${this.__initialR}, ${rotateCenterX}, ${rotateCenterY})`;
                }
                d3.select(this).attr('transform', newTransform);
            })
            .on('end', function() {
                d3.select(this).style('cursor', 'move');
                updatePositionsArrayOutput();
            });
        
        group.call(drag);
    }
    
    // Añade el comportamiento de arrastre a los puntos de control de los segmentos para modificar su trazado.
    function addHandleDragBehavior(handles) { 
        const handleDrag = d3.drag()
            .filter(() => isEditMode)
            .on('start', function() { d3.select(this).raise().attr('r', 8); })
            .on('drag', function(event, d) {
                const segmentGroup = d3.select(this.parentNode);
                const segmentId = parseInt(segmentGroup.attr('id').replace('g-segment-', ''));
                const segment = segmentsData.find(s => s.id === segmentId);
                
                if (segment) {
                    segment.points[d.index] = [event.x, event.y];
                    
                    const pathGenerator = d3.line().curve(d3.curveBasis);
                    segmentGroup.select('path').attr('d', pathGenerator(segment.points));

                    d3.select(this).attr('cx', event.x).attr('cy', event.y);
                }
            })
            .on('end', function() { 
                d3.select(this).attr('r', 5);
                updatePositionsArrayOutput();
            });
        
        handles.call(handleDrag);
    }

    // Dibuja los segmentos coronarios en el SVG activo según la dominancia seleccionada.
    function drawSegments() { 
        console.log('[drawSegments] 1. Iniciando redibujo de segmentos.');
        const dominanceRadio = document.querySelector('input[name="anatomia_general-dominancia"]:checked');
        console.log('[drawSegments] 2. Buscando radio de dominancia seleccionado:', dominanceRadio);

        if (!dominanceRadio) {
            console.warn('[drawSegments] 2.1. ¡No se encontró un radio de dominancia seleccionado! Reintentando en 100ms.');
            setTimeout(drawSegments, 100); // Reintentar si el form no está listo
            return;
        }
        const dominance = dominanceRadio.value || 'Dominancia Derecha';
        console.log(`[drawSegments] 3. Valor de dominancia obtenido: "${dominance}"`);
        let currentDominanceKey = 'derecha';
        if (dominance.includes('Izquierda')) currentDominanceKey = 'izquierda';
        if (dominance.includes('Codominancia')) currentDominanceKey = 'codominancia';
        
        const dominanceTitle = document.getElementById('dominance-title');
        if (dominanceTitle) {
            dominanceTitle.textContent = dominance;
        }

        switch (currentDominanceKey) {
            case 'izquierda':
                segmentsData = JSON.parse(JSON.stringify(posicionesIzquierda));
                break;
            case 'codominancia':
                segmentsData = JSON.parse(JSON.stringify(posicionesCodominancia));
                break;
            case 'derecha':
            default:
                segmentsData = JSON.parse(JSON.stringify(posicionesDerecha));
                break;
        }
        console.log(`[drawSegments] 4. Modelo de posiciones '${currentDominanceKey}' seleccionado. Total de segmentos a procesar: ${segmentsData.length}`);
        
        d3.selectAll('svg').selectAll('.segment-group').remove();

        segmentsData.forEach(seg => {
            // console.log(`[drawSegments] 5. Procesando segmento: ${seg.name} (ID: ${seg.id})`);
            const formSegment = document.getElementById(`form-segment-${seg.id}`);
            if (formSegment) {
                const shouldShow = seg.dominance.includes(currentDominanceKey);
                formSegment.style.display = shouldShow ? '' : 'none';
            }

            if (seg.dominance.includes(currentDominanceKey)) {
                const svg = d3.select(`svg:not(.hidden)`);
                const group = svg.append('g').attr('id', `g-segment-${seg.id}`).attr('class', 'segment-group');
                console.log(`   -> Dibujando segmento ${seg.name} porque su dominancia (${seg.dominance}) incluye la actual (${currentDominanceKey}).`);

                const pathGenerator = d3.line().curve(d3.curveBasis);
                group.append('path')
                    .attr('data-segment-id', seg.id)
                    .attr('class', 'segment-path')
                    .attr('d', pathGenerator(seg.points));

                group.selectAll('.control-handle')
                    .data(seg.points)
                    .enter()
                    .append('circle')
                    .attr('class', 'control-handle')
                    .attr('cx', d => d[0])
                    .attr('cy', d => d[1]) 
                    .attr('r', 5)
                    .datum((d, i) => ({ index: i }));
                
                group.append('text')
                    .attr('class', 'segment-label')
                    .attr('x', seg.labelPos.x)
                    .attr('y', seg.labelPos.y)
                    .text(seg.name);
                
                if (seg.transform) {
                    group.attr('transform', seg.transform);
                }
            }
        });
        console.log('[drawSegments] 6. Dibujo de segmentos completado. Adjuntando eventos de arrastre y clic.');
        addDragBehavior(d3.selectAll('.segment-group'));
        updateSketchFromForm();
        d3.selectAll('.segment-group').on('click', function(event) {
            if (!isEditMode) {
                const segmentId = parseInt(d3.select(this).attr('id').replace('g-segment-', ''));
                openSegmentModal(segmentId);
            }
            event.stopPropagation();
        });
        addHandleDragBehavior(d3.selectAll('.control-handle'));
        updatePositionsArrayOutput();
    }
    
    // Construye y muestra la leyenda de simbología (colores de estenosis, stents, etc.).
    function buildLegend() { 
       const legendData = [
            { class: 'stenosis-1', label: 'Mínima (1-24%)' },
            { class: 'stenosis-2', label: 'Leve (25-49%)' },
            { class: 'stenosis-3', label: 'Moderada (50-69%)' },
            { class: 'stenosis-4', label: 'Severa/Oclusión (≥70%)' },
            { symbol: 'stent', label: 'Stent' },
            { symbol: 'bridge', label: 'Puente Miocárdico' },
            { symbol: 'aneurysm', label: 'Aneurisma' },
        ];
        const container = document.getElementById('legend-container');
        if (!container) return;
        let html = '<h4 class="font-semibold text-center mb-2">Simbología</h4><div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">';
        legendData.forEach(item => {
            html += '<div class="flex items-center">';
            if (item.class) {
                html += `<div class="w-4 h-4 rounded-full mr-2 legend-swatch ${item.class}"></div>`;
            } else {
                html += `<svg class="w-4 h-4 mr-2" viewBox="0 0 20 20">`;
                if(item.symbol === 'stent') html += `<path d="M0 10 H 20" class="stent-marker" stroke-width="5"/>`;
                if(item.symbol === 'bridge') html += `<path d="M0 10 H 20" class="bridge-marker" stroke-width="8"/>`;
                if(item.symbol === 'aneurysm') html += `<circle cx="10" cy="10" r="8" class="aneurysm-marker"/>`;
                html += `</svg>`;
            }
            html += `<span>${item.label}</span></div>`;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    // --- 7. MANEJADORES DE EVENTOS (EVENT LISTENERS) ---
    // Listener centralizado para cambios en el formulario que afectan al croquis.
    document.body.addEventListener('change', (e) => {
        const target = e.target;
        if (target.closest('.segment-container')) {
            updateSketchFromForm();
            if (target.matches('input[type="radio"], input[type="checkbox"]')) {
                handleTriggers(target);
            }
        }
        if (target.name === 'anatomia_general-dominancia') { // Corregido el selector
            document.getElementById('svg-derecha').classList.add('hidden');
            document.getElementById('svg-izquierda').classList.add('hidden');
            document.getElementById('svg-codominancia').classList.add('hidden');
            if (e.target.value.includes('Derecha')) document.getElementById('svg-derecha').classList.remove('hidden');
            if (e.target.value.includes('Izquierda')) document.getElementById('svg-izquierda').classList.remove('hidden');
            if (e.target.value.includes('Codominancia')) document.getElementById('svg-codominancia').classList.remove('hidden');
            drawSegments();
        }
    });

    // Listener para los botones de añadir/eliminar bloques repetibles (placas, stents).
    document.body.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('btn-add-repeatable')) {
            const templateId = target.dataset.templateId;
            const template = document.getElementById(templateId);
            const container = document.getElementById(`repeat-container-${templateId.replace('-template', '')}`);
            
            if (template && container) {
                const clone = template.content.cloneNode(true);
                const newItemIndex = container.children.length;
                const prefix = target.dataset.prefix;

                const titleEl = clone.querySelector('h6');
                if (titleEl) {
                    const titleText = prefix.includes('placas') ? 'Placa' : (prefix.includes('stents') ? 'Stent' : 'Item');
                    titleEl.textContent = `${titleText} #${newItemIndex + 1}`;
                }

                clone.querySelectorAll('[id]').forEach(el => {
                    const baseId = el.id.replace('placeholder_prefix-', '');
                    const newId = `${prefix}-${newItemIndex}-${baseId}`;
                    
                    const label = clone.querySelector(`label[for="${el.id}"]`);
                    if(label) label.setAttribute('for', newId);
                    el.id = newId;

                    if (el.name) {
                         const baseName = el.getAttribute('name').replace('placeholder_prefix-', '');
                         el.name = `${prefix}-${newItemIndex}-${baseName}`;
                    }
                });
                container.appendChild(clone);
            }
        } else if (target.classList.contains('btn-remove-repeatable')) {
            target.closest('.repeat-item').remove();
        }

        if (target.classList.contains('btn-add-repeatable') || target.classList.contains('btn-remove-repeatable')) {
            // Pequeño delay para asegurar que el DOM se actualice antes de redibujar
            setTimeout(updateSketchFromForm, 50);
        }
    });

    // Listener para el botón de cargar imagen de fondo.
    const imageUpload = document.getElementById('image-upload');
    if (imageUpload) {
        imageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    d3.selectAll('.bg-image').attr('href', event.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Listener para el botón de restablecer posiciones de los segmentos.
    const resetBtn = document.getElementById('reset-positions-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            drawSegments(); 
        });
    }

    // Listener para el botón de mostrar/ocultar etiquetas de los segmentos.
    const toggleLabelsBtn = document.getElementById('toggle-labels-btn');
    if (toggleLabelsBtn) {
        toggleLabelsBtn.addEventListener('click', (e) => {
            const labels = d3.selectAll('.segment-label');
            const isHidden = labels.style('display') === 'none';
            labels.style('display', isHidden ? 'block' : 'none');
            e.target.textContent = isHidden ? 'Ocultar Etiquetas' : 'Mostrar Etiquetas';
        });
    }
    
    // Listener para el botón de activar/desactivar el modo de edición de posiciones.
    const editPositionsBtn = document.getElementById('edit-positions-btn');
    if (editPositionsBtn) {
        editPositionsBtn.addEventListener('click', (e) => {
            isEditMode = !isEditMode;
            d3.selectAll('.segment-group').classed('edit-mode', isEditMode);
            e.target.classList.toggle('btn-primary', isEditMode);
            e.target.classList.toggle('btn-secondary', !isEditMode);
            e.target.textContent = isEditMode ? 'Finalizar Edición' : 'Editar Posiciones';
            d3.selectAll('.control-handle').style('opacity', isEditMode ? 1 : 0);
            
            // Desactivar rotación 3D si estamos en modo edición
            d3.select(sketchContainer).style('cursor', isEditMode ? 'default' : 'grab');
            if (isEditMode) {
                // Reset 3D rotation
                d3.selectAll('#sketch-container svg').style('transform', 'rotateX(0deg) rotateY(0deg)');
            }
        });
    }

    // Listener para el botón de cerrar la ventana modal.
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeSegmentModal);
    }

    // --- 8. EJECUCIÓN INICIAL ---
    drawSegments();
    buildLegend();
    setup3DRotation();
}