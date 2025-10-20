export const reportStructure = [{
    title: "Datos del Paciente",
    id: "datos_paciente",
    fields: [{
        id: 'nombre',
        label: 'Nombre',
        type: 'text',
        placeholder: 'Nombre completo del paciente',
        required: true
    }, {
        id: 'id_paciente',
        label: 'Identificación',
        type: 'text',
        placeholder: 'Cédula o ID',
        required: true
    }, {
        id: 'edad',
        label: 'Edad',
        type: 'number',
        placeholder: 'Años',
        detail: 'años.'
    }, {
        id: 'genero',
        label: 'Género',
        type: 'select',
        options: ['Masculino', 'Femenino', 'Otro']
    }, {
        id: 'peso',
        label: 'Peso',
        type: 'number',
        placeholder: '(80) kg',
        detail: 'kg'
    }, {
        id: 'talla',
        label: 'Talla',
        type: 'number',
        placeholder: '(170) cm',
        detail: 'cm'
    }, {
        id: 'area_sc',
        label: 'Área SC',
        type: 'number',
        placeholder: 'Calculado automáticamente',
        detail: 'm²',
        readonly: true,
        reportAvoid: false
    },{
        id: 'paciente_email',
        label: 'Email del Paciente',
        type: 'text',
        placeholder: 'paciente@email.d',
        detail: '',
        reportAvoid: true,
        required: true
    }]
}, {
    "title": "Información Clínica",
    "id": "informacion_clinica",
    "fields": [{
        "id": "indicacion",
        "label": "Indicación del Estudio",
        "type": "textarea",
        "placeholder": "Ej: Dolor torácico atípico, evaluación de riesgo cardiovascular...",
        "rows": 3,
        options: ["SOLICITUD DE ANGIOTAC CORONARIO POR:", "Dolor torácico", "Evaluación de riesgo cardiovascular", "Seguimiento de enfermedad coronaria conocida", "Evaluación preoperatoria", "Otros"]
    }, {
        "id": "factores_riesgo",
        "label": "Factores de Riesgo Cardiovascular",
        "type": "checkbox",
        "options": ["Hipertensión arterial", "Diabetes mellitus", "Dislipidemia", "Tabaquismo", "Historia familiar de enfermedad coronaria", "Obesidad", "Sedentarismo"]
    }]
}, {
    "title": "Métodos del Estudio",
    "id": "protocolo_estudio",
    "fields": [{
        id: 'fecha_estudio',
        label: 'Fecha del Estudio',
        type: 'date',
        required: true
    }, {
        id: 'medico_referente',
        label: 'Médico Referente',
        type: 'text',
        placeholder: 'Dr(a). Apellido'
    }, {
        id: 'medico_especialidad',
        label: 'Espedialidad del Médico referente',
        type: 'text',
        placeholder: 'Especialidad',
        options: ['Cardiología', 'Medicina Interna', 'Cirugía General', 'Medicina Familiar', 'Otra']
    },{
        id: 'doctorEmail',
        label: 'Email del Doctor',
        type: 'text',
        placeholder: 'doctor@email.d',
        detail: '',
        reportAvoid: true,
        required: false
    }, {
        id: 'medico_interpreta',
        label: 'Médico que Interpreta',
        type: 'text',
        placeholder: 'Dr(a). Apellido'
    }, {
        "id": "equipo",
        "label": "Tomógrafo",
        "type": "select",
        "options": ["Canon Aquilion 160 cortes", "Siemens Somatom", "GE Revolution", "Philips Ingenuity", "Canon Aquilion ONE 320"]
    }, {
        "id": "tiempo_rotacion",
        "label": "Tiempo de rotación",
        "type": "select",
        "options": ["0.28/seg", "0.35/seg", "0.5/seg", "0.7/seg"]
    }, {
        "id": "adquisicion",
        "label": "ECG-gating para Corazón y Aorta torácica",
        "type": "select",
        "options": ["Retrospectivo", "Prospectivo", "Sin ECG"]
    }, {
        "id": "ecg_gating_detalles",
        "label": "Detalles de ECG-gating",
        "type": "text",
        "placeholder": "Ej: variabilidad FC respiratoria marcada"
    }, {
        "id": "medio_contraste",
        "label": "Medio contraste",
        "type": "select",
        "options": ["Ultravist 370", "Omnipaque 350", "Visipaque 320", "Optiray 350", "Isovue 370"]
    }, {
        "id": "contraste_iv",
        "label": "Volumen de medio contraste",
        "type": "text",
        "placeholder": "Ej: 85 ml",
        "detail": " ml"
    }, {
        "id": "velocidad_infusion",
        "label": "Velocidad de infusión de medio contraste",
        "type": "select",
        "options": ["4 ml/s", "5 ml/s", "6 ml/s"]
    }, {
        "id": "ritmo_estudio",
        "label": "Ritmo durante el estudio",
        "type": "select",
        "options": ["Ritmo sinusal normal", "Ritmo bradicardia sinusal", "Taquicardia sinusal", "Fibrilación auricular"]
    }, {
        "id": "calidad_imagen",
        "label": "Calidad de la Imagen",
        "type": "select",
        "options": ["Excelente", "Buena", "Diagnóstica", "Limitada por artefactos", "No diagnóstica"]
    }]
}, {
    "title": "Motivo de estudio y generalidades",
    "id": "motivo_generalidades",
    "fields": [{
        "id": "descripcion_referencia",
        "label": "DESCRIPCIÓN DE LA REFERENCIA",
        "type": "textarea",
        "rows": 3
    }, {
        "id": "consentimiento_informado",
        "label": "Consentimiento informado",
        "type": "textarea",
        "placeholder": " Puede seleccionar una o varias opciones o digitar una personalizada",
        "options": ["Después de explicar al paciente los riesgos potenciales y los beneficios que obtendrá del estudio y siguiendo en todo momento los principios éticos respectivos y normados, se firma el consentimiento informado para realizar el estudio."]
    }, {
        "id": "tolerancia_estudio",
        "label": "Tolerancia al estudio",
        "type": "select",
        "options": ["Buena tolerancia, sin reacciones adversas al medio contraste", "Reacciones leves (urticaria, náuseas)", "Reacciones moderadas (vómitos, broncoespasmo)", "Reacciones severas (anafilaxia)"]
    }, {
        "id": "fc_durante_estudio",
        "label": "FC durante el estudio",
        "type": "text",
        "placeholder": "Ej: 45-55 lpm"
    }, {
        "id": "medicamentos_usados",
        "label": "Medicamentos usados",
        "type": "checkbox",
        "options": ["Nitroglicerina sublingual", "Beta-bloqueadores"]
    }, {
        "id": "analisis_imagenes",
        "label": "Análisis de imágenes",
        "type": "select",
        "options": ["Vitrea", "Syngo.via", "IntelliSpace Portal", "Circle CVI", "Medis Suite", "CardIQ"]
    }]
}, {
    "title": "Anatomía cardiovascular",
    "id": "anatomia_cardiovascular",
    "fields": [{
        "id": "venas_cavas",
        "label": "Venas cavas",
        "type": "checkbox",
        "options": ["Ambas no dilatadas drenando en la aurícula derecha", "Dilatada superior o inferior", "Azygos continuation of IVC", "Persistent left SVC draining to coronary sinus", "Thrombus", "Stenosis o compresión"]
    }, {
        "id": "auricula_derecha",
        "label": "Aurícula derecha",
        "type": "checkbox",
        "options": ["No dilatada", "Dilatada", "Thrombus", "Myxoma o masa", "Hipertrofia"]
    }, {
        "id": "septum_interauricular",
        "label": "Septum interauricular",
        "type": "select",
        "options": ["No se visualizan defectos", "Defecto septal atrial", "Patent foramen ovale", "Aneurisma septal", "Hipertrofia lipomatosa"]
    }, {
        "id": "seno_coronario",
        "label": "Seno coronario",
        "type": "select",
        "options": ["Drenando a la AD en forma habitual sin dilatación o anomalías", "Dilatado", "Drenaje anómalo", "Obstrucción o compresión"]
    }, {
        "id": "valvula_tricuspide",
        "label": "Válvula tricúspide",
        "type": "select",
        "options": ["No se visualizan defectos por este método", "Regurgitación funcional", "Estenosis", "Vegetaciones", "Calcificación"]
    }, {
        "id": "ventriculo_derecho",
        "label": "Ventrículo derecho",
        "type": "select",
        "options": ["No dilatado ni hipertrófico", "Dilatado", "Hipertrófico", "Disfunción o hipocinesia", "Infiltración adiposa", "Thrombus"]
    }, {
        "id": "arteria_pulmonar",
        "label": "Arteria pulmonar",
        "type": "select",
        "options": ["Diámetro Normal", "Dilatada (>34 mm)", "Estenosis", "Tromboembolismo", "Aneurisma"]
    }, {
        "id": "venas_pulmonares",
        "label": "Venas pulmonares",
        "type": "select",
        "options": ["Cuatro drenando a la aurícula izquierda, dos derechas y dos izquierdas", "Drenaje anómalo (PAPVR/TAPVR)", "Estenosis u oclusión", "Dilatadas", "Síndrome de Scimitar"]
    }, {
        "id": "auricula_izquierda",
        "label": "Aurícula izquierda",
        "type": "select",
        "options": ["No se observan trombos en la orejuela izquierda, ni masas o lesiones intracardiacas", "Dilatada", "Thrombus en orejuela", "Myxoma o masa", "Cor triatriatum"]
    }, {
        "id": "ventriculo_izquierdo_size",
        "label": "Tamaño Ventrículo izquierdo",
        "type": "select",
        "options": ["No dilatado", "Dilatado"]
    }, {
        "id": "ventriculo_izquierdo_hipertrofia",
        "label": "Hipertrofia Ventrículo izquierdo",
        "type": "select",
        "options": ["Ninguna", "Concéntrica leve", "Concéntrica moderada", "Concéntrica severa", "Excéntrica", "Asimétrica"]
    }, {
        "id": "ventriculo_izquierdo_motilidad",
        "label": "Motilidad Ventrículo izquierdo",
        "type": "select",
        "options": ["Global y regional conservada", "Hipocinesia global", "Hipocinesia regional", "Acinesia"]
    }, {
        "id": "ventriculo_izquierdo_fevi",
        "label": "FEVI Ventrículo izquierdo",
        "type": "select",
        "options": ["Normal (>55%)", "Levemente reducida (45-54%)", "Moderadamente reducida (30-44%)", "Severamente reducida (<30%)"]
    }, {
        "id": "hallazgos_extracardiacos",
        "label": "Hallazgos extracardiacos",
        "type": "select",
        "options": ["Ninguno", "Hernia hiatal pequeña", "Calcificaciones aórticas", "Lesiones pulmonares", "Dilatación aórtica", "Otras anomalías torácicas"]
    }]
}, {
    "title": "Válvula Aórtica y Diámetros de la Aorta",
    "id": "valvula_aortica_diametros_aorta",
    "fields": [{
        "id": "cuspidies",
        "label": "Cúspides",
        "type": "select",
        "options": ["3 cúspides de conformación Normal", "2 cúspides (bicúspide R-L)", "2 cúspides (bicúspide R-N)", "2 cúspides (bicúspide L-N)", "4 cúspides (quadricúspide)", "1 cúspide (unicúspide)", "3 cúspides con fusión parcial", "3 cúspides con desigualdad en tamaño", "Cúspides izquierda coronaria, derecha coronaria y no coronaria", "Cúspides izquierda, derecha y posterior", "Variaciones menores en tamaño de cúspides"]
    }, {
        "id": "calcificaciones",
        "label": "Calcificaciones",
        "type": "select",
        "options": ["NO PRESENTA", "Leve (<400 AU)", "Moderada (400-1300 AU en mujeres, 1000-2000 AU en hombres)", "Severa (>1300 AU en mujeres, >2000 AU en hombres)", "Pesada (sugiere estenosis severa)", "Calcificación asociada a regurgitación", "Calcificación en cúspides individuales", "Calcificación anular", "Calcificación extendida a raíz aórtica", "Ninguna visible por método"]
    }, {
        "id": "morfologia_anillo",
        "label": "Morfología del Anillo aórtico",
        "type": "select",
        "options": ["Elíptica", "Circular", "Oval", "Asimétrica", "Coroniforme", "Diamante", "Triangular", "Irregular", "Cambios conformacionales durante ciclo cardíaco", "Más circular en <40 años", "Más oval en >40 años", "Vertical u horizontal"]
    }, {
        "id": "diametro_menor_anillo",
        "label": "Diámetro menor del anillo (mm)",
        "type": "select",
        "options": ["15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40"]
    }, {
        "id": "diametro_mayor_anillo",
        "label": "Diámetro mayor del anillo (mm)",
        "type": "select",
        "options": ["15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40"]
    }, {
        "id": "senos_valsalva_diametro",
        "label": "Diámetro Senos de Valsalva (mm)",
        "type": "select",
        "options": ["20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50"]
    }, {
        "id": "senos_valsalva_indexado",
        "label": "Diámetro indexado Senos de Valsalva (mm/m2 SC)",
        "type": "select",
        "options": ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"]
    }, {
        "id": "senos_valsalva_referencia",
        "label": "Valores de referencia Indexados Senos de Valsalva (mm/m2 SC)",
        "type": "select",
        "options": ["16±2 (15-18)", "14±2 (13-15)", "18±2 (17-19)", "30.51 mm/m2 promedio", "<20 mm/m2 normal", "22.77 mm/m2 annulus", "15-18", "13-17", "28.2 ± 3.2"]
    }, {
        "id": "senos_valsalva_aneurismatico",
        "label": "Referencia de rango aneurismático Senos de Valsalva (mm/m2 SC)",
        "type": "select",
        "options": ["24", "21", "25", ">2.1 cm/m2", ">2.75 cm/m2", ">2.9 cm/m2", "4.5-5.0 cm", ">40 mm absoluto"]
    }, {
        "id": "senos_valsalva_observaciones",
        "label": "Observaciones Senos de Valsalva",
        "type": "select",
        "options": ["NORMAL", "DILATADO", "ANEURISMÁTICO", "CALCIFICADO", "ECTASIA", "SINUSOIDAL", "MAYOR EN HOMBRES", "MENOR EN MUJERES", "RELACIONADO CON EDAD", "SIN CAMBIOS"]
    }, {
        "id": "union_sinotubular_diametro",
        "label": "Diámetro Unión sinotubular (mm)",
        "type": "select",
        "options": ["20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]
    }, {
        "id": "union_sinotubular_indexado",
        "label": "Diámetro indexado Unión sinotubular (mm/m2 SC)",
        "type": "select",
        "options": ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25"]
    }, {
        "id": "union_sinotubular_referencia",
        "label": "Valores de referencia Indexados Unión sinotubular (mm/m2 SC)",
        "type": "select",
        "options": ["14±2 (13-15)", "13±2", "15±2", "28.2 ± 3.2", "<30 mm absoluto", "14-17", "21.6 ± 1.6 basal", "35.1 ± 4.8 STJ"]
    }, {
        "id": "union_sinotubular_aneurismatico",
        "label": "Referencia de rango aneurismático Unión sinotubular (mm/m2 SC)",
        "type": "select",
        "options": ["21", "24", "25", ">2.1 cm/m2", ">2.75 cm/m2", ">40 mm", ">5.0 cm"]
    }, {
        "id": "union_sinotubular_observaciones",
        "label": "Observaciones Unión sinotubular",
        "type": "select",
        "options": ["NORMAL", "DILATADO", "ANEURISMÁTICO", "FUNCIONALMENTE DILATADO >30 mm", "RELACIONADO CON BSA", "SIN DILATACIÓN", "MAYOR EN ATLETAS", "MENOR EN MUJERES"]
    }, {
        "id": "porcion_tubular_ascendente_diametro",
        "label": "Diámetro Porción tubular ascendente (mm)",
        "type": "select",
        "options": ["20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50"]
    }, {
        "id": "porcion_tubular_ascendente_indexado",
        "label": "Diámetro indexado Porción tubular ascendente (mm/m2 SC)",
        "type": "select",
        "options": ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28"]
    }, {
        "id": "porcion_tubular_ascendente_referencia",
        "label": "Valores de referencia Indexados Porción tubular ascendente (mm/m2 SC)",
        "type": "select",
        "options": ["14±2 (13-17)", "13±2", "17±2", "28.30 mm/m2 promedio", "<2.1 cm/m2", "<40 mm absoluto", "33 ± 4 mm", "3.0 cm ± 0.5"]
    }, {
        "id": "porcion_tubular_ascendente_aneurismatico",
        "label": "Referencia de rango aneurismático Porción tubular ascendente (mm/m2 SC)",
        "type": "select",
        "options": ["24", "21", "25", ">2.1 cm/m2", ">4 cm absoluto", ">4.5 cm", ">5.0 cm", ">2.75 cm/m2"]
    }, {
        "id": "porcion_tubular_ascendente_observaciones",
        "label": "Observaciones Porción tubular ascendente",
        "type": "select",
        "options": ["NORMAL", "DILATADO (>35 mm)", "ANEURISMÁTICO (>45 mm)", "MEDICIÓN A 40 MM DEL ANILLO", "SIN DILATACIÓN", "RELACIONADO CON EDAD Y SEXO", "MAYOR EN HOMBRES", "ECTASIA", "DISSECCIÓN POSIBLE"]
    }]
}, {
    title: "Score de Calcio (Agatston)",
    id: "score_calcio",
    fields: [{
        id: 'tci',
        label: 'TCI',
        type: 'number',
        placeholder: '0',
        class: 'score-input'
    }, {
        id: 'da',
        label: 'DA',
        type: 'number',
        placeholder: '0',
        class: 'score-input'
    }, {
        id: 'cx',
        label: 'CX',
        type: 'number',
        placeholder: '0',
        class: 'score-input'
    }, {
        id: 'cd',
        label: 'CD',
        type: 'number',
        placeholder: '0',
        class: 'score-input'
    }, {
        id: 'total',
        label: 'Score Total',
        type: 'number',
        placeholder: 'Calculado',
        readonly: true
    }, {
        id: 'percentil',
        label: 'Percentil para Edad y Género',
        type: 'select',
        options: ['<25', '25-50', '50-75', '>75', '>90']
    }]
}, {
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
            label: 'Detalles de Anomalía Coronaria',
            fields: [
                {
                    id: 'tipo_anomalia',
                    label: 'Tipo de Anomalía: ',
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
            options: ['Dominancia Derecha', 'Dominancia Izquierda', 'Codominancia'],
            default: 'Dominancia Derecha'
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
      // Arteria Coronaria Derecha (ACD)
    { "id": 1, "name": "Segmendto 1: ACD, Proximal (pACD)" },
    { "id": 2, "name": "Segmento 2: ACD, Media (mACD)" },
    { "id": 21, "name": "Segmento 2.1: Rama Marginal Aguda (RMA)" },
    { "id": 3, "name": "Segmento 3: ACD, Distal (dACD)" },
    { "id": 4, "name": "Segmento 4: Arteria Descendente Posterior (ADP)" },
    { "id": 16, "name": "Segmento 16: Rama Posterolateral Derecha (RPLD)" },

    // Tronco Coronario Izquierdo (TCI)
    { "id": 5, "name": "Segmento 5: Tronco Coronario Izquierdo (TCI)" },

    // Arteria Descendente Anterior (ADA) y Ramas
    { "id": 6, "name": "Segmento 6: ADA, Proximal (pADA)" },
    { "id": 7, "name": "Segmento 7: ADA, Media (mADA)" },
    { "id": 8, "name": "Segmento 8: ADA, Distal/Apical (dADA)" },
    { "id": 9, "name": "Segmento 9: Primera Diagonal (D1)" },
    { "id": 10, "name": "Segmento 10: Segunda Diagonal (D2)" },
    { "id": 101, "name": "Segmento 10.1: Tercera Diagonal (D3)" },

    // Arteria Circunfleja (ACx) y Ramas
    { "id": 11, "name": "Segmento 11: ACx, Proximal (pACx)" },
    { "id": 123, "name": "Segmento 12.3: Rama Intermedia (RI)" },
    { "id": 12, "name": "Segmento 12: Primera Obtusa Marginal (OM1)" },
    { "id": 121, "name": "Segmento 12.1: Segunda Obtusa Marginal (OM2)" },
    { "id": 122, "name": "Segmento 12.2: Tercera Obtusa Marginal (OM3)" },
    { "id": 13, "name": "Segmento 13: ACx, Distal (dACx)" },
    { "id": 14, "name": "Segmento 14: Rama Posterolateral Izquierda (RPLI)" },
    { "id": 15, "name": "Segmento 15: Descendente Posterior Izquierda (DPI)" },
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
                    template: [{
                        id: 'composicion',
                        label: 'Composición',
                        type: 'radio',
                        options: ['No calcificada (blanda)', 'Parcialmente calcificada (mixta)', 'Calcificada']
                    }, {
                        id: 'fosfolipidica',
                        label: 'Fosfolipídica (%)',
                        type: 'number',
                        placeholder: '30',
                        detail: '%'
                    }, {
                        id: 'mixta',
                        label: 'Mixta (%)',
                        type: 'number',
                        placeholder: '40',
                        detail: '%'
                    }, {
                        id: 'fibrosa',
                        label: 'Fibrosa (%)',
                        type: 'number',
                        placeholder: '15',
                        detail: '%'
                    }, {
                        id: 'calcificada',
                        label: 'Calcificada (%)',
                        type: 'number',
                        placeholder: '15',
                        detail: '%'
                    }, {
                        id: 'estenosis',
                        label: 'Grado de Estenosis',
                        type: 'select',
                        options: ['Mínima (1-24%)', 'Leve (25-49%)', 'Moderada (50-69%)', 'Severa (70-99%)', 'Oclusión total (100%)']
                    }, {
                        id: 'has_hrp',
                        label: 'Características de Placa de Alto Riesgo (HRP ≥2)',
                        type: 'checkbox',
                        options: ['Remodelado Positivo', 'Placa de Baja Atenuación', 'Calcificaciones Puntiformes', 'Signo del Anillo de Servilleta']
                    }, {
                        id: 'comentario_placa',
                        label: 'Comentario',
                        type: 'textarea',
                        rows: 2,
                        placeholder: 'Comentarios sobre esta placa...'
                    }]
                },
                {
                    id: 'stents',
                    title: 'B. Stents Preexistentes',
                    type: 'repeatable_block',
                    add_button_label: '+ Añadir Stent',
                    template: [{
                        id: 'evaluacion',
                        label: 'Evaluación del Stent',
                        type: 'radio',
                        options: ['Permeable, sin reestenosis significativa', 'Con reestenosis intra-stent', 'Trombosis/Oclusión de stent', 'No valorable por artefacto metálico'],
                        triggers: {
                            'Con reestenosis intra-stent': 'show_reestenosis_details'
                        }
                    }, {
                        id: 'reestenosis_details',
                        type: 'conditional_group',
                        fields: [{
                            id: 'grado',
                            label: 'Grado',
                            type: 'select',
                            options: ['Leve <50%', 'Moderada 50-69%', 'Severa ≥70%']
                        }, {
                            id: 'tipo',
                            label: 'Tipo',
                            type: 'select',
                            options: ['Focal', 'Difusa', 'Proliferativa']
                        }]
                    }, {
                        id: 'comentario_stent',
                        label: 'Comentario',
                        type: 'textarea',
                        rows: 2,
                        placeholder: 'Comentarios sobre este stent...'
                    }]
                },
                {
                    id: 'has_puente',
                    label: 'C. Puente Miocárdico',
                    type: 'master_checkbox',
                    triggers: {
                        'checked': 'show_puente_details'
                    }
                }, {
                    id: 'puente_details',
                    type: 'conditional_group',
                    fields: [{
                        id: 'profundidad',
                        label: 'Profundidad',
                        type: 'radio',
                        options: ['Superficial', 'Profundo']
                    }, {
                        id: 'compresion',
                        label: 'Compresión Sistólica ("Milking")',
                        type: 'select',
                        options: ['Ausente', 'Leve <50%', 'Moderada 50-75%', 'Severa >75%']
                    }]
                }, {
                    id: 'has_aneurisma',
                    label: 'D. Aneurisma / Ectasia',
                    type: 'master_checkbox',
                    triggers: {
                        'checked': 'show_aneurisma_details'
                    }
                }, {
                    id: 'aneurisma_details',
                    type: 'conditional_group',
                    fields: [{
                        id: 'diametro',
                        label: 'Diámetro máximo (mm)',
                        type: 'number'
                    }]
                }
            ]
        }
    ]
}, {
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
}, {
    title: "CAD-RADS™ 2.0",
    id: "cad_rads",
    fields: [{
        id: 'score',
        label: 'CAD-RADS 2.0 Score (Autocalculado)',
        type: 'select',
        options: ['CAD-RADS 0', 'CAD-RADS 1', 'CAD-RADS 2', 'CAD-RADS 3', 'CAD-RADS 4A', 'CAD-RADS 4B', 'CAD-RADS 5', 'CAD-RADS N']
    }, {
        id: 'modifiers',
        label: 'Modificadores',
        type: 'checkbox',
        options: ['V (Placa Vulnerable)', 'S (Stent)', 'G (Bypass)', 'I (Inestenótico)']
    }, {
        id: 'description',
        label: 'Descripción CAD-RADS',
        type: 'textarea',
        placeholder: 'Describa los hallazgos que justifican el score o cualquier otra consideración...',
        rows: 3
    }]
}, {
    title: "Evaluación Extracardiaca",
    id: "evaluacion_extracardiaca",
    fields: [{
        id: 'hallazgos',
        label: 'Hallazgos Significativos',
        type: 'checkbox',
        options: ['Sin hallazgos patológicos significativos', 'Aneurisma/dilatación de aorta torácica', 'Nódulos pulmonares', 'Embolismo pulmonar', 'Derrame pericárdico', 'Derrame pleural', 'Hernia hiatal', 'Linfadenopatías mediastinales']
    }]
}, {
    title: "Comentarios Adicionales",
    id: "comentarios_adicionales",
    fields: [{
        id: 'texto',
        label: 'Comentarios',
        type: 'textarea',
        placeholder: 'Añadir cualquier comentario relevante no cubierto en otras secciones...',
        rows: 4
    }]
}, {
    title: "Conclusión",
    id: "conclusion",
    fields: [{
        id: 'texto_conclusion',
        label: 'Texto de la Conclusión',
        type: 'textarea',
        placeholder: 'La conclusión se puede autocompletar o escribir manualmente...',
        rows: 8
    }, {
        id: 'autogenerate_conclusion',
        label: 'Autogenerar Conclusión',
        type: 'button'
    }]
}];