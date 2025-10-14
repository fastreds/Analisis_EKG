import { reportStructure } from '../data.js';
import { posicionesDerecha, posicionesIzquierda, posicionesCodominancia } from '../data/posicionesDominancia.js';

document.addEventListener('DOMContentLoaded', () => {
    const data = JSON.parse(localStorage.getItem('savedAngioTACStudy'));
            if (!data) {
                document.body.innerHTML = '<h1>No se encontraron datos para generar el informe.</h1>';
                return;
            }

            // Helper to get computed CSS variables
            const getColor = (variable) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

            // --- Populate Patient Info ---
            const patient = data.datos_paciente || {};
    const clinical = data.informacion_clinica || {};
            const study = data.protocolo_estudio || {};


            document.title = `Informe AngioTAC Cardíaco — ${patient.nombre || 'Paciente'}`;
            document.getElementById('patient-name').textContent = patient.nombre || 'N/A';
    document.getElementById('patient-id').textContent = `ID: ${patient.id_paciente || 'N/A'}`;
            document.getElementById('patient-details').textContent = `${patient.edad || 'N/A'} años • ${patient.genero || 'N/A'} • ${patient.peso || 'N/A'} kg`;
            document.getElementById('report-date').textContent = `Fecha del estudio: ${study.fecha_estudio ? new Date(study.fecha_estudio).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}`;
            document.getElementById('patient-indication').textContent = clinical.indicacion || 'N/A';
            document.getElementById('patient-doctor').textContent = study.medico_referente || 'N/A';
            document.getElementById('doctor-specialty').textContent = study.medico_especialidad || 'N/A';

            const riskFactorsDiv = document.getElementById('risk-factors');
            if (clinical.factores_riesgo && clinical.factores_riesgo.length > 0) {
        riskFactorsDiv.innerHTML = ''; // Clear previous
                clinical.factores_riesgo.forEach(factor => {
                    const div = document.createElement('div');
            div.className = 'risk-factor';
            div.innerHTML = `<span>${factor.split(' ')[0]}</span>`;
            riskFactorsDiv.appendChild(div);
                });
            } else {
                riskFactorsDiv.innerHTML = '<div>Ninguno reportado</div>';
            }

            // --- Helper to create detail items ---
            const createDetailItem = (container, label, value) => {
        if (value && value !== 'N/A' && value !== '') {
                    const item = document.createElement('div');
                    item.className = 'detail-item';
            item.innerHTML = `<span>${label}</span><strong>${Array.isArray(value) ? value.join(', ') : value}</strong>`;
                    container.appendChild(item);
                }
            };

            // --- Populate Technical Details ---
            const techContainer = document.getElementById('technical-details');
            techContainer.innerHTML = ''; // Clear previous
        createDetailItem(techContainer, 'Equipo', study.equipo);
            createDetailItem(techContainer, 'Tiempo de rotación', study.tiempo_rotacion);
            createDetailItem(techContainer, 'ECG-gating', study.adquisicion);
            createDetailItem(techContainer, 'Medio Contraste', `${study.medio_contraste || ''} (${study.contraste_iv || ''})`);
            createDetailItem(techContainer, 'Velocidad Infusión', study.velocidad_infusion);
            createDetailItem(techContainer, 'Ritmo', study.ritmo_estudio);
            createDetailItem(techContainer, 'Calidad Imagen', study.calidad_imagen);

            // --- Populate Cardiac Anatomy ---
            const anatomyContainer = document.getElementById('cardiac-anatomy');
    const anatomy = data.anatomia_cardiovascular || {};
            anatomyContainer.innerHTML = ''; // Clear previous
            createDetailItem(anatomyContainer, 'Venas Cavas', anatomy.venas_cavas);
            createDetailItem(anatomyContainer, 'Aurícula Derecha', anatomy.auricula_derecha);
            createDetailItem(anatomyContainer, 'Septum Interauricular', anatomy.septum_interauricular);
            createDetailItem(anatomyContainer, 'Ventrículo Derecho', anatomy.ventriculo_derecho);
            createDetailItem(anatomyContainer, 'Arteria Pulmonar', anatomy.arteria_pulmonar);
            createDetailItem(anatomyContainer, 'Venas Pulmonares', anatomy.venas_pulmonares);
            createDetailItem(anatomyContainer, 'Aurícula Izquierda', anatomy.auricula_izquierda);
            createDetailItem(anatomyContainer, 'Tamaño VI', anatomy.ventriculo_izquierdo_size);
            createDetailItem(anatomyContainer, 'Hipertrofia VI', anatomy.ventriculo_izquierdo_hipertrofia);
            createDetailItem(anatomyContainer, 'Motilidad VI', anatomy.ventriculo_izquierdo_motilidad);


            // --- AORTA BAR ---
            const aorta = data.valvula_aortica_diametros_aorta || {};
            if (aorta && aorta.porcion_tubular_ascendente_diametro) {
                const val = parseInt(aorta.porcion_tubular_ascendente_diametro, 10);
        const pct = Math.min(100, Math.max(0, ((val - 30) / (50 - 30)) * 100)); // Scale from 30mm to 50mm
                document.getElementById('aortaBar').style.width = pct + '%';
                document.getElementById('aorta-diameter').textContent = `${val} mm`;
                const interpretation = aorta.porcion_tubular_ascendente_observaciones;
                const interpretationEl = document.getElementById('aorta-interpretation');
                interpretationEl.textContent = interpretation;
        if (interpretation && (interpretation.toUpperCase().includes('DILATADO') || interpretation.toUpperCase().includes('ANEURISMÁTICO'))) {
                    interpretationEl.style.color = getColor('--rojo');
                }
            }


            // --- FEVI CHART ---
            const feviText = anatomy.ventriculo_izquierdo_fevi || '';
    let feviValue = 55; // Default to normal
    let feviColor = getColor('--verde');
    if (feviText.includes('Levemente')) { feviValue = 50; feviColor = getColor('--amarillo'); }
    else if (feviText.includes('Moderadamente')) { feviValue = 40; feviColor = getColor('--naranja'); }
    else if (feviText.includes('Severamente')) { feviValue = 25; feviColor = getColor('--rojo'); }


    document.getElementById('fevi-text').textContent = feviText || 'Normal (>55%)';
            new Chart(document.getElementById('feviChart').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['FEVI', 'Resto'],
                    datasets: [{
                        data: [feviValue, 100 - feviValue],
                        backgroundColor: [feviColor, '#eee'],
                        borderWidth: 0
                    }]
                },
        options: {
                    circumference: 180, rotation: 270, cutout: '70%',
                    plugins: { legend: { display: false }, tooltip: { enabled: true } },
                }
            });


            // --- CALCIUM SCORE CHARTS ---
            const calcium = data.score_calcio;
            if (calcium) {
                const totalScoreEl = document.getElementById('calcium-score-total');
                totalScoreEl.textContent = calcium.total || 0;
        if (calcium.total > 400) totalScoreEl.style.color = getColor('--rojo');
        else if (calcium.total > 100) totalScoreEl.style.color = getColor('--naranja');
        else if (calcium.total > 10) totalScoreEl.style.color = getColor('--amarillo');
        else totalScoreEl.style.color = getColor('--verde');

        document.getElementById('calcium-percentile').textContent = `Percentil ${calcium.percentil || 'N/A'}`;

                new Chart(document.getElementById('calcioBar').getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: ['TCI', 'DA', 'CX', 'CD'],
                        datasets: [{
                            label: 'Score Agatston',
                            data: [calcium.tci || 0, calcium.da || 0, calcium.cx || 0, calcium.cd || 0],
                            backgroundColor: (context) => {
                const v = context.dataset.data[context.dataIndex];
                if (v > 400) return getColor('--rojo');
                if (v > 100) return getColor('--naranja');
                if (v > 10) return getColor('--amarillo');
                return getColor('--verde');
                            },
                borderRadius: 6
                        }]
                    },
                    options: {
                        scales: { y: { beginAtZero: true } },
                        plugins: { legend: { display: false } }
                    }
                });

                new Chart(document.getElementById('calcioPie').getContext('2d'), {
                    type: 'pie',
                    data: {
                        labels: ['DA', 'CD', 'CX', 'TCI'],
                datasets: [{
                            data: [calcium.da || 0, calcium.cd || 0, calcium.cx || 0, calcium.tci || 0],
                    backgroundColor: [getColor('--rojo'), getColor('--naranja'), getColor('--amarillo'), getColor('--verde')]
                        }]
                    },
            options: { 
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } } 
            }
                });
            }


            // --- STENOSIS & ARTERIES DATA ---
            const segmentEvaluation = data.evaluacion_segmento || {};
            const allSegmentsInfo = reportStructure.find(s => s.id === 'evaluacion_segmento')?.segments || [];

            const stenosisDataForChart = [];
            const tableBody = document.querySelector("#arteries-table tbody");
            tableBody.innerHTML = ''; // Clear previous
            
            const severityToValue = {
        'Mínima (1-24%)': 24,
        'Leve (25-49%)': 49,
        'Moderada (50-69%)': 69,
        'Severa (70-99%)': 99,
        'Oclusión total (100%)': 100
            };

            const getColorForStenosis = (v) => {
                if (v >= 70) return getColor('--rojo');
                if (v >= 50) return getColor('--naranja');
                if (v >= 25) return getColor('--amarillo');
                return getColor('--verde');
            };
            
            // Procesa todos los segmentos para la tabla y los gráficos
            const processedSegments = {};
            if (segmentEvaluation.segments) {
                Object.entries(segmentEvaluation.segments).forEach(([segmentId, segmentData]) => {
                    const segmentInfo = allSegmentsInfo.find(s => s.id == segmentId);
                    if (!segmentInfo) return;

                    let maxStenosis = 0;
                    let hasFindings = false;
                    const findingsForTable = [];

                    if (segmentData.estado_general === 'Con hallazgos patológicos' && segmentData.findings) {
                        // Placas
                        if (segmentData.findings.placas?.length > 0) {
                            hasFindings = true;
                            segmentData.findings.placas.forEach(plaque => {
                                const stenosisValue = severityToValue[plaque.estenosis] || 0;
                                if (stenosisValue > maxStenosis) maxStenosis = stenosisValue;
                                findingsForTable.push({
                                    hallazgo: `Placa ${plaque.composicion || ''}`,
                                    localizacion: 'N/A',
                                    estenosis: plaque.estenosis || 'N/A',
                                    color: getColorForStenosis(stenosisValue)
                                });
                            });
                        }

                        // Stents
                        if (segmentData.findings.stents?.length > 0) {
                            hasFindings = true;
                            segmentData.findings.stents.forEach(stent => {
                                findingsForTable.push({ hallazgo: 'Stent', localizacion: 'Segmento', estenosis: stent.evaluacion || 'N/A' });
                            });
                        }

                        // Puente Miocárdico
                        if (segmentData.findings.has_puente) {
                            hasFindings = true;
                            findingsForTable.push({ hallazgo: 'Puente Miocárdico', localizacion: 'Segmento', estenosis: `Profundidad: ${segmentData.findings.puente_details?.profundidad || 'N/A'}` });
                        }

                        // Aneurisma
                        if (segmentData.findings.has_aneurisma) {
                            hasFindings = true;
                            findingsForTable.push({ hallazgo: 'Aneurisma/Ectasia', localizacion: 'Segmento', estenosis: `Diámetro: ${segmentData.findings.aneurisma_details?.diametro || 'N/A'} mm` });
                        }
                    }

                    if (hasFindings) {
                        findingsForTable.forEach(finding => {
                            const row = tableBody.insertRow();
                            row.insertCell().textContent = segmentInfo.name;
                            row.insertCell().textContent = finding.hallazgo;
                            row.insertCell().textContent = finding.localizacion;
                            const stenosisCell = row.insertCell();
                            stenosisCell.textContent = finding.estenosis;
                            if (finding.color) stenosisCell.style.color = finding.color;
                        });
                    } else if (segmentData.estado_general !== 'Sin hallazgos patológicos significativos') {
                        const row = tableBody.insertRow();
                        row.insertCell().textContent = segmentInfo.name;
                        row.insertCell().textContent = segmentData.estado_general || '---';
                        row.insertCell().textContent = '---';
                        row.insertCell().textContent = '---';
                    }

                    processedSegments[segmentId] = { ...segmentData, maxStenosis };
                    if (maxStenosis > 0) {
                        stenosisDataForChart.push({ arteria: segmentInfo.name.match(/\((.*?)\)/)?.[1] || segmentInfo.name, value: maxStenosis });
                    }
                });
            }

            // --- Stenosis line chart ---
            if (stenosisDataForChart.length > 0) {
                new Chart(document.getElementById('stenosisLine').getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: stenosisDataForChart.map(d => d.arteria),
                        datasets: [{
                            label: '% Estenosis',
                            data: stenosisDataForChart.map(d => d.value),
                    fill: true, tension: 0.3, pointRadius: 4, pointHoverRadius: 6, borderColor: '#444', borderWidth: 2
                        }]
                    },
                    options: {
                        scales: { y: { min: 0, max: 100 } },
                        plugins: { legend: { display: false } }
                    }
                });
            }

            // --- Coronary SVG schematic ---
            function drawCoronaryMap() {
                d3.select('#coronarySVG').select('svg').remove(); // Clear previous SVG
                
                const dominance = data.anatomia_general?.dominancia || 'Dominancia Derecha';
                document.getElementById('coronary-map-dominance').textContent = `(${dominance})`;
                let positions;
                if (dominance.includes('Izquierda')) positions = posicionesIzquierda;
                else if (dominance.includes('Codominancia')) positions = posicionesCodominancia;
                else positions = posicionesDerecha;

                const svg = d3.select('#coronarySVG').append('svg').attr('viewBox', `0 0 400 400`).html(`
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
                `);
                
                const pathGenerator = d3.line().curve(d3.curveBasis);

                positions.forEach(seg => {
                    const segmentData = processedSegments[seg.id] || {};
                    const stenValue = segmentData.maxStenosis || 0;
                    const group = svg.append('g').attr('class', 'segment-group');

                    if (seg.transform) {
                        group.attr('transform', seg.transform);
                    }

                    const path = group.append('path')
                        .attr('d', pathGenerator(seg.points))
                        .attr('class', `segment-path stenosis-${Math.ceil(stenValue / 25)}`);

                    // Añadir marcadores de hallazgos
                    if (segmentData.findings) {
                        const pathNode = path.node();
                        if (!pathNode) return;
                        const totalLength = pathNode.getTotalLength();

                        // Marcadores de Placa
                        if (segmentData.findings.placas?.length > 0) {
                            segmentData.findings.placas.forEach((plaque, index) => {
                                const stenosisValue = severityToValue[plaque.estenosis] || 0;
                                const point = pathNode.getPointAtLength(totalLength * (0.3 + index * 0.2));
                                group.append('circle')
                                    .attr('class', `plaque-marker stenosis-${Math.ceil(stenosisValue / 25)}`)
                                    .attr('cx', point.x).attr('cy', point.y).attr('r', 5);
                            });
                        }
                        // Marcador de Stent (círculos)
                        if (segmentData.findings.stents?.length > 0) {
                            const numCircles = Math.floor(totalLength / 10);
                            for (let i = 0; i <= numCircles; i++) {
                                const point = pathNode.getPointAtLength(i * (totalLength / numCircles));
                                group.append('circle')
                                    .attr('class', 'stent-circle-marker')
                                    .attr('cx', point.x).attr('cy', point.y).attr('r', 4);
                            }
                        }
                        // Marcador de Puente
                        if (segmentData.findings.has_puente) {
                            group.insert('path', ':first-child').attr('class', 'bridge-marker').attr('d', path.attr('d'));
                        }
                        // Marcador de Aneurisma
                        if (segmentData.findings.has_aneurisma) {
                            const point = pathNode.getPointAtLength(totalLength * 0.5);
                            group.append('circle').attr('class', 'aneurysm-marker').attr('cx', point.x).attr('cy', point.y).attr('r', 8);
                        }
                    }
                });
            }
            drawCoronaryMap();

            // --- Build Legend for Coronary Map ---
            function buildCoronaryLegend() {
                const legendContainer = document.getElementById('legend-container');
                if (!legendContainer) return;
                legendContainer.innerHTML = `
                    <div class="item"><div class="sw" style="background:var(--verde)"></div> Normal/Mínima</div>
                    <div class="item"><div class="sw" style="background:var(--amarillo)"></div> Leve (25-49%)</div>
                    <div class="item"><div class="sw" style="background:var(--naranja)"></div> Moderada (50-69%)</div>
                    <div class="item"><div class="sw" style="background:var(--rojo)"></div> Severa (≥70%)</div>
                    <div class="item"><svg class="sw-symbol" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" class="stent-circle-marker" stroke-width="2"/></svg> Stent</div>
                    <div class="item"><svg class="sw-symbol" viewBox="0 0 20 20"><path d="M0 10 H 20" class="bridge-marker" stroke-width="8"/></svg> Puente</div>
                    <div class="item"><svg class="sw-symbol" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" class="aneurysm-marker"/></svg> Aneurisma</div>
                    <div class="item"><svg class="sw-symbol" viewBox="0 0 20 20"><circle cx="10" cy="10" r="5" class="plaque-marker stenosis-4"/></svg> Placa</div>
                `;
            }
            buildCoronaryLegend();

            // --- CAD-RADS & Conclusion ---
            const cadRads = data.cad_rads;
            if (cadRads) {
                document.getElementById('cad-rads-score').textContent = cadRads.score || 'N/A';
                document.getElementById('cad-rads-modifiers').textContent = cadRads.modifiers?.join(', ') || 'Ninguno';
                document.getElementById('cad-rads-description').textContent = cadRads.description || '';
            }

    document.getElementById('conclusion-text').textContent = data.conclusion?.texto_conclusion || 'No se generó conclusión.';
            document.getElementById('extracardiac-findings').textContent = data.evaluacion_extracardiaca?.hallazgos?.join(', ') || 'Sin hallazgos significativos.';

            // --- Generate and inject written report for printing ---
    function generateWrittenReport(data) {
                const {
                    datos_paciente: patient = {},
                    informacion_clinica: clinical = {},
                    protocolo_estudio: study = {},
                    anatomia_cardiovascular: anatomy = {},
                    valvula_aortica_diametros_aorta: aorta = {},
                    score_calcio: calcium = {}, 
                    evaluacion_segmento: segmentData = { segments: {} },
                    cad_rads: cadRads = {}, 
                    evaluacion_extracardiaca: extracardiac = {}, 
                    conclusion = {}
                } = data;

                let report = `<h3>Informe Detallado</h3>`;

        report += `
                    <h4>1. Datos del Paciente y Estudio</h4>
                    <p>
                        Informe correspondiente al paciente <strong>${patient.nombre || 'N/A'}</strong> (ID: ${patient.id_paciente || 'N/A'}), de ${patient.edad || 'N/A'} años, género ${patient.genero || 'N/A'}.
                        El estudio se realizó el ${study.fecha_estudio ? new Date(study.fecha_estudio).toLocaleDateString('es-ES') : 'N/A'} por indicación de <strong>"${clinical.indicacion || 'N/A'}"</strong>, referido por ${study.medico_referente || 'N/A'}.
                        El paciente presenta los siguientes factores de riesgo cardiovascular: ${clinical.factores_riesgo?.join(', ') || 'ninguno reportado'}.
                    </p>
                `;

        report += `
                    <h4>2. Score de Calcio Coronario (Agatston)</h4>
                    <p>
                        El score de calcio total es de <strong>${calcium.total || 0}</strong>, lo que sitúa al paciente en el percentil <strong>${calcium.percentil || 'N/A'}</strong> para su edad y género.
                        La distribución del calcio es la siguiente: TCI: ${calcium.tci || 0}, DA: ${calcium.da || 0}, CX: ${calcium.cx || 0}, CD: ${calcium.cd || 0}.
                    </p>
                `;

        report += `<h4>3. Arterias Coronarias</h4>`;
                let findingsText = '';
                Object.entries(segmentData.segments).forEach(([segmentId, segment]) => {
            const segmentInfo = allSegmentsInfo.find(s => s.id == segmentId);
                    if (!segmentInfo || segment.estado_general === 'Sin hallazgos patológicos significativos') return;

                    let segmentDesc = `<li><strong>${segmentInfo.name}:</strong> `;
                    let hasFinding = false;
                    if (segment.findings?.placas?.length > 0) {
                        hasFinding = true;
                        segmentDesc += segment.findings.placas.map(p => `Placa ${p.composicion || ''} que causa estenosis ${p.estenosis || 'no definida'}`).join(', ');
                    }
                    if (segment.findings?.stents?.length > 0) {
                        hasFinding = true;
                        segmentDesc += (hasFinding ? '; ' : '') + segment.findings.stents.map(s => `Stent preexistente con estado: ${s.evaluacion || 'N/A'}`).join(', ');
                    }
                    if (segment.findings?.has_puente) {
                        hasFinding = true;
                        segmentDesc += (hasFinding ? '; ' : '') + `Puente miocárdico con compresión sistólica ${segment.findings.puente_details?.compresion || 'N/A'}`;
                    }
                    if (hasFinding) {
                        findingsText += segmentDesc + '.</li>';
                    }
                });

        report += `<ul>${findingsText || '<li>Sin evidencia de enfermedad coronaria obstructiva.</li>'}</ul>`;


        report += `
                    <h4>4. Anatomía y Función Cardíaca</h4>
                    <p>
                        La fracción de eyección del ventrículo izquierdo (FEVI) se encuentra <strong>${anatomy.ventriculo_izquierdo_fevi || 'conservada'}</strong>.
                        La aorta ascendente a nivel tubular presenta un diámetro de <strong>${aorta.porcion_tubular_ascendente_diametro || 'N/A'} mm</strong>, hallazgo interpretado como <strong>${aorta.porcion_tubular_ascendente_observaciones || 'normal'}</strong>.
                    </p>
                `;

        report += `
                    <h4>5. Clasificación CAD-RADS™ 2.0</h4>
                    <p>
                    El estudio se clasifica como <strong>${cadRads.score || 'N/A'}</strong>.
                    ${cadRads.modifiers && cadRads.modifiers.length > 0 ? 'Se aplican los siguientes modificadores: <strong>' + cadRads.modifiers.join(', ') + '</strong>. ' : ''}
                    ${cadRads.description ? 'Descripción: ' + cadRads.description : ''}
                    </p>
                `;

        report += `
                    <h4>6. Conclusión</h4>
                    <p>${conclusion.texto_conclusion || 'No se generó conclusión.'}</p>
                `;
                
                return report;
            }

    document.getElementById('written-report-container').innerHTML = generateWrittenReport(data);

    // --- Download Button ---
    document.getElementById('download-btn').addEventListener('click', () => {
        // Clonar el documento para no modificar el original
        const printDoc = document.cloneNode(true);
        // Cargar data.js para que window.reportStructure esté disponible en el contexto del nuevo documento
        const scriptTag = printDoc.createElement('script');
        scriptTag.src = 'js/data.js'; 
        printDoc.head.appendChild(scriptTag);

        const html = '<!doctype html>\n' + printDoc.documentElement.outerHTML;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Informe_AngioTC_${(patient.nombre || 'Paciente').replace(/\s+/g, '_')}.html`;
        a.click();
        URL.revokeObjectURL(url);
    });
});