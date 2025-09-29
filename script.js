import { reportStructure } from './data.js';
import { sampleCases } from './case.js';


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

    const updateCalciumScore = () => {
        const tci = parseFloat(document.getElementById('score_calcio-tci')?.value) || 0;
        const da = parseFloat(document.getElementById('score_calcio-da')?.value) || 0;
        const cx = parseFloat(document.getElementById('score_calcio-cx')?.value) || 0;
        const cd = parseFloat(document.getElementById('score_calcio-cd')?.value) || 0;
        const total = tci + da + cx + cd;
        const totalInput = document.getElementById('score_calcio-total');
        if (totalInput) {
            totalInput.value = total;
        }
        updateReport();
    };

    const createField = (field, sectionId, itemIndex = null, plaqueIndex = null) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'mb-4';

        const label = document.createElement('label');
        label.textContent = field.label;
        label.className = 'block text-sm font-medium text-gray-600 mb-1';
        wrapper.appendChild(label);

        let dataId = itemIndex !== null ?
            (plaqueIndex !== null ?
                `${sectionId}-${itemIndex}-placas-${plaqueIndex}-${field.id}` :
                `${sectionId}-${itemIndex}-${field.id}`) :
            `${sectionId}-${field.id}`;


        switch (field.type) {
            case 'text':
            case 'number':
            case 'date':
                const input = document.createElement('input');
                input.type = field.type;
                input.id = dataId;
                input.placeholder = field.placeholder || '';
                input.readOnly = field.readonly || false;
                input.className = `w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${field.readonly ? 'bg-gray-100' : ''} ${field.class || ''}`;
                if (field.class === 'score-input') {
                    input.addEventListener('input', updateCalciumScore);
                }
                wrapper.appendChild(input);
                break;

            case 'textarea':
                const textarea = document.createElement('textarea');
                textarea.id = dataId;
                textarea.placeholder = field.placeholder || '';
                textarea.rows = field.rows || 3;
                textarea.className = 'w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500';
                wrapper.appendChild(textarea);
                break;

            case 'select':
                const select = document.createElement('select');
                select.id = dataId;
                select.className = 'w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500';
                const defaultOption = document.createElement('option');
                defaultOption.textContent = `--- Seleccionar ${field.label} ---`;
                defaultOption.value = "";
                select.appendChild(defaultOption);
                field.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    select.appendChild(option);
                });
                if(dataId === 'cad_rads-score') {
                    select.addEventListener('change', () => {
                        cadRadsManualOverride = true;
                    });
                }
                wrapper.appendChild(select);
                break;

            case 'checkbox':
                const checkboxContainer = document.createElement('div');
                checkboxContainer.className = 'grid grid-cols-2 gap-2';
                field.options.forEach(opt => {
                    const checkWrapper = document.createElement('div');
                    checkWrapper.className = 'flex items-center';
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `${dataId}-${opt.replace(/\s+/g, '-')}`;
                    checkbox.value = opt;
                    checkbox.className = 'h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500';
                    const checkLabel = document.createElement('label');
                    checkLabel.htmlFor = checkbox.id;
                    checkLabel.textContent = opt;
                    checkLabel.className = 'ml-2 block text-sm text-gray-700';
                    checkWrapper.appendChild(checkbox);
                    checkWrapper.appendChild(checkLabel);
                    checkboxContainer.appendChild(checkWrapper);
                });
                wrapper.appendChild(checkboxContainer);
                break;

            case 'button':
                const button = document.createElement('button');
                button.id = dataId;
                button.textContent = field.label;
                button.type = 'button';
                button.className = 'w-full mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300';
                if (field.id === 'autogenerate_conclusion') {
                    button.addEventListener('click', generateConclusion);
                }
                wrapper.appendChild(button);
                break;
        }
        return wrapper;
    };

    const createRepeatableGroup = (section) => {
        const sectionContainer = document.createElement('div');

        section.items.forEach((item, itemIndex) => {
            const itemContainer = document.createElement('div');
            itemContainer.className = 'mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50';
            itemContainer.id = `item-${section.id}-${itemIndex}`;

            const itemHeader = document.createElement('h4');
            itemHeader.className = 'text-md font-semibold text-gray-700 mb-3';
            itemHeader.textContent = item.nombre;
            itemContainer.appendChild(itemHeader);

            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';

            section.template.forEach(field => {
                if (field.condition && !field.condition(item)) {
                    return;
                }
                const fieldEl = createField(field, section.id, itemIndex);

                // FIX: For the readonly 'nombre' field, set its value immediately upon creation.
                // This ensures the name is always displayed correctly.
                if (field.id === 'nombre') {
                    const input = fieldEl.querySelector('input');
                    if (input) {
                        input.value = item.nombre;
                    }
                }

                grid.appendChild(fieldEl);
            });
            itemContainer.appendChild(grid);

            const plaquesContainer = document.createElement('div');
            plaquesContainer.id = `plaques-container-${section.id}-${itemIndex}`;
            plaquesContainer.className = 'mt-4';
            itemContainer.appendChild(plaquesContainer);

            const addPlaqueBtn = document.createElement('button');
            addPlaqueBtn.textContent = 'Añadir Placa';
            addPlaqueBtn.className = 'mt-2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600';
            addPlaqueBtn.onclick = () => addPlaque(section.id, itemIndex);
            itemContainer.appendChild(addPlaqueBtn);

            sectionContainer.appendChild(itemContainer);
        });
        return sectionContainer;
    }

    const addPlaque = (sectionId, itemIndex) => {
        const section = reportStructure.find(s => s.id === sectionId);
        const item = section.items[itemIndex];
        if (!item.placas) item.placas = [];
        const plaqueIndex = item.placas.length;
        item.placas.push({});

        const plaquesContainer = document.getElementById(`plaques-container-${sectionId}-${itemIndex}`);
        const plaqueDiv = document.createElement('div');
        plaqueDiv.className = 'p-3 mt-3 border border-blue-200 rounded-md relative bg-white';
        plaqueDiv.id = `plaque-${sectionId}-${itemIndex}-${plaqueIndex}`;

        const plaqueHeader = document.createElement('h5');
        plaqueHeader.textContent = `Detalle Placa #${plaqueIndex + 1}`;
        plaqueHeader.className = 'font-semibold text-blue-800 mb-2';
        plaqueDiv.appendChild(plaqueHeader);

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.className = 'absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl';
        removeBtn.onclick = () => {
            item.placas.splice(plaqueIndex, 1);
            plaqueDiv.remove();
            updateReport();
        };
        plaqueDiv.appendChild(removeBtn);

        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 md:grid-cols-3 gap-4';
        section.plaqueTemplate.forEach(field => {
            const fieldEl = createField(field, sectionId, itemIndex, plaqueIndex);
            grid.appendChild(fieldEl);
        });
        plaqueDiv.appendChild(grid);
        plaquesContainer.appendChild(plaqueDiv);

        plaqueDiv.querySelectorAll('input, select, textarea').forEach(el => el.addEventListener('input', updateReport));
        return plaqueDiv;
    };

    reportStructure.forEach((section, index) => {
        const sectionWrapper = document.createElement('div');
        sectionWrapper.className = 'mb-4 border border-gray-200 rounded-lg';

        const header = document.createElement('h3');
        header.className = 'text-xl font-semibold p-4 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-t-lg flex justify-between items-center';
        header.textContent = section.title;

        const arrow = document.createElement('span');
        arrow.innerHTML = '&#9660;';
        header.appendChild(arrow);

        sectionWrapper.appendChild(header);

        const sectionContent = document.createElement('div');
        sectionContent.className = 'p-4 form-section';
        if (index > 0) {
            sectionContent.classList.add('collapsed');
            arrow.style.transform = 'rotate(-90deg)';
        }

        header.addEventListener('click', () => {
            sectionContent.classList.toggle('collapsed');
            arrow.style.transform = sectionContent.classList.contains('collapsed') ? 'rotate(-90deg)' : 'rotate(0deg)';
        });


        if (section.type === 'repeatableGroup') {
            sectionContent.appendChild(createRepeatableGroup(section));
        } else {
            section.fields.forEach(field => {
                sectionContent.appendChild(createField(field, section.id));
            });
        }
        sectionWrapper.appendChild(sectionContent);
        formContainer.appendChild(sectionWrapper);
    });

    const gatherData = () => {
        formData = {};
        reportStructure.forEach(section => {
            formData[section.id] = {};
            if (section.type === 'repeatableGroup') {
                formData[section.id].items = [];
                section.items.forEach((item, itemIndex) => {
                    const itemData = {
                        nombre: item.nombre
                    };
                    section.template.forEach(field => {
                        if (field.condition && !field.condition(item)) return;
                        const el = document.getElementById(`${section.id}-${itemIndex}-${field.id}`);
                        if (el) itemData[field.id] = el.value;
                    });

                    itemData.placas = [];
                    if (item.placas) {
                        item.placas.forEach((plaque, plaqueIndex) => {
                            const plaqueData = {};
                            section.plaqueTemplate.forEach(field => {
                                const el = document.getElementById(`${section.id}-${itemIndex}-placas-${plaqueIndex}-${field.id}`);
                                if (el) plaqueData[field.id] = el.value;
                            });
                            itemData.placas.push(plaqueData);
                        });
                    }
                    formData[section.id].items.push(itemData);
                });
            } else {
                section.fields.forEach(field => {
                    if (field.type === 'checkbox') {
                        formData[section.id][field.id] = [];
                        field.options.forEach(opt => {
                            const checkbox = document.getElementById(`${section.id}-${field.id}-${opt.replace(/\s+/g, '-')}`);
                            if (checkbox && checkbox.checked) {
                                formData[section.id][field.id].push(opt);
                            }
                        });
                    } else if (field.type !== 'button') {
                        const el = document.getElementById(`${section.id}-${field.id}`);
                        if (el) {
                            formData[section.id][field.id] = el.value;
                        }
                    }
                });
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

    document.getElementById('load-saved-btn').addEventListener('click', () => {
        const savedData = localStorage.getItem('savedAngioTACStudy');
        if (savedData) {
            loadCase(JSON.parse(savedData));
        } else {
            alert('No hay ningún estudio guardado.');
        }
    });

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

    // Mantener la función de carga existente
    document.getElementById('load-saved-btn').addEventListener('click', () => {
        const savedData = localStorage.getItem('savedAngioTACStudy');
        if (savedData) {
            loadCase(JSON.parse(savedData));
        } else {
            alert('No hay ningún estudio guardado.');
        }
    });

    // FIX: Replaced incorrect/duplicate button logic with the correct one for generating the report.
    document.getElementById('generate-report-btn').addEventListener('click', () => {
        const currentData = gatherData();
        // The key must match what informe.html is expecting.
        localStorage.setItem('savedAngioTACStudy', JSON.stringify(currentData));
        window.open('informe.html', '_blank');
    });


    formContainer.addEventListener('input', updateReport);
    updateReport(); // Initial call to render the form correctly
});

