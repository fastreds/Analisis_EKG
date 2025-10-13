# Proyecto: Vivit CardioTools - Reporte Dinámico AngioTAC

## Descripción General

Vivit CardioTools es una aplicación web avanzada diseñada para profesionales de la salud, específicamente cardiólogos y radiólogos, para facilitar la creación de informes estructurados y dinámicos de angiografías por tomografía computarizada (AngioTAC) de las arterias coronarias.

La herramienta permite a los usuarios introducir datos de un estudio de AngioTAC en un formulario web detallado y visualiza esos datos en tiempo real sobre un croquis interactivo del árbol coronario. Al final, genera un informe de texto completo que puede ser copiado o guardado.

## Características Principales

*   **Formulario Dinámico y Estructurado:** Un formulario web exhaustivo que guía al usuario a través de la introducción de datos, cubriendo desde la información del paciente hasta hallazgos anatómicos y patológicos detallados.
*   **Croquis Interactivo del Árbol Coronario:** Una visualización basada en D3.js que dibuja el árbol coronario del paciente. Este croquis se actualiza en tiempo real para reflejar los hallazgos introducidos, como la localización y severidad de estenosis, la presencia de placas, stents, y otras anomalías.
*   **Soporte para Variaciones Anatómicas:** La aplicación maneja las tres principales dominancias coronarias (derecha, izquierda y codominancia), ajustando tanto el formulario como el croquis visual.
*   **Cálculo Automatizado de CAD-RADS:** La aplicación calcula automáticamente la puntuación CAD-RADS™ 2.0 basándose en los hallazgos de estenosis, ayudando a estandarizar el informe.
*   **Generación de Informes y Conclusiones:** Genera una vista previa de un informe de texto completo y una conclusión resumida, que pueden ser fácilmente copiados para su uso en sistemas de informes médicos.
*   **Gestión de Casos:** Permite cargar casos de ejemplo para demostración y formación, y guarda el trabajo actual en el `localStorage` del navegador para persistir la sesión.
*   **Modo de Edición:** Incluye un modo de edición avanzado que permite a los desarrolladores o usuarios avanzados reposicionar y redibujar las arterias en el croquis, con la capacidad de exportar las nuevas coordenadas.

## Tecnologías Utilizadas

*   **HTML5:** Para la estructura semántica de la aplicación.
*   **CSS3 (con Tailwind CSS):** Para un diseño moderno y responsivo.
*   **JavaScript (ES6 Modules):** Para toda la lógica de la aplicación.
*   **D3.js (v7):** Para la creación y manipulación de la visualización de datos interactiva (el croquis coronario).

## Estructura del Proyecto

A continuación se describe la estructura de archivos y directorios del proyecto:

.
├── 📂 css/
│   ├── 📄 styles.css         (Estilos principales de la aplicación del formulario)
│   └── 📄 informe.css        (Estilos específicos para la página del informe final)
│
├── 📂 docs/
│   ├── 📄 cartaCompromiso.html (Documento del proyecto)
│   ├── 📄 propuesta.html     (Documento del proyecto)
│   └── 📄 readme.txt         (Este archivo)
│
├── 📂 img/
│   └── ... (Imágenes y logos usados en la aplicación)
│
├── 📂 js/
│   ├── 📂 data/
│   │   ├── 📄 case.js          (✅ DATOS DE EJEMPLO - Contiene los casos de prueba para el formulario)
│   │   └── 📄 posicionesDominancia.js (✅ DATOS DEL CROQUIS - Contiene las coordenadas para dibujar las arterias)
│   │
│   ├── 📂 logic/
│   │   ├── 📄 arbolCoronarioLogic.js (✅ LÓGICA DEL CROQUIS - Dibuja y maneja la interacción del croquis)
│   │   ├── 📄 script.js        (✅ LÓGICA PRINCIPAL - Construye el formulario, recolecta datos y actualiza la UI)
│   │   └── 📄 informe.js       (✅ LÓGICA DEL INFORME - Carga los datos guardados y genera la visualización del informe)
│   │
│   ├── 📂 utils/
│   │   └── 📄 audit.js         (✅ HERRAMIENTA DE DIAGNÓSTICO - Script para auditar el proyecto desde la consola)
│   │
│   └── 📄 data.js              (❗ ARCHIVO CLAVE - Define la estructura de datos de todo el informe)
│
├── 📄 index.html               (✅ PÁGINA PRINCIPAL - La aplicación principal para rellenar el formulario)
├── 📄 informe.html             (✅ PÁGINA DE REPORTE - La vista final para imprimir/guardar el informe)
├── 📄 arbol.txt                (Utilidad para generar la estructura de archivos)
└── ... (Otros archivos de configuración y Git)