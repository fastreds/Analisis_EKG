// Esta función está diseñada para ser ejecutada desde la consola del navegador
// para obtener un diagnóstico del estado actual de la aplicación.

function runProjectAudit() {
    console.clear();
    console.group("🔬 AUDITORÍA DEL PROYECTO - VIVIT CARDIOTOOLS 🔬");

    const check = (description, condition) => {
        if (condition) {
            console.log(`✅ ${description}`);
        } else {
            console.error(`❌ ${description}`);
        }
        return condition;
    };

    // --- 1. Estructura HTML Principal ---
    console.groupCollapsed("1. Estructura HTML Principal");
    const formContainer = document.getElementById('form-container');
    const croquisWrapper = document.getElementById('croquis-wrapper');
    check("Contenedor del formulario (#form-container) existe.", formContainer);
    check("Contenedor del croquis (#croquis-wrapper) existe.", croquisWrapper);
    console.groupEnd();

    // --- 2. Generación del Formulario Dinámico ---
    console.groupCollapsed("2. Estado del Formulario (desde data.js)");
    if (formContainer) {
        const sections = formContainer.querySelectorAll('.form-section-container');
        check(`Se han generado ${sections.length} secciones en el formulario.`, sections.length > 0);
        
        const anatomySection = document.getElementById('section-content-anatomia_general');
        check("Sección 'Anatomía Coronaria General' encontrada.", anatomySection);

        const segmentSection = document.getElementById('section-content-evaluacion_segmento');
        if (check("Sección 'Evaluación por Segmento' encontrada.", segmentSection)) {
            const segmentForms = segmentSection.querySelectorAll('.segment-container');
            console.info(`   -> Se encontraron ${segmentForms.length} sub-formularios de segmentos.`);
        }
    } else {
        console.error("No se pudo auditar el formulario porque #form-container no existe.");
    }
    console.groupEnd();

    // --- 3. Croquis Coronario Interactivo ---
    console.groupCollapsed("3. Estado del Croquis Interactivo (desde arbolCoronarioLogic.js)");
    if (croquisWrapper) {
        const sketchContainer = document.getElementById('sketch-container');
        if (check("Contenedor del SVG (#sketch-container) existe.", sketchContainer)) {
            const svgs = sketchContainer.querySelectorAll('svg');
            check(`Se encontraron ${svgs.length} SVGs para las dominancias.`, svgs.length === 3);
            
            const visibleSvg = sketchContainer.querySelector('svg:not(.hidden)');
            if (check("Hay un SVG visible.", visibleSvg)) {
                const drawnSegments = visibleSvg.querySelectorAll('.segment-group');
                console.info(`   -> Se han dibujado ${drawnSegments.length} segmentos en el croquis visible.`);
            }
            // Prueba de funcionalidad clave
            const dominanceRadio = document.querySelector('input[name="anatomia_general-dominancia"]:checked');
            check("El croquis puede encontrar el selector de 'Dominancia' en el formulario.", document.querySelector('input[name="anatomia_general-dominancia"]'));
            
            // Prueba de funcionalidad clave MEJORADA
            const dominanceRadioChecked = document.querySelector('input[name="anatomia_general-dominancia"]:checked');
            check("Un valor de 'Dominancia' está seleccionado por defecto.", dominanceRadioChecked);

        }
        check("Contenedor de la leyenda (#legend-container) existe.", document.getElementById('legend-container'));
        check("Botón de edición de posiciones (#edit-positions-btn) existe.", document.getElementById('edit-positions-btn'));
        check("Ventana modal para segmentos (#segment-modal) existe.", document.getElementById('segment-modal'));
    } else {
        console.error("No se pudo auditar el croquis porque #croquis-wrapper no existe.");
    }
    console.groupEnd();

    // --- 4. Módulos y Datos ---
    console.groupCollapsed("4. Carga de Módulos y Datos");
    try {
        // Estas variables se importan en los scripts principales. Si están disponibles, los módulos cargaron.
        check("Estructura de datos 'reportStructure' es un array con elementos.", Array.isArray(reportStructure) && reportStructure.length > 0);
        check("Módulo 'data.js' (variable 'reportStructure') está accesible.", typeof reportStructure !== 'undefined');
        check("Módulo 'case.js' (variable 'sampleCases') está accesible.", typeof sampleCases !== 'undefined');
        check("Módulo 'posicionesDominancia.js' (variable 'posicionesDerecha') está accesible.", typeof posicionesDerecha !== 'undefined');
        check("Módulo 'arbolCoronarioLogic.js' (función 'initCoronarySketch') está accesible.", typeof initCoronarySketch !== 'undefined');
    } catch (e) {
        console.error("Error al verificar los módulos. Es posible que no se hayan importado correctamente.", e);
    }
    console.groupEnd();

    // --- 5. Estado de Almacenamiento Local ---
    console.groupCollapsed("5. Almacenamiento Local (LocalStorage)");
    const savedData = localStorage.getItem('savedAngioTACStudy');
    if (check("Se encontró un estudio guardado ('savedAngioTACStudy').", savedData !== null)) {
        try {
            const parsedData = JSON.parse(savedData);
            console.info("   -> Los datos guardados son un JSON válido.");
        } catch (e) {
            console.error("   -> ¡Error! Los datos guardados no son un JSON válido.");
        }
    }
    console.groupEnd();

    // --- 6. Verificación de Eventos ---
    console.groupCollapsed("6. Verificación de Eventos");
    // Esta es una verificación indirecta. Si los botones existen, asumimos que los listeners se adjuntaron.
    // Una prueba más profunda requeriría herramientas de testing.
    check("Botón 'Guardar Estudio' existe para adjuntar evento.", document.getElementById('save-study-btn'));
    check("Botón 'Copiar Reporte' existe para adjuntar evento.", document.getElementById('copy-report-btn'));
    check("Botones de 'Casos de Ejemplo' existen.", document.querySelector('.case-btn'));
    console.groupEnd();

    console.log("\n📋 Auditoría finalizada. Revisa los detalles en los grupos colapsados.");
    console.groupEnd();
}

// Para facilitar el acceso, se asigna la función al objeto window.
window.runProjectAudit = runProjectAudit;