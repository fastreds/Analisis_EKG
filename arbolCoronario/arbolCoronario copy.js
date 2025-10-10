export const coronaryTreeStructure = {
    title: "Fase 3: Análisis Coronario Sistemático y Detallado",
    id: "analisis_coronario",
    sections: [
        {
            title: "Anatomía Coronaria General",
            id: "anatomia_general",
            fields: [
                {
                    id: 'origen_arterias',
                    label: '1.1. Origen de las Arterias Coronarias',
                    type: 'radio',
                    options: ['Normal', 'Anómalo'],
                    triggers: {
                        'Anómalo': 'show_anomalo_details'
                    }
                },
                {
                    id: 'anomalo_details',
                    type: 'conditional_group',
                    fields: [
                        {
                            id: 'tipo_anomalia',
                            label: 'Tipo de Anomalía (selección múltiple)',
                            type: 'checkbox',
                            options: ['Origen alto (supracomisural)', 'Origen en seno coronario opuesto', 'Arteria coronaria única', 'Origen desde la arteria pulmonar (ALCAPA/ARCAPA)', 'Ostia múltiples'],
                            triggers: {
                                'Origen en seno coronario opuesto': 'show_seno_opuesto_details'
                            }
                        },
                        {
                            id: 'seno_opuesto_details',
                            type: 'conditional_group',
                            fields: [
                                {
                                    id: 'vaso_anomalo',
                                    label: 'Vaso anómalo',
                                    type: 'select',
                                    options: ['ACD naciendo de Seno Izquierdo', 'TCI/ACI naciendo de Seno Derecho', 'ACx naciendo de Seno Derecho']
                                },
                                {
                                    id: 'trayecto_anomalo',
                                    label: 'Trayecto del vaso anómalo',
                                    type: 'radio',
                                    options: ['Interarterial (entre Aorta y Pulmonar)', 'Retroaórtico', 'Prepulmonar', 'Transeptal (intramiocárdico)']
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 'dominancia',
                    label: '1.2. Dominancia Coronaria',
                    type: 'radio',
                    options: ['Dominancia Derecha', 'Dominancia Izquierda', 'Codominancia']
                },
                {
                    id: 'ramificacion_tci',
                    label: '1.3. Ramificación del Tronco Coronario Izquierdo (TCI)',
                    type: 'radio',
                    options: ['Bifurcación (en ADA y ACx)', 'Trifurcación (presencia de Ramo Intermedio)']
                },
                {
                    id: 'terminacion_ada',
                    label: '1.4. Terminación de la Arteria Descendente Anterior (ADA)',
                    type: 'radio',
                    options: ['Tipo 1 (Termina antes de llegar al ápex)', 'Tipo 2 (Llega hasta el ápex)', 'Tipo 3 ("Wraparound")']
                }
            ]
        },
        {
            title: "Evaluación por Segmento (Modelo de 16 Segmentos)",
            id: "evaluacion_segmento",
            type: "segmented_group",
            segments: [
                { id: 5, name: 'Segmento 5: Tronco Coronario Izquierdo (TCI)' },
                { id: 6, name: 'Segmento 6: ADA, Proximal (pADA)' },
                { id: 7, name: 'Segmento 7: ADA, Media (mADA)' },
                { id: 8, name: 'Segmento 8: ADA, Distal/Apical (dADA)' },
                { id: 9, name: 'Segmento 9: Primera Diagonal (D1)' },
                { id: 10, name: 'Segmento 10: Segunda Diagonal (D2)' },
                { id: 11, name: 'Segmento 11: ACx, Proximal (pACx)' },
                { id: 12, name: 'Segmento 12: Primera Obtusa Marginal (OM1)' },
                { id: 13, name: 'Segmento 13: ACx, Distal (dACx)' },
                { id: 14, name: 'Segmento 14: Rama Posterolateral Izquierda (RPL)' },
                { id: 15, name: 'Segmento 15: Descendente Posterior Izquierda (DPI)' },
                { id: 1, name: 'Segmento 1: ACD, Proximal (pACD)' },
                { id: 2, name: 'Segmento 2: ACD, Media (mACD)' },
                { id: 3, name: 'Segmento 3: ACD, Distal (dACD)' },
                { id: 4, name: 'Segmento 4: Arteria Descendente Posterior (ADP)' },
                { id: 16, name: 'Segmento 16: Rama Posterolateral Derecha (RPLD)' },
            ],
            template: [
                {
                    id: 'estado_general',
                    label: 'Estado General del Segmento',
                    type: 'radio',
                    options: ['Sin hallazgos patológicos significativos', 'Con hallazgos patológicos', 'No valorable'],
                    triggers: {
                        'Con hallazgos patológicos': 'show_findings'
                    }
                },
                {
                    id: 'findings',
                    type: 'conditional_group',
                    fields: [
                        {
                            id: 'placas',
                            title: 'A. Placas Ateroscleróticas',
                            type: 'repeatable_block',
                            add_button_label: '+ Añadir Placa',
                            template: [
                                { id: 'composicion', label: 'Composición', type: 'radio', options: ['No calcificada (blanda)', 'Parcialmente calcificada (mixta)', 'Calcificada'] },
                                { id: 'estenosis', label: 'Grado de Estenosis', type: 'select', options: ['CAD-RADS 1: Mínima (1-24%)', 'CAD-RADS 2: Leve (25-49%)', 'CAD-RADS 3: Moderada (50-69%)', 'CAD-RADS 4A: Severa (70-99%)', 'CAD-RADS 5: Oclusión total (100%)'] },
                                { id: 'has_hrp', label: 'Características de Placa de Alto Riesgo (HRP ≥2)', type: 'checkbox', options: ['Remodelado Positivo', 'Placa de Baja Atenuación', 'Calcificaciones Puntiformes', 'Signo del Anillo de Servilleta'] },
                                { id: 'comentario_placa', label: 'Comentario', type: 'textarea', rows: 2, placeholder: 'Comentarios sobre esta placa...' }
                            ]
                        },
                        {
                            id: 'stents',
                            title: 'B. Stents Preexistentes',
                            type: 'repeatable_block',
                            add_button_label: '+ Añadir Stent',
                            template: [
                                 { id: 'evaluacion', label: 'Evaluación del Stent', type: 'radio', options:['Permeable, sin reestenosis significativa', 'Con reestenosis intra-stent', 'Trombosis/Oclusión de stent', 'No valorable por artefacto metálico'], triggers: {'Con reestenosis intra-stent': 'show_reestenosis_details'}},
                                 {
                                     id: 'reestenosis_details',
                                     type: 'conditional_group',
                                     fields: [
                                         { id: 'grado', label: 'Grado', type: 'select', options: ['Leve <50%', 'Moderada 50-69%', 'Severa ≥70%']},
                                         { id: 'tipo', label: 'Tipo', type: 'select', options: ['Focal', 'Difusa', 'Proliferativa']}
                                     ]
                                 },
                                 { id: 'comentario_stent', label: 'Comentario', type: 'textarea', rows: 2, placeholder: 'Comentarios sobre este stent...' }
                            ]
                        },
                        { id: 'has_puente', label: 'C. Puente Miocárdico', type: 'master_checkbox', triggers: { 'checked': 'show_puente_details' }},
                        { id: 'puente_details', type: 'conditional_group', fields: [
                            { id: 'profundidad', label: 'Profundidad', type: 'radio', options: ['Superficial', 'Profundo']},
                            { id: 'compresion', label: 'Compresión Sistólica ("Milking")', type: 'select', options:['Ausente', 'Leve <50%', 'Moderada 50-75%', 'Severa >75%']}
                        ]},
                        { id: 'has_aneurisma', label: 'D. Aneurisma / Ectasia', type: 'master_checkbox', triggers: { 'checked': 'show_aneurisma_details' }},
                        { id: 'aneurisma_details', type: 'conditional_group', fields: [{ id: 'diametro', label: 'Diámetro máximo (mm)', type: 'number'}] }
                    ]
                }
            ]
        },
        {
            title: "Evaluación de Injertos de Bypass (Grafts)",
            id: "bypass",
            fields: [
                {
                    id: 'antecedentes_bypass',
                    label: '¿El paciente tiene antecedentes de cirugía de revascularización miocárdica?',
                    type: 'radio',
                    options: ['No', 'Sí'],
                    triggers: {
                        'Sí': 'show_grafts_container'
                    }
                },
                {
                    id: 'grafts_container',
                    type: 'repeatable_block',
                    add_button_label: '+ Añadir Injerto',
                    template: [
                        { id: 'tipo_conducto', label: 'Tipo de Conducto', type: 'select', options: ['Arteria Mamaria Interna Izquierda (LIMA)', 'Arteria Mamaria Interna Derecha (RIMA)', 'Vena Safena (SVG)', 'Arteria Radial'] },
                        { id: 'anastomosis_proximal', label: 'Anastomosis Proximal (Origen)', type: 'select', options: ['Aorta', 'In situ', 'Otro injerto (Y-graft)'] },
                        { id: 'anastomosis_distal', label: 'Anastomosis Distal (Destino)', type: 'select', options: ['Segmento 1', 'Segmento 2', 'Segmento 3', 'Segmento 4', 'Segmento 5', 'Segmento 6', 'Segmento 7', 'Segmento 8', 'Segmento 9', 'Segmento 10', 'Segmento 11', 'Segmento 12', 'Segmento 13', 'Segmento 14', 'Segmento 15', 'Segmento 16'] },
                        { id: 'estado_injerto', label: 'Estado del Injerto', type: 'radio', options: ['Permeable, sin estenosis', 'Con estenosis', 'Ocluido', 'No valorable'] }
                    ]
                }
            ]
        }
    ]
};

