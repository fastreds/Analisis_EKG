export const reportStructure = [{
    title: "Datos del Paciente",
    id: "datos_paciente",
    fields: [{
        id: 'nombre',
        label: 'Nombre',
        type: 'text',
        placeholder: 'Nombre completo del paciente'
    }, {
        id: 'id_paciente',
        label: 'Identificación',
        type: 'text',
        placeholder: 'Cédula o ID'
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
    }]
}, {
    "title": "Información Clínica",
    "id": "informacion_clinica",
    "fields": [{
        "id": "indicacion",
        "label": "Indicación del Estudio",
        "type": "textarea",
        "placeholder": "Ej: Dolor torácico atípico, evaluación de riesgo cardiovascular...",
        "rows": 3
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
        type: 'date'
    }, {
        id: 'medico_referente',
        label: 'Médico Referente',
        type: 'text',
        placeholder: 'Dr(a). Apellido'
    }, {
        id: 'medico_especialidad',
        label: 'Espedialidad del Médico referente',
        type: 'select',
        options: ['Cardiología', 'Medicina Interna', 'Cirugía General', 'Medicina Familiar', 'Otra']
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
        "placeholder": "Ej: 85 ml"
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
        "placeholder": "Después de explicar al paciente los riesgos potenciales y los beneficios que obtendrá del estudio y siguiendo en todo momento los principios éticos respectivos y normados, se firma el consentimiento informado para realizar el estudio.",
        "rows": 3
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
        "type": "select",
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
    title: "Arterias Coronarias",
    type: "repeatableGroup",
    id: "arterias_coronarias",
    template: [{
        id: 'nombre',
        label: 'Vaso Sanguíneo',
        type: 'text',
        readonly: true
    }, {
        id: 'dominancia',
        label: 'Dominancia',
        type: 'select',
        options: ['No aplica', 'Dominante', 'No dominante', 'Codominante'],
        condition: (item) => ['Arteria Coronaria Derecha (CD)', 'Arteria Circunfleja (CX)'].includes(item.nombre)
    }, {
        id: 'descripcion_general',
        label: 'Descripción General',
        type: 'select',
        options: ['Normal, sin evidencia de placa', 'Presenta placa ateromatosa', 'Anomalía de origen/trayecto', 'Ocluida crónicamente']
    }, ],
    plaqueTemplate: [{
        id: 'tipo_placa',
        label: 'Tipo de Placa',
        type: 'select',
        options: ['No calcificada', 'Calcificada', 'Mixta (predominio no calcificado)', 'Mixta (predominio calcificado)']
    }, {
        id: 'localizacion',
        label: 'Localización',
        type: 'select',
        options: ['Ostial', 'Proximal', 'Medio', 'Distal', 'Bifurcación']
    }, {
        id: 'longitud',
        label: 'Longitud (mm)',
        type: 'number',
        placeholder: 'Ej: 10'
    }, {
        id: 'remodelado',
        label: 'Remodelado Vascular',
        type: 'select',
        options: ['No aplica', 'Positivo', 'Negativo', 'Ausente']
    }, {
        id: 'estenosis_severidad',
        label: 'Severidad de Estenosis',
        type: 'select',
        options: ['Sin estenosis (0%)', 'Mínima (1-24%)', 'Leve (25-49%)', 'Moderna (50-69%)', 'Severa (70-99%)', 'Oclusión total (100%)']
    }, {
        id: 'estenosis_porcentaje',
        label: '% Estenosis',
        type: 'number',
        placeholder: '0-100'
    }, {
        id: 'lipidico_porcentaje',
        label: '% lipidico',
        type: 'number',
        placeholder: '0-100'
    }, {
        id: 'calcico_porcentaje',
        label: '% calcico',
        type: 'number',
        placeholder: '0-100'
    }, {
        id: 'ulcerada_porcentaje',
        label: '% ulcerada',
        type: 'number',
        placeholder: '0-100'
    }],
    items: [{
        nombre: 'Tronco Coronario Izquierdo (TCI)',
        placas: []
    }, {
        nombre: 'Arteria Descendente Anterior (DA)',
        placas: []
    }, {
        nombre: 'Arteria Circunfleja (CX)',
        placas: []
    }, {
        nombre: 'Arteria Coronaria Derecha (CD)',
        placas: []
    }, {
        nombre: 'Ramo Intermedio',
        placas: []
    }, {
        nombre: 'Ramos Diagonales',
        placas: []
    }, {
        nombre: 'Ramos Marginales Obtusos',
        placas: []
    }, {
        nombre: 'Arteria Descendente Posterior (DP)',
        placas: []
    }, {
        nombre: 'Ramos Posterolaterales (PL)',
        placas: []
    }]
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

export const sampleCases = {
    case1: { // Caso Normal
        datos_paciente: {
            nombre: 'Juan Pérez',
            id_paciente: '1-1234-5678',
            edad: '55',
            genero: 'Masculino',
        },
        protocolo_estudio: {
            fecha_estudio: '2025-09-28',
            medico_referente: 'Dr. A. Nito'
        },
        informacion_clinica: {
            indicacion: 'Dolor torácico atípico',
            factores_riesgo: ['Dislipidemia']
        },
        score_calcio: {
            tci: '0',
            da: '0',
            cx: '0',
            cd: '0',
            total: '0',
            percentil: '<25'
        },
        arterias_coronarias: {
            items: reportStructure.find(s => s.id === 'arterias_coronarias').items.map(item => ({
                nombre: item.nombre,
                dominancia: (item.nombre.includes('CD')) ? 'Dominante' : 'No aplica',
                descripcion_general: 'Normal, sin evidencia de placa',
                placas: []
            }))
        },
    },
    case2: { // Caso Patológico
        datos_paciente: {
            nombre: 'Ana Rodríguez',
            id_paciente: '9-8765-4321',
            edad: '68',
            genero: 'Femenino',
        },
        protocolo_estudio: {
            fecha_estudio: '2025-09-27',
            medico_referente: 'Dra. I. Lomas'
        },
        informacion_clinica: {
            indicacion: 'Evaluación preoperatoria de cirugía no cardiaca',
            factores_riesgo: ['Hipertensión arterial', 'Diabetes mellitus', 'Tabaquismo']
        },
        score_calcio: {
            tci: '15',
            da: '350',
            cx: '120',
            cd: '250',
            total: '735',
            percentil: '>90'
        },
        arterias_coronarias: {
            items: [
                { nombre: 'Tronco Coronario Izquierdo (TCI)', descripcion_general: 'Presenta placa ateromatosa', placas: [{ tipo_placa: 'Calcificada', localizacion: 'Ostial', estenosis_severidad: 'Leve (25-49%)' }] },
                { nombre: 'Arteria Descendente Anterior (DA)', descripcion_general: 'Presenta placa ateromatosa', placas: [{ tipo_placa: 'Mixta (predominio calcificado)', localizacion: 'Proximal', estenosis_severidad: 'Severa (70-99%)', estenosis_porcentaje: '80' }] },
                { nombre: 'Arteria Circunfleja (CX)', dominancia: 'No dominante', descripcion_general: 'Presenta placa ateromatosa', placas: [{ tipo_placa: 'Calcificada', localizacion: 'Medio', estenosis_severidad: 'Moderna (50-69%)' }] },
                { nombre: 'Arteria Coronaria Derecha (CD)', dominancia: 'Dominante', descripcion_general: 'Presenta placa ateromatosa', placas: [{ tipo_placa: 'Calcificada', localizacion: 'Distal', estenosis_severidad: 'Leve (25-49%)' }] },
                 ...reportStructure.find(s => s.id === 'arterias_coronarias').items.slice(4).map(item => ({...item, descripcion_general: 'Normal, sin evidencia de placa', placas: [] }))
            ]
        },
         anatomia_cardiovascular: {
            ventriculo_izquierdo_fevi: "Levemente reducida (45-54%)"
         },
         valvula_aortica_diametros_aorta: {
            porcion_tubular_ascendente_observaciones: "DILATADO (>35 mm)",
            porcion_tubular_ascendente_diametro: "42"
         }
    }
};

