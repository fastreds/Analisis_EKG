export const sampleCases = {
    case1: { // Caso Normal
        datos_paciente: {
            nombre: 'Juan Pérez',
            id_paciente: '1-1234-5678',
            edad: '55',
            genero: 'Masculino',
            peso: '75',
            talla: '170'
        },
        protocolo_estudio: {
            fecha_estudio: '2025-09-28',
            medico_referente: 'Dra. Alana Nito',
            medico_especialidad: 'Cardiología',
            equipo: "Canon Aquilion 160 cortes",
            tiempo_rotacion: "0.35/seg",
            adquisicion: "Prospectivo",
            ecg_gating_detalles: "Ritmo sinusal estable",
            medio_contraste: "Ultravist 370",
            contraste_iv: "70 ml",
            velocidad_infusion: "5 ml/s",
            ritmo_estudio: "Ritmo sinusal normal",
            calidad_imagen: "Excelente"
        },
        informacion_clinica: {
            indicacion: 'Dolor torácico atípico',
            factores_riesgo: ['Dislipidemia']
        },
        motivo_generalidades: {
            descripcion_referencia: "Evaluación de riesgo cardiovascular en paciente con dolor torácico no característico.",
            consentimiento_informado: "Consentimiento informado obtenido.",
            tolerancia_estudio: "Buena tolerancia, sin reacciones adversas al medio contraste",
            fc_durante_estudio: "60 lpm",
            medicamentos_usados: [],
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
            venas_pulmonares: "Cuatro drenando a la aurícula izquierda, dos derechas y dos izquierdas",
            auricula_izquierda: "No se observan trombos en la orejuela izquierda, ni masas o lesiones intracardiacas",
            ventriculo_izquierdo_size: "No dilatado",
            ventriculo_izquierdo_hipertrofia: "Ninguna",
            ventriculo_izquierdo_motilidad: "Global y regional conservada",
            ventriculo_izquierdo_fevi: "Normal (>55%)",
            hallazgos_extracardiacos: "Ninguno"
        },
        valvula_aortica_diametros_aorta: {
            cuspidies: "3 cúspides de conformación Normal",
            calcificaciones: "NO PRESENTA",
            morfologia_anillo: "Elíptica",
            diametro_menor_anillo: "22",
            diametro_mayor_anillo: "25",
            senos_valsalva_diametro: "32",
            senos_valsalva_observaciones: "NORMAL",
            union_sinotubular_diametro: "28",
            union_sinotubular_observaciones: "NORMAL",
            porcion_tubular_ascendente_diametro: "34",
            porcion_tubular_ascendente_observaciones: "NORMAL"
        },
        score_calcio: {
            tci: '0',
            da: '0',
            cx: '0',
            cd: '0',
            total: '0',
            percentil: '<25'
        },
        anatomia_general: {
            origen_arterias: 'Normal',
            dominancia: 'Dominancia Derecha',
            ramificacion_tci: 'Bifurcación (en ADA y ACx)',
            terminacion_ada: 'Tipo 2 (Llega hasta el ápex)'
        },
        evaluacion_segmento: {
            segments: {} // Todos los segmentos usarán su valor por defecto "Sin hallazgos"
        },
        bypass: {
            antecedentes_bypass: 'No'
        },
        cad_rads: {
            score: 'CAD-RADS 0',
            modifiers: [],
            description: 'Ausencia de placa aterosclerótica coronaria.'
        },
        evaluacion_extracardiaca: {
            hallazgos: ['Sin hallazgos patológicos significativos']
        },
        comentarios_adicionales: {
            texto: 'Estudio normal, sin evidencia de enfermedad coronaria.'
        },
        conclusion: {
            texto_conclusion: 'Estudio de angiotomografía coronaria sin evidencia de enfermedad aterosclerótica. Score de calcio de 0. Anatomía coronaria sin variantes anómalas.'
        }
    },
    case2: { // Caso Patológico
        datos_paciente: {
            nombre: 'Ana Rodríguez',
            id_paciente: '9-8765-4321',
            edad: '68',
            genero: 'Femenino',
            peso: '82',
            talla: '160'
        },
        protocolo_estudio: {
            fecha_estudio: '2025-09-27',
            medico_referente: 'Dra. I. Lomas',
            medico_especialidad: 'Medicina Interna',
            equipo: "Siemens Somatom",
            tiempo_rotacion: "0.5/seg",
            adquisicion: "Retrospectivo",
            ecg_gating_detalles: "Frecuencia cardíaca variable",
            medio_contraste: "Omnipaque 350",
            contraste_iv: "80 ml",
            velocidad_infusion: "4 ml/s",
            ritmo_estudio: "Ritmo sinusal normal",
            calidad_imagen: "Buena"
        },
        informacion_clinica: {
            indicacion: 'Evaluación preoperatoria de cirugía no cardiaca',
            factores_riesgo: ['Hipertensión arterial', 'Diabetes mellitus', 'Tabaquismo']
        },
        motivo_generalidades: {
            descripcion_referencia: "Paciente programada para reemplazo de cadera, con múltiples factores de riesgo cardiovascular.",
            consentimiento_informado: "Consentimiento informado obtenido.",
            tolerancia_estudio: "Buena tolerancia, sin reacciones adversas al medio contraste",
            fc_durante_estudio: "75 lpm",
            medicamentos_usados: ["Beta-bloqueadores"],
            analisis_imagenes: "Syngo.via"
        },
        score_calcio: {
            tci: '15',
            da: '350',
            cx: '120',
            cd: '250',
            total: '735',
            percentil: '>90'
        },
        anatomia_general: {
            origen_arterias: 'Normal',
            dominancia: 'Dominancia Derecha',
            ramificacion_tci: 'Bifurcación (en ADA y ACx)',
            terminacion_ada: 'Tipo 3 ("Wraparound")'
        },
        evaluacion_segmento: {
            segments: {
                '6': { // pADA
                    estado_general: 'Con hallazgos patológicos',
                    findings: {
                        placas: [{ composicion: 'No calcificada (blanda)', estenosis: 'Moderada (50-69%)', has_hrp: ['Remodelado Positivo'], comentario_placa: 'Placa blanda en ADA proximal.' }],
                    }
                },
                '1': { // pACD
                    estado_general: 'Con hallazgos patológicos',
                    findings: {
                        stents: [{ evaluacion: 'Permeable, sin reestenosis significativa', comentario_stent: 'Stent permeable en CD proximal.' }]
                    }
                },
                '7': { // mADA
                    estado_general: 'Con hallazgos patológicos',
                    findings: {
                        has_puente: true,
                        puente_details: {
                            profundidad: 'Superficial',
                            compresion: 'Leve <50%'
                        }
                    }
                },
                '11': { // pACx
                    estado_general: 'Con hallazgos patológicos',
                    findings: {
                        has_aneurisma: true,
                        aneurisma_details: {
                            diametro: '6'
                        }
                    }
                }
            }
        },
        bypass: {
            antecedentes_bypass: 'No'
        },
        anatomia_cardiovascular: {
            ventriculo_izquierdo_fevi: "Levemente reducida (45-54%)"
        },
        valvula_aortica_diametros_aorta: {
            porcion_tubular_ascendente_observaciones: "DILATADO (>35 mm)",
            porcion_tubular_ascendente_diametro: "42"
        },
        cad_rads: {
            score: 'CAD-RADS 3',
            modifiers: ['S (Stent)', 'V (Placa Vulnerable)'],
            description: 'Enfermedad coronaria moderada en ADA proximal. Stent permeable en CD. Puente miocárdico en ADA media.'
        },
        evaluacion_extracardiaca: {
            hallazgos: ['Hernia hiatal']
        },
        comentarios_adicionales: {
            texto: 'Se recomienda optimizar tratamiento médico antes de la cirugía de cadera.'
        },
        conclusion: {
            texto_conclusion: 'Enfermedad coronaria no obstructiva significativa con placa moderada en ADA proximal. Stent en CD proximal permeable. FEVI levemente deprimida.'
        }
    },
    case3: { // Caso Complejo y Severo
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
        anatomia_general: {
            dominancia: 'Codominancia',
            ramificacion_tci: 'Trifurcación (presencia de Ramo Intermedio)',
            terminacion_ada: 'Tipo 3 ("Wraparound")'
        },
        evaluacion_segmento: {
            segments: {
                '5': { // TCI
                    estado_general: 'Con hallazgos patológicos',
                    findings: {
                        placas: [{ composicion: 'Parcialmente calcificada (mixta)', estenosis: 'Severa (70-99%)', has_hrp: ['Remodelado Positivo', 'Placa de Baja Atenuación'] }]
                    }
                },
                '6': { // pADA
                    estado_general: 'Con hallazgos patológicos',
                    findings: {
                        placas: [{ composicion: 'No calcificada (blanda)', estenosis: 'Oclusión total (100%)' }]
                    }
                },
                '11': { // pACx
                    estado_general: 'Con hallazgos patológicos',
                    findings: {
                        stents: [{ evaluacion: 'Con reestenosis intra-stent', reestenosis_details: { grado: 'Moderada 50-69%', tipo: 'Focal' } }],
                        has_aneurisma: true,
                        aneurisma_details: {
                            diametro: '8'
                        }
                    }
                }
            }
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
        anatomia_general: {
            dominancia: 'Dominancia Derecha',
            ramificacion_tci: 'Bifurcación (en ADA y ACx)',
            terminacion_ada: 'Tipo 2 (Llega hasta el ápex)'
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
        anatomia_general: {
            dominancia: 'Dominancia Izquierda',
            ramificacion_tci: 'Bifurcación (en ADA y ACx)',
            terminacion_ada: 'Tipo 1 (Termina antes de llegar al ápex)'
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