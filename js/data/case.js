export const sampleCases = {
    caso_normal: {
        datos_paciente: {
            nombre: 'Juan Pérez',
            id_paciente: '1-1234-5678',
            edad: 55,
            genero: 'Masculino',
            peso: 75,
            talla: 170
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
            contraste_iv: 70,
            velocidad_infusion: 5,
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
            fc_durante_estudio: 60,
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
            diametro_menor_anillo: 22,
            diametro_mayor_anillo: 25,
            senos_valsalva_diametro: 32,
            senos_valsalva_observaciones: "NORMAL",
            union_sinotubular_diametro: 28,
            union_sinotubular_observaciones: "NORMAL",
            porcion_tubular_ascendente_diametro: 34,
            porcion_tubular_ascendente_observaciones: "NORMAL"
        },
        score_calcio: {
            tci: 0,
            da: 0,
            cx: 0,
            cd: 0,
            total: 0,
            percentil: '<25'
        },
        anatomia_general: {
            origen_arterias: 'Normal',
            dominancia: 'Dominancia Derecha',
            ramificacion_tci: 'Bifurcación (en ADA y ACx)',
            terminacion_ada: 'Tipo 2 (Llega hasta el ápex)'
        },
        evaluacion_segmento: {
            segments: {}
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
        }
    },
    caso_patologico_moderado: {
        datos_paciente: {
            nombre: 'Ana Rodríguez',
            id_paciente: '9-8765-4321',
            edad: 68,
            genero: 'Femenino',
            peso: 82,
            talla: 160
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
            contraste_iv: 80,
            velocidad_infusion: 4,
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
            fc_durante_estudio: 75,
            medicamentos_usados: ["Beta-bloqueadores"],
            analisis_imagenes: "Syngo.via"
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
            ventriculo_izquierdo_fevi: "Levemente reducida (45-54%)",
            hallazgos_extracardiacos: "Ninguno"
        },
        valvula_aortica_diametros_aorta: {
            cuspidies: "3 cúspides de conformación Normal",
            calcificaciones: "NO PRESENTA",
            morfologia_anillo: "Elíptica",
            diametro_menor_anillo: 23,
            diametro_mayor_anillo: 26,
            senos_valsalva_diametro: 33,
            senos_valsalva_observaciones: "NORMAL",
            union_sinotubular_diametro: 29,
            union_sinotubular_observaciones: "NORMAL",
            porcion_tubular_ascendente_diametro: 42,
            porcion_tubular_ascendente_observaciones: "DILATADO (>35 mm)"
        },
        score_calcio: {
            tci: 15,
            da: 350,
            cx: 120,
            cd: 250,
            total: 735,
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
                '6': {
                    estado_general: 'Con hallazgos patológicos',
                    findings: {
                        placas: [{ composicion: 'No calcificada (blanda)', estenosis: 'Moderada (50-69%)', has_hrp: ['Remodelado Positivo'], comentario_placa: 'Placa blanda en ADA proximal.' }],
                        stents: [],
                        has_puente: false,
                        has_aneurisma: false
                    }
                },
                '1': {
                    estado_general: 'Con hallazgos patológicos',
                    findings: {
                        placas: [],
                        stents: [{ evaluacion: 'Permeable, sin reestenosis significativa', comentario_stent: 'Stent permeable en CD proximal.' }],
                        has_puente: false,
                        has_aneurisma: false
                    }
                },
                '7': {
                    estado_general: 'Con hallazgos patológicos',
                    findings: {
                        placas: [],
                        stents: [],
                        has_puente: true,
                        puente_details: { profundidad: 'Superficial', compresion: 'Leve <50%' },
                        has_aneurisma: false
                    }
                },
                '11': {
                    estado_general: 'Con hallazgos patológicos',
                    findings: {
                        placas: [],
                        stents: [],
                        has_puente: false,
                        has_aneurisma: true,
                        aneurisma_details: { diametro: 6 }
                    }
                }
            }
        },
        bypass: {
            antecedentes_bypass: 'No'
        },
        cad_rads: {
            score: 'CAD-RADS 3',
            modifiers: ['S (Stent)', 'V (Placa Vulnerable)'],
            description: 'Enfermedad coronaria moderada en ADA proximal. Stent permeable en CD. Puente miocárdico en ADA media.'
        },
        evaluacion_extracardiaca: {
            hallazgos: ['Hernia hiatal']
        }
    },
    caso_severo: {
        datos_paciente: {
            nombre: 'Carlos Mendoza',
            id_paciente: '8-4567-1234',
            edad: 72,
            genero: 'Masculino',
            peso: 94,
            talla: 172
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
            contraste_iv: 95,
            velocidad_infusion: 6,
            ritmo_estudio: "Taquicardia sinusal",
            calidad_imagen: "Diagnóstica"
        },
        informacion_clinica: {
            indicacion: 'Dolor torácico anginoso en reposo de 2 horas de evolución, con irradiación a brazo izquierdo y diaforesis. ECG con supradesnivel del ST en cara anterior',
            factores_riesgo: ['Hipertensión arterial', 'Diabetes mellitus', 'Dislipidemia', 'Tabaquismo', 'Obesidad']
        },
        motivo_generalidades: {
            descripcion_referencia: "Paciente con dolor torácico típico en reposo, marcadores de daño miocárdico elevados (Troponina I: 8.5 ng/mL), requiere evaluación urgente de arterias coronarias antes de posible intervención coronaria percutánea",
            consentimiento_informado: "Consentimiento informado de emergencia obtenido por riesgo vital inminente. Se explicaron riesgos de contraste y radiación versus beneficio diagnóstico crucial.",
            tolerancia_estudio: "Reacciones moderadas (vómitos, broncoespasmo)",
            fc_durante_estudio: 112,
            medicamentos_usados: ["Nitroglicerina sublingual"],
            analisis_imagenes: "Vitrea"
        },
        anatomia_cardiovascular: {
            venas_cavas: ["Ambas no dilatadas drenando en la aurícula derecha"],
            auricula_derecha: "Dilatada",
            septum_interauricular: "No se visualizan defectos",
            seno_coronario: "Drenando a la AD en forma habitual sin dilatación o anomalías",
            valvula_tricuspide: "No se visualizan defectos por este método",
            ventriculo_derecho: "No dilatado ni hipertrófico",
            arteria_pulmonar: "Diámetro Normal",
            venas_pulmonares: "Cuatro drenando a la aurícula izquierda, dos derechas y dos izquierdas",
            auricula_izquierda: "Dilatada",
            ventriculo_izquierdo_size: "Dilatado",
            ventriculo_izquierdo_hipertrofia: "Concéntrica moderada",
            ventriculo_izquierdo_motilidad: "Acinesia",
            ventriculo_izquierdo_fevi: "Severamente reducida (<30%)",
            hallazgos_extracardiacos: "Derrame pleural bilateral mínimo"
        },
        valvula_aortica_diametros_aorta: {
            cuspidies: "3 cúspides de conformación Normal",
            calcificaciones: "Moderada",
            morfologia_anillo: "Elíptica",
            diametro_menor_anillo: 24,
            diametro_mayor_anillo: 28,
            senos_valsalva_diametro: 38,
            senos_valsalva_observaciones: "DILATADO",
            union_sinotubular_diametro: 35,
            union_sinotubular_observaciones: "DILATADO",
            porcion_tubular_ascendente_diametro: 42,
            porcion_tubular_ascendente_observaciones: "DILATADO (>35 mm)"
        },
        score_calcio: {
            tci: 45,
            da: 1250,
            cx: 480,
            cd: 890,
            total: 2665,
            percentil: '>90'
        },
        anatomia_general: {
            origen_arterias: 'Normal',
            dominancia: 'Codominancia',
            ramificacion_tci: 'Trifurcación (presencia de Ramo Intermedio)',
            terminacion_ada: 'Tipo 3 ("Wraparound")'
        },
        evaluacion_segmento: {
            segments: {
                '5': {
                    estado_general: 'Con hallazgos patológicos',
                    findings: {
                        placas: [{ composicion: 'Parcialmente calcificada (mixta)', estenosis: 'Severa (70-99%)', has_hrp: ['Remodelado Positivo', 'Placa de Baja Atenuación'] }],
                        stents: [],
                        has_puente: false,
                        has_aneurisma: false
                    }
                },
                '6': {
                    estado_general: 'Con hallazgos patológicos',
                    findings: {
                        placas: [{ composicion: 'No calcificada (blanda)', estenosis: 'Oclusión total (100%)' }],
                        stents: [],
                        has_puente: false,
                        has_aneurisma: false
                    }
                },
                '11': {
                    estado_general: 'Con hallazgos patológicos',
                    findings: {
                        placas: [],
                        stents: [{ evaluacion: 'Con reestenosis intra-stent', reestenosis_details: { grado: 'Moderada 50-69%', tipo: 'Focal' } }],
                        has_puente: false,
                        has_aneurisma: true,
                        aneurisma_details: { diametro: 8 }
                    }
                }
            }
        },
        bypass: {
            antecedentes_bypass: 'No'
        },
        cad_rads: {
            score: 'CAD-RADS 5',
            modifiers: ['V (Placa Vulnerable)'],
            description: 'Enfermedad coronaria multivaso severa con oclusión total de la DA proximal y estenosis críticas en TCI, CX y CD. Múltiples placas vulnerables con alto contenido lipídico y ulceraciones. Hallazgos compatibles con síndrome coronario agudo.'
        },
        evaluacion_extracardiaca: {
            hallazgos: ['Aneurisma/dilatación de aorta torácica', 'Derrame pleural']
        }
    },
    caso_disfuncion_ventricular: {
        datos_paciente: {
            nombre: 'María Elena Soto',
            id_paciente: '2-9876-5432',
            edad: 65,
            genero: 'Femenino',
            peso: 78,
            talla: 162
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
            contraste_iv: 80,
            velocidad_infusion: 5,
            ritmo_estudio: "Fibrilación auricular",
            calidad_imagen: "Buena"
        },
        informacion_clinica: {
            indicacion: 'Paciente con insuficiencia cardíaca clase NYHA III, disnea de esfuerzo progresiva, edemas en miembros inferiores. Evaluación de enfermedad coronaria como causa de disfunción ventricular.',
            factores_riesgo: ['Hipertensión arterial', 'Diabetes mellitus', 'Dislipidemia', 'Obesidad', 'Sedentarismo']
        },
        motivo_generalidades: {
            descripcion_referencia: "Paciente con insuficiencia cardíaca descompensada, fracción de eyección reducida en ecocardiograma transtorácico (30-35%). Evaluar viabilidad miocárdica y enfermedad coronaria extensa.",
            consentimiento_informado: "Consentimiento informado obtenido tras explicar riesgos y beneficios. Paciente consciente de necesidad de posible revascularización quirúrgica.",
            tolerancia_estudio: "Buena tolerancia, sin reacciones adversas al medio contraste",
            fc_durante_estudio: 100,
            medicamentos_usados: [],
            analisis_imagenes: "Syngo.via"
        },
        anatomia_cardiovascular: {
            venas_cavas: ["Vena cava superior dilatada"],
            auricula_derecha: "Dilatada",
            septum_interauricular: "Aneurisma septal atrial",
            seno_coronario: "Dilatado",
            valvula_tricuspide: "Regurgitación funcional",
            ventriculo_derecho: "Dilatado",
            arteria_pulmonar: "Dilatada (>34 mm)",
            venas_pulmonares: "Cuatro drenando a la aurícula izquierda, dos derechas y dos izquierdas",
            auricula_izquierda: "Dilatada",
            ventriculo_izquierdo_size: "Dilatado",
            ventriculo_izquierdo_hipertrofia: "Excéntrica",
            ventriculo_izquierdo_motilidad: "Hipocinesia global",
            ventriculo_izquierdo_fevi: "Severamente reducida (<30%)",
            hallazgos_extracardiacos: ["Derrame pericárdico", "Derrame pleural", "Linfadenopatías mediastinales"]
        },
        valvula_aortica_diametros_aorta: {
            cuspidies: "2 cúspides (bicúspide R-L)",
            calcificaciones: "Severa",
            morfologia_anillo: "Circular",
            diametro_menor_anillo: 26,
            diametro_mayor_anillo: 28,
            senos_valsalva_diametro: 45,
            senos_valsalva_observaciones: "ANEURISMÁTICO",
            union_sinotubular_diametro: 42,
            union_sinotubular_observaciones: "ANEURISMÁTICO",
            porcion_tubular_ascendente_diametro: 48,
            porcion_tubular_ascendente_observaciones: "ANEURISMÁTICO (>45 mm)"
        },
        score_calcio: {
            tci: 320,
            da: 1850,
            cx: 920,
            cd: 1100,
            total: 4190,
            percentil: '>90'
        },
        anatomia_general: {
            origen_arterias: 'Normal',
            dominancia: 'Dominancia Derecha',
            ramificacion_tci: 'Bifurcación (en ADA y ACx)',
            terminacion_ada: 'Tipo 2 (Llega hasta el ápex)'
        },
        evaluacion_segmento: {
            segments: {
                '5': { estado_general: 'Con hallazgos patológicos', findings: { placas: [{ composicion: 'Calcificada', estenosis: 'Severa (70-99%)' }], stents: [], has_puente: false, has_aneurisma: false } },
                '6': { estado_general: 'Con hallazgos patológicos', findings: { placas: [{ composicion: 'Calcificada', estenosis: 'Oclusión total (100%)' }], stents: [], has_puente: false, has_aneurisma: false } },
                '11': { estado_general: 'Con hallazgos patológicos', findings: { placas: [{ composicion: 'Calcificada', estenosis: 'Severa (70-99%)' }], stents: [], has_puente: false, has_aneurisma: false } },
                '4': { estado_general: 'Con hallazgos patológicos', findings: { placas: [{ composicion: 'Calcificada', estenosis: 'Severa (70-99%)' }], stents: [], has_puente: false, has_aneurisma: false } }
            }
        },
        bypass: {
            antecedentes_bypass: 'No'
        },
        cad_rads: {
            score: 'CAD-RADS 4B',
            modifiers: ['G (Bypass)'],
            description: 'Enfermedad coronaria de tres vasos severamente calcificada con estenosis críticas en todos los territorios. TCI con estenosis del 80%, DA 90%, CX 85%, CD 75%. Oclusión total de ramos diagonales.'
        },
        evaluacion_extracardiaca: {
            hallazgos: ['Aneurisma/dilatación de aorta torácica', 'Derrame pericárdico', 'Derrame pleural', 'Linfadenopatías mediastinales']
        }
    },
    caso_critico: {
        datos_paciente: {
            nombre: 'Roberto Jiménez',
            id_paciente: '5-4321-6789',
            edad: 58,
            genero: 'Masculino',
            peso: 102,
            talla: 168
        },
        protocolo_estudio: {
            fecha_estudio: '2025-09-30',
            medico_referente: 'Dr. U. Rgente',
            medico_especialidad: 'Cirugía Cardiovascular',
            equipo: "GE Revolution",
            tiempo_rotacion: "0.28/seg",
            adquisicion: "Retrospectivo",
            ecg_gating_detalles: "Extrema inestabilidad hemodinámica con artefactos por movimiento",
            medio_contraste: "Visipaque 320",
            contraste_iv: 100,
            velocidad_infusion: 6,
            ritmo_estudio: "Taquicardia sinusal",
            calidad_imagen: "Limitada por artefactos"
        },
        informacion_clinica: {
            indicacion: 'Paciente con dolor torácico severo, hipotensión y shock cardiogénico. Sospecha de disección aórtica complicada con compromiso coronario. Evaluación prequirúrgica urgente.',
            factores_riesgo: ['Hipertensión arterial', 'Diabetes mellitus', 'Dislipidemia', 'Tabaquismo', 'Obesidad', 'Historia familiar de enfermedad coronaria']
        },
        motivo_generalidades: {
            descripcion_referencia: "Paciente en shock cardiogénico con sospecha de síndrome aórtico agudo. Requiere evaluación urgente de aorta, arterias coronarias y función ventricular para decisión quirúrgica inmediata.",
            consentimiento_informado: "Consentimiento de emergencia por riesgo vital. Familia informada de alta probabilidad de mortalidad perioperatoria.",
            tolerancia_estudio: "Reacciones severas (anafilaxia)",
            fc_durante_estudio: 137,
            medicamentos_usados: ["Nitroglicerina sublingual", "Beta-bloqueadores"],
            analisis_imagenes: "IntelliSpace Portal"
        },
        anatomia_cardiovascular: {
            venas_cavas: ["Vena cava inferior con trombo", "Vena cava superior con estenosis"],
            auricula_derecha: "Dilatada con trombo",
            septum_interauricular: "Defecto septal atrial",
            seno_coronario: "Obstrucción por compresión externa",
            valvula_tricuspide: "Regurgitación funcional severa",
            ventriculo_derecho: "Disfunción severa con hipocinesia",
            arteria_pulmonar: "Tromboembolismo bilateral",
            venas_pulmonares: ["Estenosis de vena pulmonar superior izquierda", "Oclusión parcial vena pulmonar inferior derecha"],
            auricula_izquierda: "Dilatada con trombo en orejuela",
            ventriculo_izquierdo_size: "Dilatado",
            ventriculo_izquierdo_hipertrofia: "Asimétrica septal",
            ventriculo_izquierdo_motilidad: "Acinesia anteroseptal",
            ventriculo_izquierdo_fevi: "Severamente reducida (<20%)",
            hallazgos_extracardiacos: ["Aneurisma/dilatación de aorta torácica", "Embolismo pulmonar", "Derrame pericárdico", "Derrame pleural", "Linfadenopatías mediastinales"]
        },
        valvula_aortica_diametros_aorta: {
            cuspidies: "3 cúspides con fusión parcial de coronarias",
            calcificaciones: "Pesada",
            morfologia_anillo: "Irregular por disección",
            diametro_menor_anillo: 29,
            diametro_mayor_anillo: 32,
            senos_valsalva_diametro: 62,
            senos_valsalva_observaciones: "ANEURISMÁTICO",
            union_sinotubular_diametro: 55,
            union_sinotubular_observaciones: "ANEURISMÁTICO",
            porcion_tubular_ascendente_diametro: 68,
            porcion_tubular_ascendente_observaciones: "DISSECCIÓN TIPO A"
        },
        score_calcio: {
            tci: 180,
            da: 2100,
            cx: 750,
            cd: 1450,
            total: 4480,
            percentil: '>90'
        },
        anatomia_general: {
            origen_arterias: 'Normal',
            dominancia: 'Dominancia Izquierda',
            ramificacion_tci: 'Bifurcación (en ADA y ACx)',
            terminacion_ada: 'Tipo 1 (Termina antes de llegar al ápex)'
        },
        evaluacion_segmento: {
            segments: {
                '5': { estado_general: 'Con hallazgos patológicos', findings: { placas: [{ composicion: 'Calcificada', estenosis: 'Oclusión total (100%)' }], stents: [], has_puente: false, has_aneurisma: false } },
                '6': { estado_general: 'Con hallazgos patológicos', findings: { placas: [{ composicion: 'Calcificada', estenosis: 'Oclusión total (100%)' }], stents: [], has_puente: false, has_aneurisma: false } },
                '11': { estado_general: 'Con hallazgos patológicos', findings: { placas: [{ composicion: 'No calcificada (blanda)', estenosis: 'Severa (70-99%)' }], stents: [], has_puente: false, has_aneurisma: false } },
                '4': { estado_general: 'Con hallazgos patológicos', findings: { placas: [{ composicion: 'No calcificada (blanda)', estenosis: 'Severa (70-99%)' }], stents: [], has_puente: false, has_aneurisma: false } }
            }
        },
        bypass: {
            antecedentes_bypass: 'No'
        },
        cad_rads: {
            score: 'CAD-RADS 5',
            modifiers: ['V (Placa Vulnerable)', 'G (Bypass)'],
            description: 'Enfermedad coronaria terminal con oclusiones múltiples y estenosis críticas en vasos remanentes. TCI y DA ocluidos crónicamente. CX 95% y CD 90% con placas vulnerables de alto riesgo. Disección aórtica tipo A confirmada con compromiso de ostium coronario.'
        },
        evaluacion_extracardiaca: {
            hallazgos: ['Aneurisma/dilatación de aorta torácica', 'Embolismo pulmonar', 'Derrame pericárdico', 'Derrame pleural', 'Linfadenopatías mediastinales']
        }
    },
    caso_completo: {
        datos_paciente: {
            nombre: 'Auditoría Completa',
            id_paciente: '0-0000-0000',
            edad: 62,
            genero: 'Masculino',
            peso: 88,
            talla: 175
        },
        protocolo_estudio: {
            fecha_estudio: '2025-10-01',
            medico_referente: 'Dr. A. Uditor',
            medico_especialidad: 'Cardiología',
            equipo: "Canon Aquilion 160 cortes",
            tiempo_rotacion: "0.35/seg",
            adquisicion: "Retrospectivo",
            ecg_gating_detalles: "Ritmo sinusal estable",
            medio_contraste: "Ultravist 370",
            contraste_iv: 70,
            velocidad_infusion: 5,
            ritmo_estudio: "Ritmo sinusal normal",
            calidad_imagen: "Excelente"
        },
        informacion_clinica: {
            indicacion: 'Test de ciclo completo de guardado y carga',
            factores_riesgo: ['Hipertensión arterial', 'Tabaquismo']
        },
        motivo_generalidades: {
            descripcion_referencia: "Caso de prueba para todas las funcionalidades del sistema.",
            consentimiento_informado: "Consentimiento informado obtenido.",
            tolerancia_estudio: "Buena tolerancia, sin reacciones adversas al medio contraste",
            fc_durante_estudio: 68,
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
            diametro_menor_anillo: 24,
            diametro_mayor_anillo: 27,
            senos_valsalva_diametro: 34,
            senos_valsalva_observaciones: "NORMAL",
            union_sinotubular_diametro: 30,
            union_sinotubular_observaciones: "NORMAL",
            porcion_tubular_ascendente_diametro: 36,
            porcion_tubular_ascendente_observaciones: "NORMAL"
        },
        score_calcio: {
            tci: 10,
            da: 20,
            cx: 30,
            cd: 40,
            total: 100,
            percentil: '50-75'
        },
        anatomia_general: {
            origen_arterias: 'Anómalo',
            anomalo_details: {
                tipo_anomalia: ['Origen en seno coronario opuesto'],
                seno_opuesto_details: {
                    vaso_anomalo: 'ACD naciendo de Seno Izquierdo',
                    trayecto_anomalo: 'Interarterial (entre Aorta y Pulmonar)'
                }
            },
            dominancia: 'Dominancia Derecha',
            ramificacion_tci: 'Bifurcación (en ADA y ACx)',
            terminacion_ada: 'Tipo 2 (Llega hasta el ápex)'
        },
        evaluacion_segmento: {
            segments: {
                '6': {
                    estado_general: 'Con hallazgos patológicos',
                    findings: {
                        placas: [
                            { composicion: 'No calcificada (blanda)', estenosis: 'Leve (25-49%)', has_hrp: [], comentario_placa: 'Placa 1' },
                            { composicion: 'Calcificada', estenosis: 'Moderada (50-69%)', has_hrp: ['Remodelado Positivo'], comentario_placa: 'Placa 2' }
                        ],
                        stents: [{ evaluacion: 'Permeable, sin reestenosis significativa', comentario_stent: 'Stent proximal' }],
                        has_puente: false,
                        has_aneurisma: false
                    }
                },
                '11': {
                    estado_general: 'Con hallazgos patológicos',
                    findings: {
                        placas: [],
                        stents: [{
                            evaluacion: 'Con reestenosis intra-stent',
                            reestenosis_details: { grado: 'Moderada 50-69%', tipo: 'Focal' },
                            comentario_stent: 'Reestenosis en stent de CX'
                        }],
                        has_puente: false,
                        has_aneurisma: false
                    }
                },
                '2': {
                    estado_general: 'Con hallazgos patológicos',
                    findings: {
                        placas: [],
                        stents: [],
                        has_puente: true,
                        puente_details: { profundidad: 'Superficial', compresion: 'Leve <50%' },
                        has_aneurisma: true,
                        aneurisma_details: { diametro: 7 }
                    }
                },
                '7': {
                    estado_general: 'No valorable',
                    findings: null
                }
            }
        },
        bypass: {
            antecedentes_bypass: 'Sí',
            grafts_container: [
                {
                    tipo_conducto: 'Arteria Mamaria Interna Izquierda (LIMA)',
                    anastomosis_proximal: 'In situ',
                    anastomosis_distal: 'Segmento 7',
                    estado_injerto: 'Permeable, sin estenosis'
                }
            ]
        },
        cad_rads: {
            score: 'CAD-RADS 3',
            modifiers: ['S (Stent)', 'G (Bypass)'],
            description: 'Test case con anomalía coronaria, múltiples placas, stents, puente miocárdico, aneurisma y bypass permeable.'
        },
        evaluacion_extracardiaca: {
            hallazgos: ['Hernia hiatal']
        }
    }
};