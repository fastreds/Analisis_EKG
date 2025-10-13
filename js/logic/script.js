import { reportStructure } from '../data.js';
import { sampleCases } from '../data/case.js';
import { initCoronarySketch } from './arbolCoronarioLogic.js';
import { posicionesDerecha, posicionesIzquierda, posicionesCodominancia } from '../data/posicionesDominancia.js';

// --- DEBUG: Expose modules to global scope for audit.js ---
window.reportStructure = reportStructure;
window.sampleCases = sampleCases;
window.initCoronarySketch = initCoronarySketch;
window.posicionesDerecha = posicionesDerecha; // For audit.js check

document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.getElementById('form-container');
    const reportOutput = document.getElementById('report-output');
    const copyBtn = document.getElementById('copy-report-btn');
    const saveBtn = document.getElementById('save-study-btn');

    let formData = {};
    let cadRadsManualOverride = false;

    const severityToMaxPercent = {
        'CAD-RADS 1: Mínima (1-24%)': 24,
        'CAD-RADS 2: Leve (25-49%)': 49,
        'CAD-RADS 3: Moderada (50-69%)': 69,
        'CAD-RADS 4A: Severa (70-99%)': 99,
        'CAD-RADS 5: Oclusión total (100%)': 100
    };

    const calculateCadRads = (data) => {
        const segmentData = data.evaluacion_segmento?.segments;
        const calidadImagen = data.protocolo_estudio?.calidad_imagen;

        if (!calidadImagen || calidadImagen.includes('No diagnóstica')) {
            return 'CAD-RADS N';
        }

        if (!segmentData) {
            return 'CAD-RADS 0';
        }

        let maxStenosis = 0;
        let leftMainStenosis = 0;
        const severeVessels = new Set();
        // Mapeo de IDs de segmentos principales a nombres para la lógica de 3 vasos
        const mainVesselIds = { '6': 'DA', '7': 'DA', '8': 'DA', '11': 'CX', '13': 'CX', '1': 'CD', '2': 'CD', '3': 'CD' }; // IDs de segmentos proximales y medios

        Object.entries(segmentData).forEach(([segmentId, segment]) => {
            if (segment.findings?.placas) {
                segment.findings.placas.forEach(plaque => {
                    let currentStenosis = 0;
                    if (plaque.estenosis_porcentaje && plaque.estenosis_porcentaje > 0) {
                        currentStenosis = parseInt(plaque.estenosis_porcentaje, 10);
                    } else if (plaque.estenosis) {
                        currentStenosis = severityToMaxPercent[plaque.estenosis] || 0;
                    }

                    if (currentStenosis > maxStenosis) {
                        maxStenosis = currentStenosis;
                    }

                    if (segmentId === '5' && currentStenosis > leftMainStenosis) { // TCI es segmento 5
                        leftMainStenosis = currentStenosis;
                    }

                    if (currentStenosis >= 70 && mainVesselIds[segmentId]) {
                        severeVessels.add(mainVesselIds[segmentId]);
                    }
                });
            }
        });

        if (maxStenosis === 100) return 'CAD-RADS 5';
        if (leftMainStenosis >= 50 || severeVessels.size >= 3) return 'CAD-RADS 4B';
        if (severeVessels.size === 1 || severeVessels.size === 2) return 'CAD-RADS 4A';
        if (maxStenosis >= 70) return 'CAD-RADS 4A'; // Catch-all for severe in non-main vessels
        if (maxStenosis >= 50) return 'CAD-RADS 3'; // Corregido de 'Moderna' a 'Moderada'
        if (maxStenosis >= 25) return 'CAD-RADS 2';
        if (maxStenosis >= 1) return 'CAD-RADS 1';

        return 'CAD-RADS 0';
    };

    const updateReport = () => {
        let data = gatherData();
        updateCalciumScore();
        
        if (!cadRadsManualOverride) {
            const calculatedScore = calculateCadRads(data);
            const cadRadsSelect = document.getElementById('cad_rads-score');
            if (cadRadsSelect) {
                cadRadsSelect.value = calculatedScore;
                if (data.cad_rads) {
                    data.cad_rads.score = calculatedScore;
                }
            }
        }

        let html = '';
        let hasContent = false;

        reportStructure.forEach(section => {
            const sectionData = data[section.id];
            let sectionHtml = '';
            let sectionHasContent = false;

            if (section.type === 'repeatableGroup') {
                if (sectionData && sectionData.items) {
                    sectionData.items.forEach(item => {
                        let itemHtml = `<h4>${item.nombre}</h4><ul>`;
                        let itemHasContentInThisItem = false;
                        Object.entries(item).forEach(([key, value]) => {
                            if (key !== 'nombre' && key !== 'placas' && value) {
                                const fieldLabel = section.template.find(f => f.id === key)?.label;
                                if(fieldLabel){
                                    itemHtml += `<li><strong>${fieldLabel}:</strong> ${value}</li>`;
                                    itemHasContentInThisItem = true;
                                }
                            }
                        });

                        if (item.placas && item.placas.length > 0) {
                            itemHtml += `<h5>Placas Ateromatosas:</h5>`;
                            item.placas.forEach((plaque, index) => {
                                let plaqueHasContent = false;
                                let plaqueHtml = `<div class="plaque-report"><strong>Placa #${index + 1}:</strong><ul>`;
                                Object.entries(plaque).forEach(([key, value]) => {
                                    if (value) {
                                        const fieldLabel = section.plaqueTemplate.find(f => f.id === key)?.label;
                                        plaqueHtml += `<li><strong>${fieldLabel}:</strong> ${value}</li>`;
                                        plaqueHasContent = true;
                                    }
                                });
                                plaqueHtml += `</ul></div>`;
                                if (plaqueHasContent) {
                                    itemHtml += plaqueHtml;
                                    itemHasContentInThisItem = true;
                                }
                            });
                        }
                        itemHtml += `</ul>`;
                        if (itemHasContentInThisItem) {
                            sectionHtml += itemHtml;
                            sectionHasContent = true;
                        }
                    });
                }
            } else if (section.type === 'segmented_group') {
                // This section is now handled below, after the main loop
            } else {
                // This handles sections with a 'fields' array
                if (sectionData) {
                    Object.entries(sectionData).forEach(([key, value]) => {
                        if ((value && value.length !== 0) || (key === 'total' && value !== '')) {
                            const field = section.fields.find(f => f.id === key);
                            if (field) {
                                if (Array.isArray(value)) {
                                    sectionHtml += `<p><strong>${field.label}:</strong> ${value.join(', ')}</p>`;
                                } else {
                                    sectionHtml += `<p><strong>${field.label}:</strong> ${value}${field.detail ? ` ${field.detail}` : ''}</p>`;
                                }
                                sectionHasContent = true;
                            }
                        }
                    });
                }
            }

            if (sectionHasContent) {
                html += `<h3 class="report-title-clickable" data-scroll-to="form-section-${section.id}">${section.title}</h3>${sectionHtml}`;
                hasContent = true;
            }
        });

        // Add segment evaluation text
        const segmentData = data.evaluacion_segmento?.segments;
        if (segmentData) {
            const segmentSection = reportStructure.find(s => s.id === 'evaluacion_segmento');
            if (segmentSection) {
                let segmentText = `<h3 class="text-lg font-semibold mb-2">${segmentSection.title}</h3>`;
                let findingsFound = false;
                segmentSection.segments.forEach(segmentInfo => {
                    const segmentId = segmentInfo.id;
                    const segment = segmentData[segmentId];
                    if (segment && segment.estado_general === 'Con hallazgos patológicos' && segment.findings) {
                        let findingsList = [];
                        if (segment.findings.placas && segment.findings.placas.length > 0) {
                            segment.findings.placas.forEach(p => {
                                let estenosisText = p.estenosis_porcentaje ? `${p.estenosis_porcentaje}%` : p.estenosis;
                                let placaText = `Placa ${p.composicion || ''} que produce estenosis de ${estenosisText}`;
                                if (p.has_hrp && p.has_hrp.length > 0) {
                                    placaText += ` con características de alto riesgo (${p.has_hrp.join(', ')})`;
                                }
                                findingsList.push(placaText);
                            });
                        }
                        // Future logic for stents, bridges, etc. can be added here
                        
                        if (findingsList.length > 0) {
                            segmentText += `<p><strong>${segmentInfo.name}:</strong> ${findingsList.join('. ')}.</p>`;
                            findingsFound = true;
                        }
                    }
                });

                if (!findingsFound) {
                    segmentText += "<p>No se encontraron hallazgos patológicos significativos en los segmentos evaluados.</p>";
                }
                html += segmentText;
                hasContent = true;
            }
        }


        reportOutput.innerHTML = html;
        if (hasContent) {
            reportOutput.classList.remove('report-placeholder');
        } else {
            reportOutput.classList.add('report-placeholder');
        }
    };

    reportOutput.addEventListener('click', (e) => {
        if (e.target.matches('.report-title-clickable')) {
            const targetId = e.target.dataset.scrollTo;
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const content = targetElement.querySelector('[id^="section-content-"]'); // The collapsible content
                if (content && content.classList.contains('hidden')) {
                    const header = targetElement.querySelector('h3');
                    header.click(); // Simulate click to expand
                }
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });

    const generateConclusion = () => {
        const data = formData;
        let conclusion = "Estudio de angiotomografía coronaria muestra los siguientes hallazgos:\n\n";

        const scoreData = data.score_calcio;
        if (scoreData && scoreData.total) {
            const score = scoreData.total;
            conclusion += `- Score de calcio coronario total de ${score} (Agatston), lo que indica `;
            if (score == 0) conclusion += "ausencia de placa coronaria calcificada. ";
            else if (score >= 1 && score <= 10) conclusion += "placa mínima. ";
            else if (score >= 11 && score <= 100) conclusion += "placa leve. ";
            else if (score >= 101 && score <= 400) conclusion += "placa moderada. ";
            else conclusion += "placa severa. ";
            conclusion += `Percentil ${scoreData.percentil} para edad y género.\n`;
        }
        
        // CAD-RADS in conclusion
        const cadRadsData = data.cad_rads;
        if (cadRadsData && cadRadsData.score) {
            conclusion += `- Clasificación según CAD-RADS™ 2.0: ${cadRadsData.score}.`;
            if (cadRadsData.modifiers && cadRadsData.modifiers.length > 0) {
                conclusion += ` Modificadores: ${cadRadsData.modifiers.join(', ')}.`;
            }
            conclusion += '\n';
        }


        const arteriasData = data.arterias_coronarias;
        if (arteriasData && arteriasData.items) {
            const estenosisSevera = [];
            arteriasData.items.forEach(item => {
                if (item.placas) {
                    item.placas.forEach(plaque => {
                        if (plaque.estenosis_severidad && (plaque.estenosis_severidad.includes('Moderna') || plaque.estenosis_severidad.includes('Severa') || placa.estenosis_severidad.includes('Oclusión'))) {
                            estenosisSevera.push(`Estenosis ${plaque.estenosis_severidad} en ${item.nombre}, segmento ${plaque.localizacion}.`);
                        }
                    });
                }
            });

            if (estenosisSevera.length > 0) {
                conclusion += "- Se observa enfermedad coronaria obstructiva con las siguientes lesiones:\n"
                estenosisSevera.forEach(lesion => {
                    conclusion += `  - ${lesion}\n`;
                });
            } else {
                conclusion += "- No se observa enfermedad arterial coronaria obstructiva significativa.\n"
            }
        }

        const anatomiaData = data.anatomia_cardiovascular;
        if (anatomiaData && anatomiaData.ventriculo_izquierdo_fevi) {
            conclusion += `- Fracción de eyección del ventrículo izquierdo (FEVI) estimada como ${anatomiaData.ventriculo_izquierdo_fevi}.\n`;
        }

        const aortaData = data.valvula_aortica_diametros_aorta;
        if (aortaData && aortaData.porcion_tubular_ascendente_observaciones && aortaData.porcion_tubular_ascendente_observaciones !== 'NORMAL' && aortaData.porcion_tubular_ascendente_observaciones !== 'SIN DILATACIÓN') {
            conclusion += `- Aorta ascendente con ${aortaData.porcion_tubular_ascendente_observaciones.toLowerCase()} (${aortaData.porcion_tubular_ascendente_diametro} mm).\n`;
        }

        const extraData = data.evaluacion_extracardiaca;
        if (extraData && extraData.hallazgos && extraData.hallazgos.length > 0 && extraData.hallazgos[0] !== 'Sin hallazgos patológicos significativos') {
            conclusion += `- Hallazgos extracardíacos relevantes: ${extraData.hallazgos.join(', ')}.\n`;
        }

        document.getElementById('conclusion-texto_conclusion').value = conclusion;
        updateReport();
    };

    const buildField = (field, prefix) => {
        let fieldHtml = '';
        const id = `${prefix}-${field.id}`;

        switch(field.type) {
            case 'radio':
                const radioOptions = field.options.map(opt => {
                    const inputName = `${prefix}-${field.id}`; // Usar el mismo nombre para todo el grupo
                    const isChecked = opt === field.default ? 'checked' : '';
                    return `<label class="flex items-center">
                        <input type="radio" name="${inputName}" value="${opt}" class="form-radio" data-triggers="${field.triggers && field.triggers[opt] ? field.triggers[opt] : ''}" ${isChecked}>
                        <span class="ml-2 text-sm">${opt}</span>
                    </label>`;
                }).join('');
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
                    <label for="${id}" class="block text-sm font-medium text-gray-600 mb-1">${field.label}</label>
                    <select id="${id}" name="${id}" class="w-full p-2 border border-gray-300 rounded-md shadow-sm"><option value="">-- Seleccionar --</option>${selectOptions}</select>
                 </div>`;
                 break;
             case 'number':
             case 'date':
             case 'text':
             case 'textarea':
                fieldHtml = `<div class="mb-4">
                   <label for="${id}" class="block text-sm font-medium text-gray-600 mb-1">${field.label}</label>
                   <${field.type === 'textarea' ? 'textarea' : `input type="${field.type}"`} id="${id}" name="${id}" class="w-full p-2 border border-gray-300 rounded-md shadow-sm" ${field.rows ? `rows="${field.rows}"` : ''} placeholder="${field.placeholder || ''}"></${field.type === 'textarea' ? 'textarea' : 'input'}>
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
            case 'button':
                 fieldHtml = `<button type="button" id="${id}" class="w-full mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">${field.label}</button>`;
                 break;
        }
        return fieldHtml;
    };

    const buildForm = () => {
        let formHtml = '';
        reportStructure.forEach((section, index) => {
            const isCollapsible = true; 
            const isCollapsed = index !== 0; // Colapsar todas excepto la primera
            formHtml += `<div id="form-section-${section.id}" class="form-section-container border border-gray-200 rounded-lg mb-6">
                <h3 class="text-lg font-semibold p-4 bg-gray-50 border-b flex justify-between items-center ${isCollapsible ? 'cursor-pointer' : ''}" ${isCollapsible ? `data-collapsible-target="section-content-${section.id}"` : ''}>
                    <span class="flex items-center">${index + 1}. ${section.title}</span>
                    <span class="collapsible-arrow transform ${isCollapsed ? '-rotate-90' : 'rotate-0'} transition-transform duration-300">&#9660;</span>
                </h3>
                <div id="section-content-${section.id}" class="p-6 space-y-4 ${isCollapsed ? 'hidden' : ''}">`;
            
            if (section.type === 'segmented_group') {
                section.segments.forEach(segment => {
                    formHtml += `<div id="form-segment-${segment.id}" class="segment-container border-b pb-4 mb-4">
                        <h4 class="font-semibold text-blue-800 mb-2">${segment.name}</h4>
                        <div class="pl-2">`;
                    section.template.forEach(field => {
                        formHtml += buildField(field, `${section.id}-${segment.id}`);
                    });
                    formHtml += `</div></div>`;
                });
            } else if (section.fields) { // Solo procesar si la sección tiene un array de 'fields'
                section.fields.forEach(field => {
                    formHtml += buildField(field, section.id);
                });
            } else {
                // Ignorar secciones que no tienen 'fields' ni son 'segmented_group'
            }
            formHtml += `</div></div>`;
        });
        formContainer.innerHTML = formHtml;
    };
    
    // --- BUILD AND INITIALIZE ---
    buildForm();
    initCoronarySketch();

    // Trigger initial draw after a short delay to ensure DOM is ready
    setTimeout(() => {
        const dominanceRadio = document.querySelector('input[name="anatomia_general-dominancia"]:checked');
        if (dominanceRadio) {
            dominanceRadio.dispatchEvent(new Event('change', { bubbles: true }));
        }
        updateReport(); // To draw initial report state
    }, 100);

    // Collapsible sections
    formContainer.querySelectorAll('[data-collapsible-target]').forEach(header => {
        header.addEventListener('click', () => {
            const targetId = header.dataset.collapsibleTarget;
            const content = document.getElementById(targetId);
            const arrow = header.querySelector('.collapsible-arrow');
            content.classList.toggle('hidden');
            arrow.classList.toggle('rotate-0', !content.classList.contains('hidden'));
            arrow.classList.toggle('-rotate-90', content.classList.contains('hidden'));
        });
    });

    // --- DATA GATHERING & LOADING ---

    const getRepeatableBlockData = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return [];
        const items = [];
        container.querySelectorAll('.repeat-item').forEach(itemNode => {
            const itemData = {};
            const processedNames = new Set();

            itemNode.querySelectorAll('input, select, textarea').forEach(input => {
                const name = input.name || input.id;
                if (!name || processedNames.has(name)) return;

                const nameParts = name.split('-');
                const key = nameParts[nameParts.length - 1];
                
                if (input.type === 'radio') {
                    const checkedRadio = itemNode.querySelector(`input[name="${name}"]:checked`);
                    if (checkedRadio) {
                        itemData[key] = checkedRadio.value;
                    }
                    processedNames.add(name);
                } else if (input.type === 'checkbox') {
                    const values = [];
                    itemNode.querySelectorAll(`input[name="${name}"]:checked`).forEach(cb => {
                        values.push(cb.value);
                    });
                    itemData[key] = values;
                    processedNames.add(name);
                } else { // select, text, textarea, etc.
                    itemData[key] = input.value;
                    processedNames.add(name);
                }
            });
            items.push(itemData);
        });
        return items;
    };

    const getConditionalGroupData = (groupNode) => {
        if (!groupNode || groupNode.classList.contains('hidden')) return null;
        const data = {};
        groupNode.querySelectorAll('input, select, textarea').forEach(input => {
            const key = input.id.split('-').pop();
            if (input.type === 'radio') {
                if (input.checked) data[key] = input.value;
            } else if (input.type === 'checkbox') {
                if (!data[key]) data[key] = [];
                if (input.checked) data[key].push(input.value);
            } else {
                data[key] = input.value;
            }
        });
        return data;
    };

    const getSegmentFindingsData = (findingsContainer, fields) => {
        if (!findingsContainer || findingsContainer.classList.contains('hidden')) return null;
        const findingsData = {};
        fields.forEach(field => {
            const elId = findingsContainer.id + '-' + field.id;
            if (field.type === 'repeatable_block') {
                findingsData[field.id] = getRepeatableBlockData(`repeat-container-${elId}`);
            } else if (field.type === 'master_checkbox') {
                const masterCheckbox = document.getElementById(elId);
                if (masterCheckbox && masterCheckbox.checked) {
                    findingsData[field.id] = true;
                    const detailsContainer = document.getElementById(elId.replace(field.id, field.id + '_details'));
                    if (detailsContainer) {
                        findingsData[field.id + '_details'] = getConditionalGroupData(detailsContainer);
                    }
                }
            }
        });
        return findingsData;
    };

    const gatherData = () => {
        formData = {};
        reportStructure.forEach(section => {
            if (!section.id) return; // Skip sections without an ID
    
            if (section.type === 'segmented_group') {
                formData[section.id] = { segments: {} };
                section.segments.forEach(segment => {
                    const segmentContainer = document.getElementById(`form-segment-${segment.id}`);
                    if (segmentContainer) {
                        const segmentData = {};
                        section.template.forEach(field => {
                            const prefix = `${section.id}-${segment.id}`;
                            const el = document.getElementById(`${prefix}-${field.id}`);
                            if (field.type === 'radio') {
                                const checkedRadio = segmentContainer.querySelector(`input[name="${prefix}-${field.id}"]:checked`);
                                if (checkedRadio) segmentData[field.id] = checkedRadio.value;
                            } else if (field.type === 'conditional_group' && field.id === 'findings') {
                                segmentData[field.id] = getSegmentFindingsData(el, field.fields);
                            } else if (field.type === 'conditional_group') {
                                segmentData[field.id] = getConditionalGroupData(el);
                            }
                        });
                        formData[section.id].segments[segment.id] = segmentData;
                    }
                });
            } else {
                formData[section.id] = {};
                section.fields.forEach(field => {
                    const prefix = section.id;
                    const elId = `${prefix}-${field.id}`;
                    if (field.type === 'checkbox') {
                        const values = [];
                        document.querySelectorAll(`input[name="${elId}"]`).forEach(checkbox => {
                            if (checkbox.checked) values.push(checkbox.value);
                        });
                        formData[section.id][field.id] = values;
                    } else if (field.type === 'radio') {
                        const checkedRadio = document.querySelector(`input[name="${elId}"]:checked`);
                        if (checkedRadio) formData[section.id][field.id] = checkedRadio.value;
                    } else if (field.type === 'repeatable_block') {
                        formData[section.id][field.id] = getRepeatableBlockData(`repeat-container-${elId}`);
                    } else if (field.type === 'conditional_group') {
                        formData[section.id][field.id] = getConditionalGroupData(document.getElementById(elId));
                    } else if (field.type !== 'button') {
                        const el = document.getElementById(elId);
                        if (el) formData[section.id][field.id] = el.value;
                    }
                });
            }
        });
        return formData;
    };

    const loadCase = (caseData) => {
        // 1. Reset the form completely
        formContainer.querySelectorAll('input[type="text"], input[type="number"], input[type="date"], textarea').forEach(el => el.value = '');
        formContainer.querySelectorAll('select').forEach(el => {
            el.selectedIndex = 0;
            // Manually trigger change for selects to reset dependent UI
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });
        formContainer.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(el => {
            el.checked = false;
            // Dispatch change to hide conditional fields
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });
        formContainer.querySelectorAll('[id^="repeat-container-"]').forEach(el => el.innerHTML = '');

        // 2. Populate form with case data and dispatch events
        reportStructure.forEach(section => {
            const sectionData = caseData[section.id];
            if (!sectionData) return;

            // Handle regular fields in sections
            if (section.fields) {
                Object.entries(sectionData).forEach(([fieldId, value]) => {
                    if (value === undefined) return;
                    
                    const fieldDef = section.fields.find(f => f.id === fieldId);
                    const elId = `${section.id}-${fieldId}`;
                    const el = document.getElementById(elId);

                    if (!fieldDef && !el) return; // Skip if field doesn't exist in structure or DOM

                    if (fieldDef?.type === 'checkbox' && Array.isArray(value)) {
                        // First, uncheck all options in the group
                        document.querySelectorAll(`input[name^="${elId}"]`).forEach(cb => cb.checked = false);
                        // Then, check the ones from the case data
                        value.forEach(opt => {
                            const checkbox = document.querySelector(`input[name="${elId}"][value="${opt}"]`);
                            if (checkbox) {
                                checkbox.checked = true;
                                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                        });
                    } else if (fieldDef?.type === 'radio') {
                        const radio = document.querySelector(`input[name="${elId}"][value="${value.replace(/"/g, '\\"')}"]`);
                        if (radio) {
                            radio.checked = true;
                            // This is critical for updating the sketch dominance and other conditional UI
                            radio.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    } else if (fieldDef?.type === 'repeatable_block' && Array.isArray(value)) {
                        const addBtn = document.querySelector(`button[data-template-id="${elId}-template"]`);
                        if (addBtn) {
                            value.forEach(itemData => {
                                addBtn.click(); // This will create the new item structure
                                const container = document.getElementById(`repeat-container-${elId}`);
                                const newItem = container.querySelector('.repeat-item:last-child');
                                if (newItem) {
                                    Object.entries(itemData).forEach(([key, val]) => {
                                        const input = newItem.querySelector(`[id$="-${key}"]`);
                                        if (input) {
                                            if (input.type === 'checkbox' || input.type === 'radio') {
                                                // Handle checkboxes/radios within repeatable blocks
                                                if ((Array.isArray(val) && val.includes(input.value)) || val === input.value) {
                                                    input.checked = true;
                                                } else {
                                                    input.checked = false;
                                                }
                                                input.dispatchEvent(new Event('change', { bubbles: true }));
                                            } else {
                                                input.value = val;
                                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    } else if (el) { // For text, number, select, textarea etc.
                        el.value = value;
                        el.dispatchEvent(new Event('input', { bubbles: true }));
                        el.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                });
            }

            // Handle segmented group separately
            if (section.type === 'segmented_group' && sectionData.segments) {
                Object.entries(sectionData.segments).forEach(([segmentId, segmentValues]) => {
                    const prefix = `${section.id}-${segmentId}`;
                    
                    // Set estado_general
                    const estadoRadio = document.querySelector(`input[name="${prefix}-estado_general"][value="${segmentValues.estado_general}"]`);
                    if (estadoRadio) {
                        estadoRadio.checked = true;
                        estadoRadio.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    // Handle findings within the segment
                    if (segmentValues.findings) {
                        Object.entries(segmentValues.findings).forEach(([findingKey, findingValue]) => {
                            const findingDef = section.template.find(t => t.id === 'findings')?.fields.find(f => f.id === findingKey);
                            if (!findingDef) return;

                            if (findingDef.type === 'repeatable_block' && Array.isArray(findingValue)) {
                                const addBtn = document.querySelector(`button[data-template-id="${prefix}-findings-${findingKey}-template"]`);
                                if (addBtn) {
                                    findingValue.forEach(itemData => {
                                        addBtn.click();
                                        const container = document.getElementById(`repeat-container-${prefix}-findings-${findingKey}`);
                                        const newItem = container.querySelector('.repeat-item:last-child');
                                        if (newItem) {
                                            Object.entries(itemData).forEach(([key, val]) => {
                                                const input = newItem.querySelector(`[id$="-${key}"]`);
                                                if (input) {
                                                    if (input.type === 'checkbox' && Array.isArray(val)) {
                                                        val.forEach(v => {
                                                            const cb = newItem.querySelector(`input[value="${v}"]`);
                                                            if(cb) cb.checked = true;
                                                        });
                                                    } else {
                                                        input.value = val;
                                                    }
                                                    input.dispatchEvent(new Event('change', { bubbles: true }));
                                                }
                                            });
                                        }
                                    });
                                }
                            } else if (findingDef.type === 'master_checkbox') {
                                const masterCheckbox = document.getElementById(`${prefix}-findings-${findingKey}`);
                                if (masterCheckbox) {
                                    masterCheckbox.checked = !!findingValue;
                                    masterCheckbox.dispatchEvent(new Event('change', { bubbles: true }));

                                    if (findingValue && typeof findingValue === 'object' && segmentValues.findings[findingKey+'_details']) {
                                        const details = segmentValues.findings[findingKey+'_details'];
                                        Object.entries(details).forEach(([detailKey, detailValue]) => {
                                            const detailInput = document.querySelector(`[id$="${findingKey}_details-${detailKey}"]`);
                                            if(detailInput) {
                                                detailInput.value = detailValue;
                                                detailInput.dispatchEvent(new Event('change', { bubbles: true }));
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }
                });
            }
        });

        // 3. Final update
        // A small timeout can help ensure all DOM updates and event dispatches from the loading process are settled
        setTimeout(() => {
            cadRadsManualOverride = false;
            updateReport(); // This will also trigger sketch updates via its internal calls
            
            // Explicitly trigger a final change on the dominance radio to be sure the sketch is correct
            const dominanceRadio = document.querySelector('input[name="anatomia_general-dominancia"]:checked');
            if (dominanceRadio) {
                dominanceRadio.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }, 100);
    };

    // --- EVENT LISTENERS ---

    copyBtn.addEventListener('click', () => {
        const textToCopy = reportOutput.innerText;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Copiado!`;
                setTimeout(() => {
                    copyBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    Copiar`;
                }, 2000);
            });
        } else { 
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                copyBtn.textContent = 'Copiado!';
                setTimeout(() => copyBtn.textContent = 'Copiar', 2000);
            } catch (err) {
                console.error('Fallback copy failed', err);
            }
            document.body.removeChild(textArea);
        }
    });

    const buildCaseButtons = () => {
        const buttonsContainer = document.getElementById('case-buttons-container');
        const tooltip = document.getElementById('case-tooltip');
        if (!buttonsContainer || !tooltip) return;

        Object.keys(sampleCases).forEach((caseKey, index) => {
            const caseData = sampleCases[caseKey];
            const button = document.createElement('button');
            button.dataset.case = caseKey;
            button.className = 'case-btn bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors';
            button.textContent = index + 1;

            button.addEventListener('mouseenter', () => {
                const patient = caseData.datos_paciente || {};
                const clinInfo = caseData.informacion_clinica || {};
                const cadRads = caseData.cad_rads || {};

                let tooltipHtml = `<p class="font-bold">${patient.nombre || 'Caso ' + (index + 1)}</p>`;
                if (patient.edad || patient.genero) {
                    tooltipHtml += `<p class="text-xs">${patient.edad || ''} años, ${patient.genero || ''}</p>`;
                }
                if (clinInfo.indicacion) {
                    tooltipHtml += `<p class="mt-2 text-xs"><strong>Indicación:</strong> ${clinInfo.indicacion}</p>`;
                }
                if (cadRads.score) {
                    tooltipHtml += `<p class="mt-1 text-xs"><strong>CAD-RADS:</strong> ${cadRads.score}</p>`;
                }

                tooltip.innerHTML = tooltipHtml;
                tooltip.classList.remove('hidden');

                const btnRect = button.getBoundingClientRect();
                const containerRect = buttonsContainer.parentElement.getBoundingClientRect();
                tooltip.style.left = `${btnRect.left - containerRect.left}px`;
                tooltip.style.top = `${btnRect.bottom - containerRect.top + 8}px`; // 8px for margin
            });

            button.addEventListener('mouseleave', () => {
                tooltip.classList.add('hidden');
            });
            
            button.addEventListener('click', (e) => {
                const caseKey = e.target.dataset.case;
                if (sampleCases[caseKey]) {
                    loadCase(sampleCases[caseKey]);
                }
            });

            buttonsContainer.appendChild(button);
        });
    };

    buildCaseButtons();

    saveBtn.addEventListener('click', () => {
        const currentData = gatherData();
        localStorage.setItem('savedAngioTACStudy', JSON.stringify(currentData));
        saveBtn.textContent = '¡Guardado!';
        setTimeout(() => {
            saveBtn.textContent = 'Guardar Estudio';
        }, 2000);
    });

    const loadSavedBtn = document.getElementById('load-saved-btn');
    if (loadSavedBtn) {
        loadSavedBtn.addEventListener('click', () => {
            const savedData = localStorage.getItem('savedAngioTACStudy');
            if (savedData) {
                loadCase(JSON.parse(savedData));
            } else {
                alert('No hay ningún estudio guardado.');
            }
        });
    }

    const saveInformeBtn = document.getElementById('save-informe-btn');
    if(saveInformeBtn) {
        saveInformeBtn.addEventListener('click', () => {
            const currentData = gatherData();
            localStorage.setItem('savedAngioTACStudy', JSON.stringify(currentData));
    
            saveInformeBtn.textContent = '¡Guardado!';
            saveInformeBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
            saveInformeBtn.classList.add('bg-green-600', 'hover:bg-green-700', 'text-white', 'transition-colors');
    
            setTimeout(() => {
                window.location.href = 'informe.html';
            }, 1000);
        });
    }

    const generateReportBtn = document.getElementById('generate-report-btn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', () => {
            const currentData = gatherData();
            localStorage.setItem('savedAngioTACStudy', JSON.stringify(currentData));
            window.open('informe.html', '_blank');
        });
    }


    const updateCalciumScore = () => {
        const tci = parseFloat(document.getElementById('score_calcio-tci')?.value) || 0;
        const da = parseFloat(document.getElementById('score_calcio-da')?.value) || 0;
        const cx = parseFloat(document.getElementById('score_calcio-cx')?.value) || 0;
        const cd = parseFloat(document.getElementById('score_calcio-cd')?.value) || 0;

        const total = tci + da + cx + cd;

        const totalEl = document.getElementById('score_calcio-total');
        if (totalEl) {
            totalEl.value = total;
        }

        const data = gatherData();
        const age = data.datos_paciente?.edad;
        const gender = data.datos_paciente?.genero;
        const percentile = calculatePercentile(total, age, gender);

        const percentileEl = document.getElementById('score_calcio-percentil');
        if (percentileEl) {
            percentileEl.value = percentile;
        }
    };

    const calculatePercentile = (score, age, gender) => {
        // Placeholder logic for percentile calculation
        if (score > 400) return '>90';
        if (score > 100) return '75-90';
        if (score > 10) return '50-75';
        if (score > 0) return '25-50';
        return '<25';
    };

    formContainer.addEventListener('input', (e) => {
        if (e.target.id.startsWith('score_calcio-')) {
            updateCalciumScore();
        }
        updateReport();
    });

    formContainer.addEventListener('change', updateReport);
    
    const croquisTabBtn = document.getElementById('tab-btn-croquis');
    const reporteTabBtn = document.getElementById('tab-btn-reporte');
    const croquisPanel = document.getElementById('tab-panel-croquis');
    const reportePanel = document.getElementById('tab-panel-reporte');

    if (croquisTabBtn && reporteTabBtn && croquisPanel && reportePanel) {
        croquisTabBtn.addEventListener('click', () => {
            croquisTabBtn.classList.add('active');
            reporteTabBtn.classList.remove('active');
            croquisPanel.classList.remove('hidden');
            reportePanel.classList.add('hidden');
        });
        reporteTabBtn.addEventListener('click', () => {
            reporteTabBtn.classList.add('active');
            croquisTabBtn.classList.remove('active');
            reportePanel.classList.remove('hidden');
            croquisPanel.classList.add('hidden');
        });
    }

    updateReport(); // Initial call
});
