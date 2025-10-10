import { coronaryTreeStructure } from './arbolCoronario.js';
import { posicionesDerecha, posicionesIzquierda, posicionesCodominancia } from './posicionesDominancia.js';

document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.getElementById('dynamic-form-container');
    const sketchContainer = document.getElementById('sketch-container');
    const modal = document.getElementById('segment-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (!formContainer) return;
    
    const defaultImagePath = "img/arbolCoroAnterior.png";

    const svgDefs = `
        <defs>
            <filter id="filtro-tubo" x="-50%" y="-50%" width="200%" height="200%">
                <!-- Sombra suave -->
                <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur"/>
                <feOffset in="blur" dx="2" dy="3" result="offsetBlur"/>
                
                <!-- Iluminación para dar volumen -->
                <feSpecularLighting in="blur" surfaceScale="7" specularConstant="1.2" specularExponent="40" lighting-color="#eeeeee" result="specOut">
                    <fePointLight x="-5000" y="-10000" z="20000"/>
                </feSpecularLighting>
                <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
                <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint"/>
                
                <!-- Combinar sombra y trazado iluminado -->
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

    const icons = {
        anatomy: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>`,
        segment: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V4m0 16v-2M8 8l2-2 2 2m0 8l2 2 2-2M15 9l-2-2-2 2m0 8l-2 2-2-2" /></svg>`,
        bypass: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>`,
    };

    const buildField = (field, prefix) => {
        let fieldHtml = '';
        const id = `${prefix}-${field.id}`;

        switch(field.type) {
            case 'radio':
                const radioOptions = field.options.map(opt => `
                    <label class="flex items-center">
                        <input type="radio" name="${id}" value="${opt}" class="form-radio" data-triggers="${field.triggers && field.triggers[opt] ? field.triggers[opt] : ''}">
                        <span class="ml-2 text-sm">${opt}</span>
                    </label>
                `).join('');
                fieldHtml = `<div class="mb-4">
                    <label class="block text-sm font-medium text-gray-600 mb-2">${field.label}</label>
                    <div class="flex flex-col sm:flex-row sm:flex-wrap gap-x-4 gap-y-2">${radioOptions}</div>
                </div>`;
                break;
            case 'checkbox':
                 const checkOptions = field.options.map(opt => `
                    <label class="flex items-center">
                        <input type="checkbox" name="${id}" value="${opt}" class="form-checkbox" data-triggers="${field.triggers && field.triggers[opt] ? field.triggers[opt] : ''}">
                        <span class="ml-2 text-sm text-gray-700">${opt}</span>
                    </label>
                `).join('');
                fieldHtml = `<div class="mb-4">
                    <label class="block text-sm font-medium text-gray-600 mb-2">${field.label}</label>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">${checkOptions}</div>
                </div>`;
                break;
             case 'master_checkbox':
                fieldHtml = `<div class="mb-2"><label class="flex items-center font-semibold">
                    <input type="checkbox" id="${id}" name="${id}" value="${field.label}" class="form-checkbox" data-triggers="${field.triggers && field.triggers.checked ? field.triggers.checked : ''}">
                    <span class="ml-2">${field.label}</span>
                </label></div>`;
                break;
            case 'select':
                 const selectOptions = field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('');
                 fieldHtml = `<div class="mb-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">${field.label}</label>
                    <select id="${id}" name="${id}" class="w-full p-2 border border-gray-300 rounded-md shadow-sm"><option value="">-- Seleccionar --</option>${selectOptions}</select>
                 </div>`;
                 break;
             case 'number':
             case 'textarea':
                fieldHtml = `<div class="mb-4">
                   <label class="block text-sm font-medium text-gray-600 mb-1">${field.label}</label>
                   <${field.type === 'textarea' ? 'textarea' : 'input type="number"'} id="${id}" name="${id}" class="w-full p-2 border border-gray-300 rounded-md shadow-sm" ${field.rows ? `rows="${field.rows}"` : ''} placeholder="${field.placeholder || ''}"></${field.type === 'textarea' ? 'textarea' : 'input'}>
                </div>`;
                break;
            case 'conditional_group':
                const innerFields = field.fields.map(f => buildField(f, id)).join('');
                fieldHtml = `<div id="${id}" class="hidden mt-4 pl-6 border-l-2 border-gray-200 space-y-4">${innerFields}</div>`;
                break;
             case 'repeatable_block':
                fieldHtml = `
                    <div class="mb-4">
                         <h5 class="font-semibold text-gray-800">${field.title}</h5>
                         <div id="repeat-container-${id}" class="space-y-4 mt-2 pl-2"></div>
                         <button type="button" class="btn-add-repeatable bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm mt-2" data-template-id="${id}-template" data-prefix="${id}">${field.add_button_label}</button>
                    </div>
                    <template id="${id}-template">
                        <div class="repeat-item border-t pt-4 mt-4 relative">
                             <h6 class="text-sm font-bold text-gray-600 mb-2"></h6>
                             ${field.template.map(f => buildField(f, 'placeholder_prefix')).join('')}
                             <button type="button" class="btn-remove-repeatable absolute top-2 right-2 text-red-500 font-bold">×</button>
                        </div>
                    </template>
                `;
                break;
        }
        return fieldHtml;
    };

    const buildForm = () => {
        let formHtml = '';
        coronaryTreeStructure.sections.forEach(section => {
            formHtml += `<div class="form-section-container border border-gray-200 rounded-lg mb-6">
                <h3 class="text-lg font-semibold p-4 bg-gray-50 border-b">${section.title}</h3>
                <div class="p-6 space-y-4">`;
            
            if (section.type === 'segmented_group') {
                section.segments.forEach(segment => {
                    formHtml += `<div id="form-segment-${segment.id}" class="segment-container border-b pb-4 mb-4">
                        <h4 class="font-semibold text-blue-800 mb-2">${segment.name}</h4>`;
                    section.template.forEach(field => {
                        formHtml += buildField(field, `${section.id}-${segment.id}`);
                    });
                    formHtml += `</div>`;
                });
            } else {
                section.fields.forEach(field => {
                    formHtml += buildField(field, section.id);
                });
            }
            formHtml += `</div></div>`;
        });
        formContainer.innerHTML = formHtml;
    };

    const handleTriggers = (element) => {
        const triggerId = element.dataset.triggers;
        if (!triggerId) return;

        const parentContainer = element.closest('.repeat-item, .segment-container, .p-6');
        if (!parentContainer) {
            console.warn('No se encontró un contenedor padre lógico para el trigger:', element);
            return;
        }

        const nameParts = element.name.split('-');
        nameParts.pop();
        const prefix = nameParts.join('-');

        const targetElement = parentContainer.querySelector(`[id$="-${triggerId.replace('show_', '')}"]`);

        if (targetElement) {
            if (element.type === 'radio') {
                const groupName = element.name;
                const radiosInGroup = parentContainer.querySelectorAll(`input[type="radio"][name="${groupName}"]`);

                radiosInGroup.forEach(radio => {
                    const otherTriggerId = radio.dataset.triggers;
                    if (otherTriggerId) {
                        const otherTargetIdSuffix = otherTriggerId.replace('show_', '');
                        const otherTargetElementId = `${prefix}-${otherTargetIdSuffix}`;
                        const otherTargetElement = parentContainer.querySelector(`[id="${otherTargetElementId}"]`);
                        if (otherTargetElement && otherTargetElement !== targetElement) {
                            otherTargetElement.classList.add('hidden');
                        }
                    }
                });

                if (element.checked) {
                    targetElement.classList.remove('hidden');
                }
            } else { 
                targetElement.classList.toggle('hidden', !element.checked);
            }
        } else {
            console.warn('Target element not found for trigger:', triggerId, 'with prefix:', prefix, 'in', parentContainer);
        }
    };
    
    const updateSketchFromForm = () => {
        const currentSVG = sketchContainer.querySelector('svg:not(.hidden)');
        if (!currentSVG) return;
        
        d3.select(currentSVG).selectAll('.plaque-marker, .stent-marker, .bridge-marker, .aneurysm-marker').remove();

        const segments = coronaryTreeStructure.sections.find(s => s.type === 'segmented_group').segments;
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
        const segmentData = coronaryTreeStructure.sections.find(s => s.type === 'segmented_group').segments.find(s => s.id === segmentId);

        if (segmentForm && segmentData) {
            console.log(`[Modal] Moviendo y abriendo para segmento ${segmentId}`);

            // Guardar la posición original
            originalSegmentParent = segmentForm.parentNode;
            originalSegmentNextSibling = segmentForm.nextSibling;

            modalTitle.textContent = `Editando: ${segmentData.name}`;
            modalContent.innerHTML = ''; // Limpiar modal por si acaso
            modalContent.appendChild(segmentForm); // Mover el formulario a la modal

            modal.classList.remove('hidden');
        }
    };

    const closeSegmentModal = () => {
        console.log('[Modal] Cerrando modal.');
        const segmentForm = modalContent.querySelector('.segment-container');
        if (segmentForm && originalSegmentParent) {
            // Devolver el formulario a su lugar original
            originalSegmentParent.insertBefore(segmentForm, originalSegmentNextSibling);
        }
        modal.classList.add('hidden');
        originalSegmentParent = null;
        originalSegmentNextSibling = null;
    };

    const addEventListeners = () => {
        // Attach listeners to the body to ensure they work inside and outside the modal
        document.body.addEventListener('change', (e) => {
            if (!e.target.closest('#dynamic-form-container') && !e.target.closest('#segment-modal')) return;
            const target = e.target;
            if (!target.matches('input, select, textarea')) return;

            // Manejar actualización del croquis desde el formulario de segmento
            if (target.closest('.segment-container')) {
                updateSketchFromForm();
            }

            // Manejar la visibilidad de campos condicionales
            if (target.matches('input[type="radio"], input[type="checkbox"]')) {
                handleTriggers(target);
            }

            // Manejar el cambio de dominancia
            if (target.name === 'analisis_coronario-anatomia_general-dominancia') {
                console.log(`[Dominancia] Cambio detectado a: ${target.value}`);
                document.getElementById('svg-derecha').classList.add('hidden');
                document.getElementById('svg-izquierda').classList.add('hidden');
                document.getElementById('svg-codominancia').classList.add('hidden');
                if (target.value.includes('Derecha')) document.getElementById('svg-derecha').classList.remove('hidden');
                if (target.value.includes('Izquierda')) document.getElementById('svg-izquierda').classList.remove('hidden');
                if (target.value.includes('Codominancia')) document.getElementById('svg-codominancia').classList.remove('hidden');
                console.log('[Dominancia] Llamando a drawSegments() para redibujar.');
                drawSegments();
            }
        });
        
        document.querySelectorAll('[data-collapsible-target]').forEach(header => {
            header.addEventListener('click', () => {
                const targetId = header.dataset.collapsibleTarget;
                const content = document.getElementById(targetId);
                const arrow = header.querySelector('.collapsible-arrow');
                content.classList.toggle('hidden');
                arrow.classList.toggle('rotate-0', !content.classList.contains('hidden'));
                arrow.classList.toggle('-rotate-90', content.classList.contains('hidden'));
            });
        });

        document.body.addEventListener('click', e => {
            if (!e.target.closest('#dynamic-form-container') && !e.target.closest('#segment-modal')) return;
            if (e.target.classList.contains('btn-add-repeatable')) {
                const templateId = e.target.dataset.templateId;
                const template = document.getElementById(templateId);
                const container = document.getElementById(`repeat-container-${templateId.replace('-template', '')}`);
                
                if (template && container) {
                    const clone = template.content.cloneNode(true);
                    const newItemIndex = container.children.length;
                    const prefix = e.target.dataset.prefix;

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
                    
                    clone.querySelectorAll('input, select').forEach(input => {
                        input.addEventListener('change', () => {
                            handleTriggers(input);
                            updateSketchFromForm();
                        });
                    });
                    container.appendChild(clone);
                }
            } else if(e.target.classList.contains('btn-remove-repeatable')) {
                e.target.closest('.repeat-item').remove();
                updateSketchFromForm();
            }
        });
        
        document.getElementById('image-upload').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    d3.selectAll('.bg-image').attr('href', event.target.result);
                };
                reader.readAsDataURL(file);
            }
        });

        document.getElementById('reset-positions-btn').addEventListener('click', () => {
            localStorage.removeItem('segmentPositions');
            location.reload();
        });

         document.getElementById('toggle-labels-btn').addEventListener('click', (e) => {
            const labels = d3.selectAll('.segment-label');
            const isHidden = labels.style('display') === 'none';
            labels.style('display', isHidden ? 'block' : 'none');
            e.target.textContent = isHidden ? 'Ocultar Etiquetas' : 'Mostrar Etiquetas';
        });
        
        document.getElementById('copy-array-btn').addEventListener('click', (e) => {
            const output = document.getElementById('array-output');
            output.select();
            document.execCommand('copy');
            e.target.textContent = '¡Copiado!';
            setTimeout(() => { e.target.textContent = 'Copiar Array'; }, 2000);
        });

        document.getElementById('edit-positions-btn').addEventListener('click', (e) => {
            isEditMode = !isEditMode;
            d3.selectAll('.segment-group').classed('edit-mode', isEditMode);
            e.target.classList.toggle('btn-primary', isEditMode);
            e.target.classList.toggle('btn-secondary', !isEditMode);
            e.target.textContent = isEditMode ? 'Finalizar Edición' : 'Editar Posiciones';
            
            // Show/hide control handles based on edit mode
            d3.selectAll('.control-handle').style('opacity', isEditMode ? 1 : 0);
        });

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeSegmentModal);
        }
    };
    
    function updatePositionsArrayOutput() {
        const output = document.getElementById('array-output');
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
            .filter(() => isEditMode) // Only allow drag if in edit mode
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
            .filter(() => isEditMode) // Only allow handle drag if in edit mode
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
        console.log('[drawSegments] Iniciando redibujo de segmentos.');
        const dominance = document.querySelector('[name="analisis_coronario-anatomia_general-dominancia"]:checked')?.value || 'Dominancia Derecha';
        let currentDominanceKey = 'derecha';
        if (dominance.includes('Izquierda')) currentDominanceKey = 'izquierda';
        if (dominance.includes('Codominancia')) currentDominanceKey = 'codominancia';
        
        // Actualizar el título de la dominancia en el croquis
        const dominanceTitle = document.getElementById('dominance-title');
        if (dominanceTitle) {
            dominanceTitle.textContent = dominance;
        }
        console.log(`[drawSegments] Dominancia actual: ${dominance} (key: ${currentDominanceKey})`);

        // Seleccionar el conjunto de datos de posición correcto basado en la dominancia
        switch (currentDominanceKey) {
            case 'izquierda':
                segmentsData = JSON.parse(JSON.stringify(posicionesIzquierda)); // Deep copy
                break;
            case 'codominancia':
                segmentsData = JSON.parse(JSON.stringify(posicionesCodominancia)); // Deep copy
                break;
            case 'derecha':
            default:
                segmentsData = JSON.parse(JSON.stringify(posicionesDerecha)); // Deep copy
                break;
        }
        
        d3.selectAll('svg').selectAll('.segment-group').remove();

        segmentsData.forEach(seg => {
            // Hide the form segment if its dominance doesn't match
            const formSegment = document.getElementById(`form-segment-${seg.id}`);
            if (formSegment) {
                const shouldShow = seg.dominance.includes(currentDominanceKey);
                formSegment.style.display = shouldShow ? '' : 'none';
            }

            if (seg.dominance.includes(currentDominanceKey)) { // Only draw the segment if it belongs to the current view
                const svg = d3.select(`svg:not(.hidden)`);
                const group = svg.append('g').attr('id', `g-segment-${seg.id}`).attr('class', 'segment-group');

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
        addDragBehavior(d3.selectAll('.segment-group'));
        updateSketchFromForm(); // Actualizar colores al cambiar de dominancia
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

    // --- INITIALIZATION ---
    buildForm();
    drawSegments();
    buildLegend();
    addEventListeners();
});
