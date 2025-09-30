import { reportStructure } from './data.js';
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
    },
    case3: { // Caso Severo - Síndrome Coronario Agudo Inminente
        datos_paciente: {
            nombre: 'Carlos Mendoza',
            id_paciente: '8-4567-1234',
            edad: '72',
            genero: 'Masculino',
            peso: '94'
        },
        informacion_clinica: {
            indicacion: 'Dolor torácico anginoso en reposo de 2 horas de evolución, con irradiación a brazo izquierdo y diaforesis. ECG con supradesnivel del ST en cara anterior',
            factores_riesgo: ['Hipertensión arterial', 'Diabetes mellitus', 'Dislipidemia', 'Tabaquismo', 'Obesidad']
        },
        protocolo_estudio: {
            fecha_estudio: '2025-09-29',
            medico_referente: 'Dr. E. Mergencia',
            medico_especialidad: 'Cardiología',
            equipo: "Canon Aquilion ONE 320",
            tiempo_rotacion: "0.28/seg",
            adquisicion: "Retrospectivo",
            ecg_gating_detalles: "Taquicardia sinusal persistente con variabilidad respiratoria moderada",
            medio_contraste: "Ultravist 370",
            contraste_iv: "95 ml",
            velocidad_infusion: "6 ml/s",
            ritmo_estudio: "Taquicardia sinusal",
            calidad_imagen: "Diagnóstica"
        },
        motivo_generalidades: {
            descripcion_referencia: "Paciente con dolor torácico típico en reposo, marcadores de daño miocárdico elevados (Troponina I: 8.5 ng/mL), requiere evaluación urgente de arterias coronarias antes de posible intervención coronaria percutánea",
            consentimiento_informado: "Consentimiento informado de emergencia obtenido por riesgo vital inminente. Se explicaron riesgos de contraste y radiación versus beneficio diagnóstico crucial.",
            tolerancia_estudio: "Reacciones moderadas (vómitos, broncoespasmo)",
            fc_durante_estudio: "105-120 lpm",
            medicamentos_usados: ["Nitroglicerina sublingual"],
            analisis_imagenes: "Vitrea"
        },
        anatomia_cardiovascular: {
            venas_cavas: ["Ambas no dilatadas drenando en la aurícula derecha"],
            auricula_derecha: "No dilatada",
            septum_interauricular: "No se visualizan defectos",
            seno_coronario: "Drenando a la AD en forma habitual sin dilatación o anomalías",
            valvula_tricuspide: "No se visualizan defectos por este método",
            ventriculo_derecho: "No dilatado ni hipertrófico",
            arteria_pulmonar: "Diámetro Normal",
            venas_pulmonares: ["Cuatro drenando a la aurícula izquierda, dos derechas y dos izquierdas"],
            auricula_izquierda: "Dilatada",
            ventriculo_izquierdo_size: "Dilatado",
            ventriculo_izquierdo_hipertrofia: "Concéntrica moderada",
            ventriculo_izquierdo_motilidad: "Acinesia",
            ventriculo_izquierdo_fevi: "Severamente reducida (<30%)",
            hallazgos_extracardiacos: "Derrame pleural bilateral mínimo"
        },
        valvula_aortica_diametros_aorta: {
            cuspidies: "3 cúspides de conformación Normal",
            calcificaciones: "Moderada (400-1300 AU en mujeres, 1000-2000 AU en hombres)",
            morfologia_anillo: "Elíptica",
            diametro_menor_anillo: "24",
            diametro_mayor_anillo: "28",
            senos_valsalva_diametro: "38",
            senos_valsalva_indexado: "19",
            senos_valsalva_referencia: "16±2 (15-18)",
            senos_valsalva_aneurismatico: "24",
            senos_valsalva_observaciones: "DILATADO",
            union_sinotubular_diametro: "35",
            union_sinotubular_indexado: "17",
            union_sinotubular_referencia: "14±2 (13-15)",
            union_sinotubular_aneurismatico: "21",
            union_sinotubular_observaciones: "DILATADO",
            porcion_tubular_ascendente_diametro: "42",
            porcion_tubular_ascendente_indexado: "21",
            porcion_tubular_ascendente_referencia: "14±2 (13-17)",
            porcion_tubular_ascendente_aneurismatico: "24",
            porcion_tubular_ascendente_observaciones: "DILATADO (>35 mm)"
        },
        score_calcio: {
            tci: '45',
            da: '1250',
            cx: '480',
            cd: '890',
            total: '2665',
            percentil: '>90'
        },
        arterias_coronarias: {
            items: [
                { 
                    nombre: 'Tronco Coronario Izquierdo (TCI)', 
                    descripcion_general: 'Presenta placa ateromatosa', 
                    placas: [{ 
                        tipo_placa: 'Mixta (predominio no calcificado)', 
                        localizacion: 'Ostial', 
                        longitud: 15,
                        remodelado: 'Positivo',
                        estenosis_severidad: 'Moderna (50-69%)',
                        estenosis_porcentaje: '65',
                        lipidico_porcentaje: '70',
                        calcico_porcentaje: '20',
                        ulcerada_porcentaje: '10'
                    }] 
                },
                { 
                    nombre: 'Arteria Descendente Anterior (DA)', 
                    descripcion_general: 'Presenta placa ateromatosa', 
                    placas: [{ 
                        tipo_placa: 'Mixta (predominio no calcificado)', 
                        localizacion: 'Proximal', 
                        longitud: 25,
                        remodelado: 'Positivo',
                        estenosis_severidad: 'Oclusión total (100%)',
                        estenosis_porcentaje: '100',
                        lipidico_porcentaje: '85',
                        calcico_porcentaje: '10',
                        ulcerada_porcentaje: '25'
                    }] 
                },
                { 
                    nombre: 'Arteria Circunfleja (CX)', 
                    dominancia: 'Codominante',
                    descripcion_general: 'Presenta placa ateromatosa', 
                    placas: [{ 
                        tipo_placa: 'Mixta (predominio calcificado)', 
                        localizacion: 'Medio', 
                        longitud: 18,
                        remodelado: 'Negativo',
                        estenosis_severidad: 'Severa (70-99%)',
                        estenosis_porcentaje: '85',
                        lipidico_porcentaje: '40',
                        calcico_porcentaje: '45',
                        ulcerada_porcentaje: '5'
                    }] 
                },
                { 
                    nombre: 'Arteria Coronaria Derecha (CD)', 
                    dominancia: 'Codominante',
                    descripcion_general: 'Presenta placa ateromatosa', 
                    placas: [{ 
                        tipo_placa: 'Calcificada', 
                        localizacion: 'Distal', 
                        longitud: 12,
                        remodelado: 'Ausente',
                        estenosis_severidad: 'Severa (70-99%)',
                        estenosis_porcentaje: '75',
                        lipidico_porcentaje: '20',
                        calcico_porcentaje: '70',
                        ulcerada_porcentaje: '0'
                    }] 
                },
                { 
                    nombre: 'Ramo Intermedio', 
                    descripcion_general: 'Presenta placa ateromatosa', 
                    placas: [{ 
                        tipo_placa: 'No calcificada', 
                        localizacion: 'Proximal', 
                        longitud: 8,
                        remodelado: 'Positivo',
                        estenosis_severidad: 'Moderna (50-69%)',
                        estenosis_porcentaje: '60',
                        lipidico_porcentaje: '90',
                        calcico_porcentaje: '5',
                        ulcerada_porcentaje: '15'
                    }] 
                },
                ...reportStructure.find(s => s.id === 'arterias_coronarias').items.slice(5).map(item => ({
                    ...item, 
                    descripcion_general: 'Normal, sin evidencia de placa', 
                    placas: [] 
                }))
            ]
        },
        cad_rads: {
            score: 'CAD-RADS 5',
            modifiers: ['V (Placa Vulnerable)'],
            description: 'Enfermedad coronaria multivaso severa con oclusión total de la DA proximal y estenosis críticas en TCI, CX y CD. Múltiples placas vulnerables con alto contenido lipídico y ulceraciones. Hallazgos compatibles con síndrome coronario agudo.'
        },
        evaluacion_extracardiaca: {
            hallazgos: ['Aneurisma/dilatación de aorta torácica', 'Derrame pleural']
        },
        comentarios_adicionales: {
            texto: 'Paciente de alto riesgo con enfermedad coronaria extensa y severa. Se recomienda cateterismo cardíaco urgente y evaluación por cirugía cardíaca. Función ventricular severamente deprimida. Aorta ascendente dilatada que requiere seguimiento.'
        },
        conclusion: {
            texto_conclusion: 'ENFERMEDAD CORONARIA MULTIVASO SEVERA CON OCUSIÓN TOTAL DE LA ARTERIA DESCENDENTE ANTERIOR PROXIMAL Y ESTENOSIS CRÍTICAS EN TRONCO CORONARIO IZQUIERDO (65%), CIRCUNFLEJA (85%) Y CORONARIA DERECHA (75%). FUNCIÓN VENTRICULAR IZQUIERDA SEVERAMENTE DEPRIMIDA (FEVI <30%) CON ACINESIA ANTERIOR. DILATACIÓN MODERADA DE AORTA ASCENDENTE (42 mm). HALLAZGOS COMPATIBLES CON SÍNDROME CORONARIO AGUDO EN EVOLUCIÓN. SE RECOMIENDA INTERVENCIÓN CORONARIA PERCUTÁNEA URGENTE Y EVALUACIÓN CARDIOLÓGICA INMEDIATA.'
        }
    },

    case4: { // Caso Severo - Enfermedad de Tres Vasos con Disfunción Ventricular
        datos_paciente: {
            nombre: 'María Elena Soto',
            id_paciente: '2-9876-5432',
            edad: '65',
            genero: 'Femenino',
            peso: '78'
        },
        informacion_clinica: {
            indicacion: 'Paciente con insuficiencia cardíaca clase NYHA III, disnea de esfuerzo progresiva, edemas en miembros inferiores. Evaluación de enfermedad coronaria como causa de disfunción ventricular.',
            factores_riesgo: ['Hipertensión arterial', 'Diabetes mellitus', 'Dislipidemia', 'Obesidad', 'Sedentarismo']
        },
        protocolo_estudio: {
            fecha_estudio: '2025-09-25',
            medico_referente: 'Dra. C. Rdiaca',
            medico_especialidad: 'Cardiología',
            equipo: "Siemens Somatom",
            tiempo_rotacion: "0.35/seg",
            adquisicion: "Retrospectivo",
            ecg_gating_detalles: "Fibrilación auricular con respuesta ventricular rápida",
            medio_contraste: "Omnipaque 350",
            contraste_iv: "80 ml",
            velocidad_infusion: "5 ml/s",
            ritmo_estudio: "Fibrilación auricular",
            calidad_imagen: "Buena"
        },
        motivo_generalidades: {
            descripcion_referencia: "Paciente con insuficiencia cardíaca descompensada, fracción de eyección reducida en ecocardiograma transtorácico (30-35%). Evaluar viabilidad miocárdica y enfermedad coronaria extensa.",
            consentimiento_informado: "Consentimiento informado obtenido tras explicar riesgos y beneficios. Paciente consciente de necesidad de posible revascularización quirúrgica.",
            tolerancia_estudio: "Buena tolerancia, sin reacciones adversas al medio contraste",
            fc_durante_estudio: "90-110 lpm (fibrilación auricular)",
            medicamentos_usados: [],
            analisis_imagenes: "Syngo.via"
        },
        anatomia_cardiovascular: {
            venas_cavas: ["Dilatada superior o inferior"],
            auricula_derecha: "Dilatada",
            septum_interauricular: "Aneurisma septal",
            seno_coronario: "Dilatado",
            valvula_tricuspide: "Regurgitación funcional",
            ventriculo_derecho: "Dilatado",
            arteria_pulmonar: "Dilatada (>34 mm)",
            venas_pulmonares: ["Cuatro drenando a la aurícula izquierda, dos derechas y dos izquierdas"],
            auricula_izquierda: "Dilatada",
            ventriculo_izquierdo_size: "Dilatado",
            ventriculo_izquierdo_hipertrofia: "Excéntrica",
            ventriculo_izquierdo_motilidad: "Hipocinesia global",
            ventriculo_izquierdo_fevi: "Severamente reducida (<30%)",
            hallazgos_extracardiacos: ["Derrame pericárdico", "Derrame pleural", "Linfadenopatías mediastinales"]
        },
        valvula_aortica_diametros_aorta: {
            cuspidies: "2 cúspides (bicúspide R-L)",
            calcificaciones: "Severa (>1300 AU en mujeres, >2000 AU en hombres)",
            morfologia_anillo: "Circular",
            diametro_menor_anillo: "26",
            diametro_mayor_anillo: "28",
            senos_valsalva_diametro: "45",
            senos_valsalva_indexado: "24",
            senos_valsalva_referencia: "16±2 (15-18)",
            senos_valsalva_aneurismatico: "24",
            senos_valsalva_observaciones: "ANEURISMÁTICO",
            union_sinotubular_diametro: "42",
            union_sinotubular_indexado: "22",
            union_sinotubular_referencia: "14±2 (13-15)",
            union_sinotubular_aneurismatico: "21",
            union_sinotubular_observaciones: "ANEURISMÁTICO",
            porcion_tubular_ascendente_diametro: "48",
            porcion_tubular_ascendente_indexado: "25",
            porcion_tubular_ascendente_referencia: "14±2 (13-17)",
            porcion_tubular_ascendente_aneurismatico: "24",
            porcion_tubular_ascendente_observaciones: "ANEURISMÁTICO (>45 mm)"
        },
        score_calcio: {
            tci: '320',
            da: '1850',
            cx: '920',
            cd: '1100',
            total: '4190',
            percentil: '>90'
        },
        arterias_coronarias: {
            items: [
                { 
                    nombre: 'Tronco Coronario Izquierdo (TCI)', 
                    descripcion_general: 'Presenta placa ateromatosa', 
                    placas: [{ 
                        tipo_placa: 'Calcificada', 
                        localizacion: 'Ostial', 
                        longitud: 12,
                        remodelado: 'Negativo',
                        estenosis_severidad: 'Severa (70-99%)',
                        estenosis_porcentaje: '80',
                        lipidico_porcentaje: '15',
                        calcico_porcentaje: '80',
                        ulcerada_porcentaje: '2'
                    }] 
                },
                { 
                    nombre: 'Arteria Descendente Anterior (DA)', 
                    descripcion_general: 'Presenta placa ateromatosa', 
                    placas: [{ 
                        tipo_placa: 'Calcificada', 
                        localizacion: 'Proximal', 
                        longitud: 35,
                        remodelado: 'Negativo',
                        estenosis_severidad: 'Severa (70-99%)',
                        estenosis_porcentaje: '90',
                        lipidico_porcentaje: '10',
                        calcico_porcentaje: '85',
                        ulcerada_porcentaje: '1'
                    }] 
                },
                { 
                    nombre: 'Arteria Circunfleja (CX)', 
                    dominancia: 'No dominante',
                    descripcion_general: 'Presenta placa ateromatosa', 
                    placas: [{ 
                        tipo_placa: 'Calcificada', 
                        localizacion: 'Medio', 
                        longitud: 28,
                        remodelado: 'Negativo',
                        estenosis_severidad: 'Severa (70-99%)',
                        estenosis_porcentaje: '85',
                        lipidico_porcentaje: '8',
                        calcico_porcentaje: '90',
                        ulcerada_porcentaje: '0'
                    }] 
                },
                { 
                    nombre: 'Arteria Coronaria Derecha (CD)', 
                    dominancia: 'Dominante',
                    descripcion_general: 'Presenta placa ateromatosa', 
                    placas: [{ 
                        tipo_placa: 'Calcificada', 
                        localizacion: 'Proximal', 
                        longitud: 22,
                        remodelado: 'Negativo',
                        estenosis_severidad: 'Severa (70-99%)',
                        estenosis_porcentaje: '75',
                        lipidico_porcentaje: '12',
                        calcico_porcentaje: '83',
                        ulcerada_porcentaje: '3'
                    }] 
                },
                { 
                    nombre: 'Ramos Diagonales', 
                    descripcion_general: 'Presenta placa ateromatosa', 
                    placas: [{ 
                        tipo_placa: 'Calcificada', 
                        localizacion: 'Ostial', 
                        longitud: 15,
                        remodelado: 'Negativo',
                        estenosis_severidad: 'Oclusión total (100%)',
                        estenosis_porcentaje: '100',
                        lipidico_porcentaje: '5',
                        calcico_porcentaje: '92',
                        ulcerada_porcentaje: '0'
                    }] 
                },
                ...reportStructure.find(s => s.id === 'arterias_coronarias').items.slice(5).map(item => ({
                    ...item, 
                    descripcion_general: 'Presenta placa ateromatosa', 
                    placas: [{
                        tipo_placa: 'Calcificada',
                        localizacion: 'Medio',
                        estenosis_severidad: 'Moderna (50-69%)',
                        estenosis_porcentaje: '60'
                    }] 
                }))
            ]
        },
        cad_rads: {
            score: 'CAD-RADS 4B',
            modifiers: ['G (Bypass)'],
            description: 'Enfermedad coronaria de tres vasos severamente calcificada con estenosis críticas en todos los territorios. TCI con estenosis del 80%, DA 90%, CX 85%, CD 75%. Oclusión total de ramos diagonales. Enfermedad difusa y calcificada que sugiere necesidad de cirugía de revascularización miocárdica.'
        },
        evaluacion_extracardiaca: {
            hallazgos: ['Aneurisma/dilatación de aorta torácica', 'Derrame pericárdico', 'Derrame pleural', 'Linfadenopatías mediastinales']
        },
        comentarios_adicionales: {
            texto: 'Paciente con cardiomiopatía isquémica avanzada. Enfermedad coronaria difusamente calcificada que limita opciones de intervención percutánea. Válvula aórtica bicúspide con estenosis aórtica severa por calcificación. Aneurisma de aorta ascendente que requiere corrección quirúrgica combinada.'
        },
        conclusion: {
            texto_conclusion: 'ENFERMEDAD CORONARIA DE TRES VASOS SEVERAMENTE CALCIFICADA CON ESTENOSIS CRÍTICAS MULTIPLES (TCI 80%, DA 90%, CX 85%, CD 75%). FUNCIÓN VENTRICULAR IZQUIERDA SEVERAMENTE DEPRIMIDA (FEVI <30%) CON HIPOCINESIA GLOBAL. VÁLVULA AÓRTICA BICÚSPIDE CON ESTENOSIS AÓRTICA SEVERA CALCIFICADA. ANEURISMA DE AORTA ASCENDENTE (48 mm). CARDIOMIOPATÍA ISQUÉMICA AVANZADA. SE RECOMIENDA EVALUACIÓN PARA CIRUGÍA DE REVASCULARIZACIÓN MIOCÁRDICA Y REEMPLAZO VALVULAR AÓRTICO CON REPARACIÓN DE AORTA ASCENDENTE.'
        }
    },

    case5: { // Caso Crítico - Emergencia Compleja con Múltiples Complicaciones
        datos_paciente: {
            nombre: 'Roberto Jiménez',
            id_paciente: '5-4321-6789',
            edad: '58',
            genero: 'Masculino',
            peso: '102'
        },
        informacion_clinica: {
            indicacion: 'Paciente con dolor torácico severo, hipotensión y shock cardiogénico. Sospecha de disección aórtica complicada con compromiso coronario. Evaluación prequirúrgica urgente.',
            factores_riesgo: ['Hipertensión arterial', 'Diabetes mellitus', 'Dislipidemia', 'Tabaquismo', 'Obesidad', 'Historia familiar de enfermedad coronaria']
        },
        protocolo_estudio: {
            fecha_estudio: '2025-09-30',
            medico_referente: 'Dr. U. Rgente',
            medico_especialidad: 'Cirugía General',
            equipo: "GE Revolution",
            tiempo_rotacion: "0.28/seg",
            adquisicion: "Retrospectivo",
            ecg_gating_detalles: "Extrema inestabilidad hemodinámica con artefactos por movimiento",
            medio_contraste: "Visipaque 320",
            contraste_iv: "100 ml",
            velocidad_infusion: "6 ml/s",
            ritmo_estudio: "Taquicardia sinusal",
            calidad_imagen: "Limitada por artefactos"
        },
        motivo_generalidades: {
            descripcion_referencia: "Paciente en shock cardiogénico con sospecha de síndrome aórtico agudo. Requiere evaluación urgente de aorta, arterias coronarias y función ventricular para decisión quirúrgica inmediata.",
            consentimiento_informado: "Consentimiento de emergencia por riesgo vital. Familia informada de alta probabilidad de mortalidad perioperatoria.",
            tolerancia_estudio: "Reacciones severas (anafilaxia)",
            fc_durante_estudio: "130-145 lpm",
            medicamentos_usados: ["Nitroglicerina sublingual", "Beta-bloqueadores"],
            analisis_imagenes: "IntelliSpace Portal"
        },
        anatomia_cardiovascular: {
            venas_cavas: ["Thrombus", "Stenosis o compresión"],
            auricula_derecha: "Thrombus",
            septum_interauricular: "Defecto septal atrial",
            seno_coronario: "Obstrucción o compresión",
            valvula_tricuspide: "Regurgitación funcional",
            ventriculo_derecho: "Disfunción o hipocinesia",
            arteria_pulmonar: "Tromboembolismo",
            venas_pulmonares: ["Estenosis u oclusión"],
            auricula_izquierda: "Thrombus en orejuela",
            ventriculo_izquierdo_size: "Dilatado",
            ventriculo_izquierdo_hipertrofia: "Asimétrica",
            ventriculo_izquierdo_motilidad: "Acinesia",
            ventriculo_izquierdo_fevi: "Severamente reducida (<30%)",
            hallazgos_extracardiacos: ["Aneurisma/dilatación de aorta torácica", "Embolismo pulmonar", "Derrame pericárdico", "Derrame pleural", "Linfadenopatías mediastinales"]
        },
        valvula_aortica_diametros_aorta: {
            cuspidies: "3 cúspides con fusión parcial",
            calcificaciones: "Pesada (sugiere estenosis severa)",
            morfologia_anillo: "Irregular",
            diametro_menor_anillo: "29",
            diametro_mayor_anillo: "32",
            senos_valsalva_diametro: "62",
            senos_valsalva_indexado: "28",
            senos_valsalva_referencia: "16±2 (15-18)",
            senos_valsalva_aneurismatico: "24",
            senos_valsalva_observaciones: "ANEURISMÁTICO",
            union_sinotubular_diametro: "55",
            union_sinotubular_indexado: "25",
            union_sinotubular_referencia: "14±2 (13-15)",
            union_sinotubular_aneurismatico: "21",
            union_sinotubular_observaciones: "ANEURISMÁTICO",
            porcion_tubular_ascendente_diametro: "68",
            porcion_tubular_ascendente_indexado: "31",
            porcion_tubular_ascendente_referencia: "14±2 (13-17)",
            porcion_tubular_ascendente_aneurismatico: "24",
            porcion_tubular_ascendente_observaciones: "DISSECCIÓN POSIBLE"
        },
        score_calcio: {
            tci: '180',
            da: '2100',
            cx: '750',
            cd: '1450',
            total: '4480',
            percentil: '>90'
        },
        arterias_coronarias: {
            items: [
                { 
                    nombre: 'Tronco Coronario Izquierdo (TCI)', 
                    descripcion_general: 'Ocluida crónicamente', 
                    placas: [{ 
                        tipo_placa: 'Mixta (predominio calcificado)', 
                        localizacion: 'Ostial', 
                        longitud: 8,
                        remodelado: 'Negativo',
                        estenosis_severidad: 'Oclusión total (100%)',
                        estenosis_porcentaje: '100',
                        lipidico_porcentaje: '25',
                        calcico_porcentaje: '70',
                        ulcerada_porcentaje: '15'
                    }] 
                },
                { 
                    nombre: 'Arteria Descendente Anterior (DA)', 
                    descripcion_general: 'Ocluida crónicamente', 
                    placas: [{ 
                        tipo_placa: 'Calcificada', 
                        localizacion: 'Proximal', 
                        longitud: 42,
                        remodelado: 'Negativo',
                        estenosis_severidad: 'Oclusión total (100%)',
                        estenosis_porcentaje: '100',
                        lipidico_porcentaje: '15',
                        calcico_porcentaje: '80',
                        ulcerada_porcentaje: '8'
                    }] 
                },
                { 
                    nombre: 'Arteria Circunfleja (CX)', 
                    dominancia: 'Dominante',
                    descripcion_general: 'Presenta placa ateromatosa', 
                    placas: [{ 
                        tipo_placa: 'Mixta (predominio no calcificado)', 
                        localizacion: 'Ostial', 
                        longitud: 5,
                        remodelado: 'Positivo',
                        estenosis_severidad: 'Severa (70-99%)',
                        estenosis_porcentaje: '95',
                        lipidico_porcentaje: '75',
                        calcico_porcentaje: '20',
                        ulcerada_porcentaje: '30'
                    }] 
                },
                { 
                    nombre: 'Arteria Coronaria Derecha (CD)', 
                    dominancia: 'No dominante',
                    descripcion_general: 'Anomalía de origen/trayecto', 
                    placas: [{ 
                        tipo_placa: 'No calcificada', 
                        localizacion: 'Proximal', 
                        longitud: 18,
                        remodelado: 'Positivo',
                        estenosis_severidad: 'Severa (70-99%)',
                        estenosis_porcentaje: '90',
                        lipidico_porcentaje: '85',
                        calcico_porcentaje: '10',
                        ulcerada_porcentaje: '40'
                    }] 
                },
                { 
                    nombre: 'Ramo Intermedio', 
                    descripcion_general: 'Ocluida crónicamente', 
                    placas: [{ 
                        tipo_placa: 'Calcificada', 
                        localizacion: 'Ostial', 
                        longitud: 12,
                        remodelado: 'Negativo',
                        estenosis_severidad: 'Oclusión total (100%)',
                        estenosis_porcentaje: '100',
                        lipidico_porcentaje: '8',
                        calcico_porcentaje: '88',
                        ulcerada_porcentaje: '2'
                    }] 
                },
                ...reportStructure.find(s => s.id === 'arterias_coronarias').items.slice(5).map(item => ({
                    ...item, 
                    descripcion_general: 'Ocluida crónicamente', 
                    placas: [{
                        tipo_placa: 'Calcificada',
                        localizacion: 'Proximal',
                        estenosis_severidad: 'Oclusión total (100%)',
                        estenosis_porcentaje: '100'
                    }] 
                }))
            ]
        },
        cad_rads: {
            score: 'CAD-RADS 5',
            modifiers: ['V (Placa Vulnerable)', 'G (Bypass)'],
            description: 'Enfermedad coronaria terminal con oclusiones múltiples y estenosis críticas en vasos remanentes. TCI y DA ocluidos crónicamente. CX 95% y CD 90% con placas vulnerables de alto riesgo. Disección aórtica tipo A confirmada con compromiso de ostium coronario.'
        },
        evaluacion_extracardiaca: {
            hallazgos: ['Aneurisma/dilatación de aorta torácica', 'Embolismo pulmonar', 'Derrame pericárdico', 'Derrame pleural', 'Linfadenopatías mediastinales']
        },
        comentarios_adicionales: {
            texto: 'Paciente en shock cardiogénico por disección aórtica tipo A complicada con compromiso coronario severo. Trombos intracardiacos múltiples. Embolismo pulmonar asociado. Pronóstico extremadamente reservado. Requiere cirugía de Bentall o procedimiento de David con revascularización miocárdica compleja.'
        },
        conclusion: {
            texto_conclusion: 'SÍNDROME AÓRTICO AGUDO CON DISECCIÓN AÓRTICA TIPO A Y COMPROMISO CORONARIO SEVERO. ENFERMEDAD CORONARIA TERMINAL CON OCLUSIONES MÚLTIPLES (TCI 100%, DA 100%) Y ESTENOSIS CRÍTICAS EN VASOS REMANENTES (CX 95%, CD 90%). ANEURISMA GIGANTE DE AORTA ASCENDENTE (68 mm) CON DISECCIÓN. SHOCK CARDIOGÉNICO ESTABLECIDO CON FEVI <30%. TROMBOS INTRACARDÍACOS MÚLTIPLES Y EMBOLISMO PULMONAR. EMERGENCIA QUIRÚRGICA DE MÁXIMA URGENCIA CON PRONÓSTICO EXTREMADAMENTE RESERVADO.'
        }
    }

};
