// Esta función está diseñada para ser ejecutada desde la consola del navegador
// para obtener un diagnóstico del estado actual de la aplicación.

async function runProjectAudit() {
    console.clear();
    console.group("🔬 AUDITORÍA DEL PROYECTO - VIVIT CARDIOTOOLS 🔬");

    let totalTests = 0;
    let passedTests = 0;

    const check = (description, conditionFn) => {
        totalTests++;
        let result = false;
        try {
            result = typeof conditionFn === 'function' ? conditionFn() : conditionFn;
            if (result) {
                console.log(`✅ ${description}`);
                passedTests++;
            } else {
                console.error(`❌ ${description}`);
            }
        } catch (e) {
            console.error(`❌ ${description} (Falló con error: ${e.message})`);
        }
        return result;
    };

    // --- 1. Carga de Módulos y Datos ---
    console.group("1. Carga de Módulos y Datos");
    check("Módulo 'data.js' (variable 'reportStructure') está accesible.", () => typeof reportStructure !== 'undefined' && Array.isArray(reportStructure) && reportStructure.length > 0);
    check("Módulo 'case.js' (variable 'sampleCases') está accesible.", () => typeof sampleCases !== 'undefined' && Object.keys(sampleCases).length > 0);
    check("Módulo 'posicionesDominancia.js' (variable 'posicionesDerecha') está accesible.", () => typeof posicionesDerecha !== 'undefined' && Array.isArray(posicionesDerecha) && posicionesDerecha.length > 0);
    check("Módulo 'arbolCoronarioLogic.js' (función 'initCoronarySketch') está accesible.", () => typeof initCoronarySketch === 'function');
    console.groupEnd();

    // --- 2. Integridad de los Datos ---
    console.group("2. Integridad de los Datos");
    if (typeof reportStructure !== 'undefined' && typeof posicionesDerecha !== 'undefined') {
        const segmentIdsInDataJs = new Set(reportStructure.find(s => s.id === 'evaluacion_segmento')?.segments.map(seg => seg.id));
        check("La sección 'evaluacion_segmento' existe en 'data.js'.", () => segmentIdsInDataJs.size > 0);

        const allPositionSegments = [...posicionesDerecha, ...posicionesIzquierda, ...posicionesCodominancia];
        const uniquePositionIds = new Set(allPositionSegments.map(p => p.id));

        let missingIds = [];
        uniquePositionIds.forEach(id => {
            if (!segmentIdsInDataJs.has(id)) {
                missingIds.push(id);
            }
        });
        check(`Todos los IDs de segmentos en 'posicionesDominancia.js' existen en 'data.js'.`, () => missingIds.length === 0);
        if (missingIds.length > 0) {
            console.warn(`   -> IDs faltantes en data.js: ${missingIds.join(', ')}`);
        }
    }
    console.groupEnd();

    // --- 3. Estructura HTML y DOM ---
    console.group("3. Estructura HTML y DOM");
    const formContainer = document.getElementById('form-container');
    check("Contenedor del formulario (#form-container) existe.", () => formContainer);
    if (formContainer) {
        check(`Se han generado secciones en el formulario.`, () => formContainer.querySelectorAll('.form-section-container').length > 0);
        check("Sección 'Anatomía Coronaria General' encontrada.", () => document.getElementById('form-section-anatomia_general'));
        check("Selector de Dominancia existe en el formulario.", () => document.querySelector('input[name="anatomia_general-dominancia"]'));
        check("Un valor de 'Dominancia' está seleccionado por defecto.", () => document.querySelector('input[name="anatomia_general-dominancia"]:checked'));
    }
    const sketchContainer = document.getElementById('sketch-container');
    check("Contenedor del croquis (#sketch-container) existe.", () => sketchContainer);
    if (sketchContainer) {
        check(`Se encontraron 3 SVGs para las dominancias.`, () => sketchContainer.querySelectorAll('svg').length === 3);
        check("Hay un SVG visible para el croquis.", () => sketchContainer.querySelector('svg:not(.hidden)'));
    }
    check("Contenedor de la leyenda (#legend-container) existe.", () => document.getElementById('legend-container'));
    check("Ventana modal para segmentos (#segment-modal) existe.", () => document.getElementById('segment-modal'));
    console.groupEnd();

    // --- 4. Cálculos Principales ---
    console.group("4. Cálculos Principales");
    // Prueba de cálculo de CAD-RADS
    const mockCadRadsData = {
        protocolo_estudio: { calidad_imagen: 'Buena' },
        evaluacion_segmento: {
            segments: {
                '6': { // pADA
                    findings: {
                        placas: [{ estenosis: 'Severa (70-99%)' }]
                    }
                }
            }
        }
    };
    // Necesitamos acceder a la función `calculateCadRads` que es local a script.js
    // Para esta prueba, la expondremos temporalmente en window si no existe
    if (typeof window.calculateCadRads === 'function') {
        check("Cálculo de CAD-RADS funciona para un caso severo (esperado: 4A).", () => window.calculateCadRads(mockCadRadsData) === 'CAD-RADS 4A');
    } else {
        console.warn("   -> No se pudo probar 'calculateCadRads' porque no está expuesta globalmente.");
    }

    // Prueba de cálculo de Score de Calcio
    const tciInput = document.getElementById('score_calcio-tci');
    const daInput = document.getElementById('score_calcio-da');
    const totalInput = document.getElementById('score_calcio-total');
    if (check("Campos de Score de Calcio existen.", () => tciInput && daInput && totalInput)) {
        tciInput.value = '100';
        daInput.value = '50';
        // Disparamos el evento que usa la aplicación
        tciInput.dispatchEvent(new Event('input', { bubbles: true }));
        daInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Esperamos un ciclo para que el DOM se actualice
        await new Promise(resolve => setTimeout(resolve, 50));

        check("Cálculo de Score de Calcio total se actualiza correctamente (100 + 50 = 150).", () => totalInput.value === '150');
        // Limpiamos los valores
        tciInput.value = '';
        daInput.value = '';
        tciInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    console.groupEnd();

    // --- 5. Funcionalidad del Croquis ---
    console.group("5. Funcionalidad del Croquis");
    if (sketchContainer) {
        const visibleSvg = sketchContainer.querySelector('svg:not(.hidden)');
        if (visibleSvg) {
            const drawnSegments = visibleSvg.querySelectorAll('.segment-group');
            check(`Se han dibujado ${drawnSegments.length} segmentos en el croquis visible.`, () => drawnSegments.length > 0);
        }
        check("Botón de edición de posiciones (#edit-positions-btn) existe.", () => document.getElementById('edit-positions-btn'));
        check("Botón de reseteo de posiciones (#reset-positions-btn) existe.", () => document.getElementById('reset-positions-btn'));
        check("Botón de mostrar/ocultar etiquetas (#toggle-labels-btn) existe.", () => document.getElementById('toggle-labels-btn'));
    }
    console.groupEnd();

    // --- 6. Estado de Almacenamiento Local ---
    console.group("6. Almacenamiento Local (LocalStorage)");
    const savedData = localStorage.getItem('savedAngioTACStudy');
    check("Se puede acceder a 'savedAngioTACStudy' en localStorage.", () => savedData !== undefined);
        if (savedData) {
            check("Los datos guardados son un JSON válido.", () => {
                try {
                    JSON.parse(savedData);
                    return true;
                } catch (e) {
                    return false;
                }
            });
        } else {
            console.warn("   -> No se encontraron datos guardados para validar el formato JSON.");
        }
    console.groupEnd();

    // --- 7. Prueba de Ciclo Guardar/Cargar ---
    console.group("7. Prueba de Ciclo Guardar/Cargar");
    if (typeof window.loadCase === 'function' && typeof window.gatherData === 'function' && typeof sampleCases.caso_completo !== 'undefined') {
        console.log("   -> Ejecutando prueba de ciclo completo con 'caso_completo'...");
        
        // Cargar el caso de prueba
        window.loadCase(sampleCases.caso_completo);
        
        // Esperar a que todos los eventos se procesen
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Recolectar los datos del formulario poblado
        const gatheredData = window.gatherData();

        // Comparar los datos originales con los recolectados
        const diffs = findJsonDiffs(sampleCases.caso_completo, gatheredData);

        if (check("Los datos guardados coinciden con los datos cargados.", () => diffs.length === 0)) {
            console.log("   -> ¡Éxito! El ciclo de carga y guardado es consistente.");
        } else {
            console.error("   -> ¡Fallo! Se encontraron discrepancias en el ciclo de carga y guardado:");
            diffs.forEach(d => console.warn(`     - En la ruta '${d.path}':\n       Original: ${JSON.stringify(d.original)}\n       Obtenido: ${JSON.stringify(d.gathered)}`));
        }
    } else {
        console.warn("   -> No se pudo ejecutar la prueba de ciclo. Faltan 'loadCase', 'gatherData' o 'caso_completo'.");
    }
    console.groupEnd();

    // --- Resumen Final ---
    console.log("\n" + "─".repeat(50));
    const summaryStyle = `font-size: 16px; font-weight: bold; color: ${passedTests === totalTests ? 'green' : 'orange'};`;
    console.log(`%c📋 RESUMEN DE LA AUDITORÍA: ${passedTests} de ${totalTests} pruebas pasaron.`, summaryStyle);
    console.groupEnd();
}

function findJsonDiffs(original, gathered, path = '') {
    let differences = [];
    const originalKeys = new Set(Object.keys(original));
    const gatheredKeys = new Set(Object.keys(gathered));

    for (let key of originalKeys) {
        const currentPath = path ? `${path}.${key}` : key;
        if (!gathered.hasOwnProperty(key)) {
            // Ignorar si el valor original era nulo o un objeto/array vacío
            if (original[key] !== null && (typeof original[key] !== 'object' || Object.keys(original[key]).length > 0)) {
                 differences.push({ path: currentPath, original: original[key], gathered: undefined });
            }
            continue;
        }

        const originalValue = original[key];
        const gatheredValue = gathered[key];

        if (typeof originalValue === 'object' && originalValue !== null && typeof gatheredValue === 'object' && gatheredValue !== null) {
            differences = differences.concat(findJsonDiffs(originalValue, gatheredValue, currentPath));
        } else if (JSON.stringify(originalValue) !== JSON.stringify(gatheredValue)) {
            differences.push({ path: currentPath, original: originalValue, gathered: gatheredValue });
        }
    }
    return differences;
}

// Para facilitar el acceso, se asigna la función al objeto window.
window.runProjectAudit = runProjectAudit;

// Exponemos la función de cálculo de CAD-RADS para que la auditoría pueda usarla.
// Esto se hace en script.js, pero lo añadimos aquí como referencia de lo que se necesita.
/*
En script.js, añadir:
window.calculateCadRads = calculateCadRads;
*/