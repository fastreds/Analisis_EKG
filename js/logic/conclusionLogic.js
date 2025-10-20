const severityMap = {
    'Mínima (1-24%)': 24,
    'Leve (25-49%)': 49,
    'Moderada (50-69%)': 69,
    'Severa (70-99%)': 99,
    'Oclusión total (100%)': 100
};

const severityToLabel = {
    24: 'mínima',
    49: 'leve',
    69: 'moderada',
    99: 'severa',
    100: 'oclusión total'
};

export const generateConclusion = (data, reportStructure) => {
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
    
    const anatomiaGeneral = data.anatomia_general;
    if (anatomiaGeneral) {
        let anatomyText = '- Anatomía coronaria con ';
        if (anatomiaGeneral.dominancia) {
            anatomyText += `${anatomiaGeneral.dominancia.toLowerCase()}`;
        }
        if (anatomiaGeneral.origen_arterias === 'Anómalo' && anatomiaGeneral.anomalo_details) {
            let anomalia = '';
            // Prioritize the specific vessel anomaly if it exists
            if (anatomiaGeneral.anomalo_details.seno_opuesto_details && anatomiaGeneral.anomalo_details.seno_opuesto_details.vaso_anomalo) {
                anomalia = anatomiaGeneral.anomalo_details.seno_opuesto_details.vaso_anomalo;
            } 
            // Fallback to the general anomaly type if the specific one isn't present
            else if (Array.isArray(anatomiaGeneral.anomalo_details.tipo_anomalia) && anatomiaGeneral.anomalo_details.tipo_anomalia.length > 0) {
                anomalia = anatomiaGeneral.anomalo_details.tipo_anomalia.join(', ');
            }
            
            if (anomalia) {
                anatomyText += `, con origen anómalo de ${anomalia}`;
            } else {
                anatomyText += `, con origen anómalo no especificado`;
            }
        } else {
            anatomyText += ", con origen normal de las arterias coronarias";
        }
        // Solo añadir "desde los senos de Valsalva" si el origen es normal o no se especifica un origen fuera de ellos.
        if (anatomiaGeneral.origen_arterias !== 'Anómalo' || (anatomiaGeneral.anomalo_details && !anatomiaGeneral.anomalo_details.tipo_anomalia.includes('Origen desde la arteria pulmonar (ALCAPA/ARCAPA)'))) {
            anatomyText += " desde los senos de Valsalva";
        }
        // Añadir la ramificación del TCI solo si se ha especificado.
        if (anatomiaGeneral.ramificacion_tci) {
            anatomyText += `. ${anatomiaGeneral.ramificacion_tci}.`;
        }
        anatomyText += '\n';
        conclusion += anatomyText;
    }

    const cadRadsData = data.cad_rads;
    if (cadRadsData && cadRadsData.score) {
        conclusion += `- Clasificación según CAD-RADS™ 2.0: ${cadRadsData.score}.  según la clasificación del documento de consenso de expertos SCCT, ACR, NASCI 
y ACC (JCardiovasc Comput Tomogr. 2016 Jul-Aug;10(4):269-81).`;
        if (cadRadsData.modifiers && cadRadsData.modifiers.length > 0) {
            conclusion += ` Modificadores: ${cadRadsData.modifiers.join(', ')}.`;
        }
        conclusion += '\n';
    }

    const segmentData = data.evaluacion_segmento?.segments;
    const allSegmentsInfo = reportStructure.find(s => s.id === 'evaluacion_segmento')?.segments || [];
    const findingsByVessel = { TCI: [], DA: [], CX: [], CD: [] };
    const otherFindings = [];
    let hasAnyNonObstructivePlaque = false;

    const segmentToVesselMap = {
        5: 'TCI',
        6: 'DA', 7: 'DA', 8: 'DA', 9: 'DA', 10: 'DA', 101: 'DA',
        11: 'CX', 12: 'CX', 121: 'CX', 122: 'CX', 123: 'CX', 13: 'CX', 14: 'CX', 15: 'CX',
        1: 'CD', 2: 'CD', 3: 'CD', 4: 'CD', 16: 'CD', 21: 'CD'
    };

    if (segmentData) {
        Object.entries(segmentData).forEach(([segmentId, segment]) => {
            const segmentInfo = allSegmentsInfo.find(s => s.id == segmentId);
            if (!segmentInfo || !segment.findings) return;

            const vessel = segmentToVesselMap[segmentId];
            if (!vessel) return;

            if (segment.findings.placas?.length > 0) {
                segment.findings.placas.forEach(plaque => {
                    const stenosisValue = severityMap[plaque.estenosis] || 0;
                    findingsByVessel[vessel].push({
                        type: 'placa',
                        segmentName: segmentInfo.name.split(':')[1]?.trim() || segmentInfo.name,
                        composition: plaque.composicion,
                        stenosisValue: stenosisValue
                    });
                    if (stenosisValue > 0 && stenosisValue < 50) {
                        hasAnyNonObstructivePlaque = true;
                    }
                });
            }

            if (segment.findings.stents?.length > 0) {
                segment.findings.stents.forEach(stent => {
                    let stentText = `Stent en ${segmentInfo.name}`;
                    if (stent.evaluacion === 'Con reestenosis intra-stent') {
                        stentText += ` con reestenosis ${stent.reestenosis_details?.grado || 'no especificada'}`;
                    } else if (stent.evaluacion !== 'Permeable, sin reestenosis significativa') {
                        stentText += ` (${stent.evaluacion})`;
                    } else {
                        stentText += ` (permeable)`;
                    }
                    otherFindings.push(stentText);
                });
            }

            if (segment.findings.has_puente) {
                otherFindings.push(`Puente miocárdico en ${segmentInfo.name}`);
            }
            
            if (segment.findings.has_aneurisma) {
                otherFindings.push(`Aneurisma/ectasia en ${segmentInfo.name}`);
            }
        });
    }

    let plaqueSummaries = [];
    const vesselNames = {
        DA: "Arteria Descendente Anterior",
        CX: "Arteria Circunfleja",
        CD: "Arteria Coronaria Derecha",
        TCI: "Tronco Coronario Izquierdo"
    };

    Object.entries(findingsByVessel).forEach(([vessel, findings]) => {
        if (findings.length === 0) return;

        const compositions = new Set(findings.map(f => (f.composition || '').replace(' (blanda)', '').replace(' (mixta)', '')));
        const segments = [...new Set(findings.map(f => f.segmentName))];
        const minStenosis = Math.min(...findings.map(f => f.stenosisValue));
        const maxStenosis = Math.max(...findings.map(f => f.stenosisValue));

        let compoText = [...compositions].join('/').toLowerCase();
        if (compoText.includes('calcificada') && compoText.includes('parcialmente')) compoText = 'mixta';

        let stenoText = '';
        const minLabel = severityToLabel[Object.values(severityMap).find(v => v >= minStenosis)];
        const maxLabel = severityToLabel[maxStenosis];

        if (minLabel && maxLabel && minLabel !== maxLabel) {
            stenoText = `${minLabel} a ${maxLabel}`;
        } else if (maxLabel) {
            stenoText = maxLabel;
        }

        plaqueSummaries.push(`${vesselNames[vessel]} con ateromatosis ${compoText} que produce estenosis ${stenoText} en ${segments.join(', ')}`);
    });

    if (plaqueSummaries.length > 0) {
        conclusion += `- A nivel de las arterias coronarias se observa: ${plaqueSummaries.join('; ')}.\n`;
    } else if (hasAnyNonObstructivePlaque) {
        conclusion += "- Se identifica enfermedad arterial coronaria no obstructiva.\n";
    } else {
        conclusion += "- Ausencia de enfermedad arterial coronaria aterosclerótica.\n";
    }

    if (otherFindings.length > 0) {
        conclusion += `- Otros hallazgos incluyen: ${otherFindings.join('; ')}.\n`;
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

    return conclusion;
};
