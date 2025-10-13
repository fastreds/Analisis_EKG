export const coronaryTreeStructure = {
    sections: [
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
        }
    ]
};
