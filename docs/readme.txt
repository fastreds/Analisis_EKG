# Proyecto: Vivit CardioTools - Reporte Dinámico AngioTAC

## Descripción General

Vivit CardioTools es una aplicación web integral diseñada para profesionales de la salud, que facilita la creación, gestión y distribución de informes de angiografías por tomografía computarizada (AngioTAC) de las arterias coronarias.

La plataforma cuenta con un sistema de autenticación de usuarios y una base de datos centralizada en la nube, permitiendo a los médicos acceder y administrar sus estudios desde cualquier lugar. Los usuarios pueden introducir datos en un formulario detallado, visualizar los hallazgos en un croquis interactivo y gestionar el ciclo de vida completo de cada informe, desde su creación hasta su envío por correo electrónico.

## Características Principales

*   **Autenticación y Seguridad:** Sistema de inicio de sesión basado en correo y contraseña para proteger el acceso a la información de los estudios.
*   **Mantenimiento Centralizado de Estudios:** Una página principal que lista todos los estudios guardados, con funcionalidades de búsqueda, ordenamiento y paginación para una gestión eficiente.
*   **Formulario Dinámico e Inteligente:** Un formulario exhaustivo que guía al usuario en la introducción de datos, cubriendo desde la información del paciente hasta hallazgos patológicos detallados.
*   **Croquis Interactivo del Árbol Coronario:** Una visualización basada en D3.js que dibuja el árbol coronario del paciente. Este croquis se actualiza en tiempo real para reflejar los hallazgos introducidos, como la localización y severidad de estenosis, la presencia de placas, stents, y otras anomalías.
*   **Soporte para Variaciones Anatómicas:** La aplicación maneja las tres principales dominancias coronarias (derecha, izquierda y codominancia), ajustando tanto el formulario como el croquis visual.
*   **Cálculo Automatizado de CAD-RADS:** La aplicación calcula automáticamente la puntuación CAD-RADS™ 2.0 basándose en los hallazgos de estenosis, ayudando a estandarizar el informe.
*   **Gestión del Ciclo de Vida del Informe:** Permite cambiar el estado de un estudio (ej. "Creado", "En Proceso", "Finalizado") directamente desde la lista principal.
*   **Envío de Informes por Email:** Funcionalidad para enviar el informe final al paciente y al médico referente. Incluye una validación para asegurar que solo se envíen los informes con estado "Finalizado".
*   **Persistencia de Datos en la Nube:** Todos los estudios se guardan de forma segura en una base de datos Firestore, eliminando la dependencia del almacenamiento local del navegador y permitiendo el acceso desde múltiples dispositivos.
*   **Generación de Informes para Copiar:** Genera una vista previa de un informe de texto completo y una conclusión resumida, que pueden ser fácilmente copiados para su uso en sistemas de informes médicos.

## Tecnologías Utilizadas

*   **HTML5:** Para la estructura semántica de la aplicación.
*   **CSS3 (con Tailwind CSS):** Para un diseño moderno y responsivo.
*   **JavaScript (ES6 Modules):** Para toda la lógica de la aplicación.
*   **Firebase:**
    *   **Firestore:** Como base de datos NoSQL en la nube para almacenar todos los datos de los estudios.
    *   **Authentication:** Para gestionar el inicio de sesión y la seguridad de los usuarios.
*   **D3.js (v7):** Para la creación y manipulación de la visualización de datos interactiva (el croquis coronario).

## Estructura del Proyecto

A continuación se describe la estructura de archivos y directorios del proyecto:

.
├── 📄 index.html              (✅ PÁGINA DE LOGIN - Portal de acceso para usuarios)
├── 📄 estudios.html           (✅ PÁGINA DE MANTENIMIENTO - Vista principal para listar y gestionar estudios)
├── 📄 angioForm.html          (✅ PÁGINA DE FORMULARIO - Creación y edición de un estudio individual)
│
├── 📂 css/
│   └── 📄 styles.css          (Estilos globales y utilidades de la aplicación)
│
├── 📂 js/
│   ├── 📂 data/
│   │   ├── 📄 case.js           (Datos de ejemplo para pruebas)
│   │   └── 📄 posicionesDominancia.js (Coordenadas para dibujar las arterias en el croquis)
│   │
│   ├── 📂 logic/
│   │   ├── 📄 auth.js           (Lógica de autenticación y redirección de usuarios)
│   │   ├── 📄 estudios.js       (Lógica para la página de mantenimiento: carga, búsqueda, paginación, etc.)
│   │   ├── 📄 form.js           (Lógica principal del formulario: construcción, recolección de datos, etc.)
│   │   ├── 📄 arbolCoronarioLogic.js (Lógica del croquis interactivo con D3.js)
│   │   └── 📄 firebaseLogic.js  (Módulo central para interactuar con Firebase: CRUD de estudios y Auth)
│   │
│   └──  utils/
│       └── 📄 audit.js          (Script de diagnóstico para ejecutar desde la consola)
│
├── 📂 docs/
│   └── 📄 readme.txt          (Este archivo)
│
├── 📂 img/
│   └── ... (Imágenes y logos)
│
└── ... (Otros archivos de configuración y Git)