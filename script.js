import { reportStructure } from './data.js';
import { sampleCases } from './case.js';
import { initCoronarySketch } from './arbolCoronarioLogic.js';

// --- DEBUG: Expose modules to global scope for audit.js ---
window.reportStructure = reportStructure;
window.sampleCases = sampleCases;
window.initCoronarySketch = initCoronarySketch;


document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.getElementById('form-container');
    const reportOutput = document.getElementById('report-output');
    const copyBtn = document.getElementById('copy-report-btn');
    const saveBtn = document.getElementById('save-study-btn');

    let formData = {};
    let cadRadsManualOverride = false;

    const severityToMaxPercent = {
        'Sin estenosis (0%)': 0,
        'Mínima (1-24%)': 24,
        'Leve (25-49%)': 49,
        'Moderna (50-69%)': 69,
        'Severa (70-99%)': 99,
        'Oclusión total (100%)': 100
    };

    const calculateCadRads = (data) => {
        const arteriasData = data.arterias_coronarias;
        const calidadImagen = data.protocolo_estudio?.calidad_imagen;

        if (!calidadImagen || calidadImagen.includes('No diagnóstica')) {
            return 'CAD-RADS N';
        }

        if (!arteriasData || !arteriasData.items) {
            return 'CAD-RADS 0';
        }

        let maxStenosis = 0;
        let leftMainStenosis = 0;
        const severeVessels = new Set();
        const mainVessels = ['Arteria Descendente Anterior (DA)', 'Arteria Circunfleja (CX)', 'Arteria Coronaria Derecha (CD)'];

        arteriasData.items.forEach(item => {
            if (item.placas && item.placas.length > 0) {
                item.placas.forEach(plaque => {
                    let currentStenosis = 0;
                    if (plaque.estenosis_porcentaje && plaque.estenosis_porcentaje > 0) {
                        currentStenosis = parseInt(plaque.estenosis_porcentaje, 10);
                    } else if (plaque.estenosis_severidad) {
                        currentStenosis = severityToMaxPercent[plaque.estenosis_severidad] || 0;
                    }

                    if (currentStenosis > maxStenosis) {
                        maxStenosis = currentStenosis;
                    }

                    if (item.nombre === 'Tronco Coronario Izquierdo (TCI)' && currentStenosis > leftMainStenosis) {
                        leftMainStenosis = currentStenosis;
                    }

                    if (currentStenosis >= 70 && mainVessels.includes(item.nombre)) {
                        severeVessels.add(item.nombre);
                    }
                });
            }
        });

        if (maxStenosis === 100) return 'CAD-RADS 5';
        if (leftMainStenosis >= 50 || severeVessels.size >= 3) return 'CAD-RADS 4B';
        if (severeVessels.size === 1 || severeVessels.size === 2) return 'CAD-RADS 4A';
        if (maxStenosis >= 70) return 'CAD-RADS 4A'; // Catch-all for severe in non-main vessels
        if (maxStenosis >= 50) return 'CAD-RADS 3';
        if (maxStenosis >= 25) return 'CAD-RADS 2';
        if (maxStenosis >= 1) return 'CAD-RADS 1';

        return 'CAD-RADS 0';
    };


    const updateReport = () => {
        let data = gatherData();
        
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
            } else {
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
                html += `<h3>${section.title}</h3>${sectionHtml}`;
                hasContent = true;
            }
        });

        reportOutput.innerHTML = html;
        if (hasContent) {
            reportOutput.classList.remove('report-placeholder');
        } else {
            reportOutput.classList.add('report-placeholder');
        }
    };

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
            formHtml += `<div class="form-section-container border border-gray-200 rounded-lg mb-6">
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

    buildForm(); // Call the new build function

    // --- Event Listeners for Form Interactivity ---

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
                        const inputs = segmentContainer.querySelectorAll('input, select, textarea');
                        inputs.forEach(input => {
                            const idParts = input.id.split('-');
                            const key = idParts[idParts.length - 1];

                            // Handle repeatable blocks (placas, stents)
                            if (input.closest('.repeat-item')) {
                                const repeatableBlock = input.closest('[id^="repeat-container-"]');
                                const blockId = repeatableBlock.id.split('-').pop();
                                const itemIndex = Array.from(repeatableBlock.children).indexOf(input.closest('.repeat-item'));

                                if (!segmentData[blockId]) {
                                    segmentData[blockId] = [];
                                }
                                if (!segmentData[blockId][itemIndex]) {
                                    segmentData[blockId][itemIndex] = {};
                                }
                                segmentData[blockId][itemIndex][key] = input.value;

                            } else if (input.type === 'radio') {
                                if (input.checked) {
                                    const radioKey = input.name.split('-').pop();
                                    segmentData[radioKey] = input.value;
                                }
                            } else if (input.type === 'checkbox') {
                                const checkboxKey = input.name.split('-').pop();
                                if (!segmentData[checkboxKey]) {
                                    segmentData[checkboxKey] = [];
                                }
                                if (input.checked) {
                                    segmentData[checkboxKey].push(input.value);
                                }
                            } else {
                                // Handle simple fields
                                if (key) {
                                    segmentData[key] = input.value;
                                }
                            }
                        });
                        formData[section.id].segments[segment.id] = segmentData;
                    }
                });
            } else if (section.fields) {
                formData[section.id] = {};
                section.fields.forEach(field => {
                    if (field.type === 'checkbox') {
                        formData[section.id][field.id] = [];
                        field.options.forEach(opt => {
                            const checkbox = document.querySelector(`input[name="${section.id}-${field.id}"][value="${opt}"]`);
                            if (checkbox && checkbox.checked) {
                                formData[section.id][field.id].push(opt);
                            }
                        });
                    } else if (field.type !== 'button') {
                        const el = document.getElementById(`${section.id}-${field.id}`);
                        if (el) {
                            formData[section.id][field.id] = el.value;
                        }
                    } // This curly brace was misplaced, causing a syntax error.
                });
            } else if (section.type === 'repeatableGroup') {
                // FIX: Added handler for repeatableGroup type like 'bypass'
                formData[section.id] = { items: [] };
                const repeatableField = section.fields.find(f => f.type === 'repeatable_block');
                if (repeatableField) {
                    const container = document.getElementById(`repeat-container-${section.id}-${repeatableField.id}`);
                    if (container) {
                        container.querySelectorAll('.repeat-item').forEach((itemNode, itemIndex) => {
                            const itemData = {};
                            repeatableField.template.forEach(field => {
                                const inputId = `${section.id}-${repeatableField.id}-${itemIndex}-${field.id}`;
                                const el = document.getElementById(inputId);
                                if (el) {
                                    if (el.type === 'radio') {
                                        if(el.checked) itemData[field.id] = el.value;
                                    } else {
                                        itemData[field.id] = el.value;
                                    }
                                }
                            });
                            formData[section.id].items.push(itemData);
                        });
                    }
                }
            }
        });
        return formData;
    };

    const loadCase = (caseData) => {
        formContainer.querySelectorAll('input[type="text"], input[type="number"], input[type="date"], textarea').forEach(el => el.value = '');
        formContainer.querySelectorAll('select').forEach(el => el.selectedIndex = 0);
        formContainer.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
        formContainer.querySelectorAll('[id^="plaques-container"]').forEach(el => el.innerHTML = '');
        
        const artSection = reportStructure.find(s => s.id === 'arterias_coronarias');
        if (artSection) {
            artSection.items.forEach(item => item.placas = []);
        }


        reportStructure.forEach(section => {
            const sectionData = caseData[section.id];
            if (!sectionData) return;

            if (section.type === 'repeatableGroup') {
                if (sectionData.items) {
                    sectionData.items.forEach((itemData, itemIndex) => {
                        const originalItem = section.items[itemIndex];
                        if (!originalItem) return;

                        section.template.forEach(field => {
                            const el = document.getElementById(`${section.id}-${itemIndex}-${field.id}`);
                            if (el && itemData[field.id] !== undefined) el.value = itemData[field.id];
                        });

                        if (itemData.placas) {
                            itemData.placas.forEach(plaqueData => {
                                const plaqueDiv = addPlaque(section.id, itemIndex);
                                const plaqueIndex = originalItem.placas.length - 1;
                                section.plaqueTemplate.forEach(field => {
                                    const el = plaqueDiv.querySelector(`#${section.id}-${itemIndex}-placas-${plaqueIndex}-${field.id}`);
                                    if (el && plaqueData[field.id] !== undefined) el.value = plaqueData[field.id];
                                });
                            });
                        }
                    });
                }
            } else {
                section.fields.forEach(field => {
                    const value = sectionData[field.id];
                    if (value === undefined) return;

                    if (field.type === 'checkbox') {
                        value.forEach(opt => {
                            const checkbox = document.getElementById(`${section.id}-${field.id}-${opt.replace(/\s+/g, '-')}`);
                            if (checkbox) checkbox.checked = true;
                        });
                    } else if (field.type !== 'button') {
                        const el = document.getElementById(`${section.id}-${field.id}`);
                        if (el) el.value = value;
                    }
                });
            }
        });

        cadRadsManualOverride = false;
        updateReport();
    }

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

    document.querySelectorAll('.case-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const caseKey = e.target.dataset.case;
            if (sampleCases[caseKey]) {
                loadCase(sampleCases[caseKey]);
            }
        });
    });

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

    // Botón para guardar y redirigir a informe.html
    const saveInformeBtn = document.getElementById('save-informe-btn');
    saveInformeBtn.addEventListener('click', () => {
        const currentData = gatherData();
        localStorage.setItem('savedAngioTACStudy', JSON.stringify(currentData));

        // Usa clases de styles.css para feedback visual
        saveInformeBtn.textContent = '¡Guardado!';
        saveInformeBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
        saveInformeBtn.classList.add('bg-green-600', 'hover:bg-green-700', 'text-white', 'transition-colors');

        setTimeout(() => {
            window.location.href = 'informe.html';
        }, 1000);
    });

    // ELIMINAR ESTE BLOQUE REDUNDANTE QUE CAUSA EL ERROR
    /*
    // Mantener la función de carga existente
    document.getElementById('load-saved-btn').addEventListener('click', () => {
        const savedData = localStorage.getItem('savedAngioTACStudy');
        if (savedData) {
            loadCase(JSON.parse(savedData));
        } else {
            alert('No hay ningún estudio guardado.');
        }
    });
    */

    // FIX: Replaced incorrect/duplicate button logic with the correct one for generating the report.
    const generateReportBtn = document.getElementById('generate-report-btn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', () => {
            const currentData = gatherData();
            localStorage.setItem('savedAngioTACStudy', JSON.stringify(currentData));
            window.open('informe.html', '_blank');
        });
    }


    // FIX: Listen for both 'input' and 'change' events to ensure real-time updates from all field types.
    formContainer.addEventListener('input', updateReport);
    formContainer.addEventListener('change', updateReport);
    
    // Usamos un pequeño timeout para asegurar que el DOM principal esté completamente renderizado y los valores por defecto aplicados.
    console.log('[script.js] DOM cargado. Programando inicialización del croquis...');
    setTimeout(initCoronarySketch, 100);
    
    // --- Lógica para las Pestañas de la Columna Derecha ---
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

    updateReport(); // Initial call to render the form correctly
});
