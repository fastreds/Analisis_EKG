import { posicionesDerecha, posicionesIzquierda, posicionesCodominancia } from './posicionesDominancia.js';

// --- DEBUG: Expose modules to global scope for audit.js ---
window.posicionesDerecha = posicionesDerecha;


export function initCoronarySketch() {
    console.log('[arbolCoronarioLogic.js] Iniciando lógica del croquis...');
    const sketchContainer = document.getElementById('sketch-container');
    if (!sketchContainer) {
        console.error("El contenedor del croquis ('sketch-container') no se encontró. La inicialización del croquis ha fallado.");
        return;
    }

    const modal = document.getElementById('segment-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    
    const defaultImagePath = "img/corazonSinetiquetas.png";

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

    const sketches = {
        derecha: `<svg id="svg-derecha" viewBox="0 0 400 400">${svgDefs}<image href="${defaultImagePath}" class="bg-image" width="400" height="400"/></svg>`,
        izquierda: `<svg id="svg-izquierda" class="hidden" viewBox="0 0 400 400">${svgDefs}<image href="${defaultImagePath}" class="bg-image" width="400" height="400"/></svg>`,
        codominancia: `<svg id="svg-codominancia" class="hidden" viewBox="0 0 400 400">${svgDefs}<image href="${defaultImagePath}" class="bg-image" width="400" height="400"/></svg>`
    };
    sketchContainer.innerHTML = sketches.derecha + sketches.izquierda + sketches.codominancia;
    
    let segmentsData = [];
    let isEditMode = false;
    let originalSegmentParent = null;
    let originalSegmentNextSibling = null;

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
                            .attr('class', 'plaque-marker')
                            .attr('cx', point.x)
                            .attr('cy', point.y)
                            .attr('r', 5)
                            .style('fill', ['#635b4bff', '#10B981', '#F59E0B', '#F97316', '#EF4444'][currentStenosisLevel]);
                    }
                });
            }

            const stentContainer = document.getElementById(`repeat-container-evaluacion_segmento-${segment.id}-findings-stents`);
             if (stentContainer && stentContainer.querySelector('.repeat-item')) {
                group.append('path')
                    .attr('class', 'stent-marker')
                    .attr('d', path.attr('d'));
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

            const color = ['#bb1e12ff', '#10B981', '#F59E0B', '#F97316', '#EF4444'][maxStenosisValue] || '#4b5563';
            path.style('stroke', color);
        });
    };
    
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

    const closeSegmentModal = () => {
        const segmentForm = modalContent.querySelector('.segment-container');
        if (segmentForm && originalSegmentParent) {
            originalSegmentParent.insertBefore(segmentForm, originalSegmentNextSibling);
        }
        modal.classList.add('hidden');
        originalSegmentParent = null;
        originalSegmentNextSibling = null;
    };

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
    
    function buildLegend() {
       const legendData = [
            { color: '#10B981', label: 'Mínima (1-24%)' },
            { color: '#F59E0B', label: 'Leve (25-49%)' },
            { color: '#F97316', label: 'Moderada (50-69%)' },
            { color: '#EF4444', label: 'Severa/Oclusión (≥70%)' },
            { symbol: 'stent', label: 'Stent' },
            { symbol: 'bridge', label: 'Puente Miocárdico' },
            { symbol: 'aneurysm', label: 'Aneurisma' },
        ];
        const container = document.getElementById('legend-container');
        if (!container) return;
        let html = '<h4 class="font-semibold text-center mb-2">Simbología</h4><div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">';
        legendData.forEach(item => {
            html += '<div class="flex items-center">';
            if (item.color) {
                html += `<div class="w-4 h-4 rounded-full mr-2" style="background-color: ${item.color};"></div>`;
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

    // --- Event Listeners specific to the sketch ---
    document.body.addEventListener('change', (e) => {
        if (e.target.closest('.segment-container')) {
            updateSketchFromForm();
        }
        if (e.target.name === 'anatomia_general-dominancia') { // Corregido el selector
            document.getElementById('svg-derecha').classList.add('hidden');
            document.getElementById('svg-izquierda').classList.add('hidden');
            document.getElementById('svg-codominancia').classList.add('hidden');
            if (e.target.value.includes('Derecha')) document.getElementById('svg-derecha').classList.remove('hidden');
            if (e.target.value.includes('Izquierda')) document.getElementById('svg-izquierda').classList.remove('hidden');
            if (e.target.value.includes('Codominancia')) document.getElementById('svg-codominancia').classList.remove('hidden');
            drawSegments();
        }
    });

    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-add-repeatable') || e.target.classList.contains('btn-remove-repeatable')) {
            // Pequeño delay para asegurar que el DOM se actualice antes de redibujar
            setTimeout(updateSketchFromForm, 50);
        }
    });

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

    const resetBtn = document.getElementById('reset-positions-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            drawSegments(); 
        });
    }

    const toggleLabelsBtn = document.getElementById('toggle-labels-btn');
    if (toggleLabelsBtn) {
        toggleLabelsBtn.addEventListener('click', (e) => {
            const labels = d3.selectAll('.segment-label');
            const isHidden = labels.style('display') === 'none';
            labels.style('display', isHidden ? 'block' : 'none');
            e.target.textContent = isHidden ? 'Ocultar Etiquetas' : 'Mostrar Etiquetas';
        });
    }
    
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

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeSegmentModal);
    }

    // --- INITIALIZATION ---
    drawSegments();
    buildLegend();
    setup3DRotation();
}