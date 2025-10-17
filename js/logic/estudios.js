import { getStudies, deleteStudy, updateStudy } from './firebaseLogic.js';
import { getCurrentUser } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    // La autenticación y visibilidad del body/user-info ahora es manejada por auth.js
    const user = await getCurrentUser();
    if (user) {
        // Solo necesitamos mostrar el cuerpo de la página si el usuario está autenticado.
        document.body.classList.remove('hidden');
    } // auth.js se encarga de la redirección si no hay usuario.

    const searchInput = document.getElementById('search-input');
    const tableBody = document.getElementById('studies-table-body');
    const tableHeaders = document.querySelectorAll('th[data-sort-key]');
    const emailModal = document.getElementById('email-modal');
    const emailModalTitle = document.getElementById('email-modal-title');
    const emailModalCloseBtn = document.getElementById('email-modal-close-btn');
    const emailForm = document.getElementById('email-form');
    const emailInputModal = document.getElementById('email-input-modal');
    const saveEmailBtn = document.getElementById('save-email-btn');
    const itemsPerPageSelect = document.getElementById('items-per-page');
    const pageNavigation = document.getElementById('page-navigation');
    const totalItemsInfo = document.getElementById('total-items-info');
    let allStudies = [];
    let sortKey = 'protocolo_estudio.fecha_estudio';
    let sortDirection = 'desc';
    let currentPage = 1;
    let itemsPerPage = 12;

    const notyf = new Notyf({
        duration: 5000,
        position: { x: 'right', y: 'top' },
        types: [
            { type: 'success', background: 'green', icon: false },
            { type: 'error', background: 'indianred', duration: 8000, dismissible: true }
        ]
    });

    const getValueFromPath = (obj, path) => {
        return path.split('.').reduce((res, prop) => res?.[prop], obj) || '';
    }

    const updateHeaderArrows = () => {
        tableHeaders.forEach(header => {
            const arrow = header.querySelector('.sort-arrow');
            if (header.dataset.sortKey === sortKey) {
                arrow.classList.add('active');
                arrow.innerHTML = sortDirection === 'asc' ? '&#9650;' : '&#9660;';
            } else {
                arrow.classList.remove('active');
                arrow.innerHTML = '';
            }
        });
    };

    const renderTable = (studiesToRender) => {
        tableBody.innerHTML = ''; // Clear existing rows

        const paginatedStudies = studiesToRender.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );

        if (studiesToRender.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" class="text-center py-4">No hay estudios que coincidan con la búsqueda.</td></tr>';
            return;
        }

        totalItemsInfo.textContent = `Mostrando ${paginatedStudies.length} de ${studiesToRender.length} estudios.`;


        paginatedStudies.forEach(study => {
            const datosPaciente = study.datos_paciente || {};
            const protocoloEstudio = study.protocolo_estudio || {};
            const medicoReferente = study.protocolo_estudio || {};
            const row = document.createElement('tr');
            row.dataset.studyId = study.id;
            row.className = 'border-b border-gray-200 hover:bg-gray-100';

            const reportStatus = study.reportStatus || 'borrador';
            const patientEmailStatus = study.patientEmailStatus || 'no enviado';
            const doctorEmailStatus = study.doctorEmailStatus || 'no enviado';
            
            const patientEmail = datosPaciente.paciente_email || null; // Corregido para usar datosPaciente
            const doctorEmail = protocoloEstudio.doctorEmail || null; // Corregido para usar protocoloEstudio

            const getStatusBadge = (status) => {
                const isFinalizado = status.toLowerCase() === 'finalizado';
                const bgColor = isFinalizado ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800';
                return `<span class="${bgColor} py-1 px-3 rounded-full text-xs">${status}</span>`;
            };

            const getEmailButton = (type, status, email, sentDate, reportStatus) => {
                const isSent = status.toLowerCase() === 'enviado';
                const isReportFinalized = reportStatus.toLowerCase() === 'finalizado';
                const isDisabled = !isReportFinalized;
                let buttonClass, buttonText, action;

                if (isDisabled) {
                    buttonClass = 'bg-gray-300 text-gray-500 cursor-not-allowed';
                    buttonText = isSent ? 'Enviado' : 'Enviar'; // Mantenemos el texto para consistencia visual
                } else {
                    if (isSent) {
                        buttonClass = 'bg-green-500 hover:bg-green-600 text-white';
                        buttonText = 'Enviado';
                    } else if (email) {
                        buttonClass = 'bg-blue-500 hover:bg-blue-600 text-white';
                        buttonText = 'Enviar';
                    } else {
                        buttonClass = 'bg-yellow-500 hover:bg-yellow-600 text-white';
                        buttonText = 'Añadir y Enviar';
                    }
                }
                const icon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>`;
                
                let titleAttr = '';
                if (isDisabled) {
                    titleAttr = `title="El informe debe estar 'Finalizado' para poder enviar correos."`;
                } else if (isSent && sentDate) {
                    const date = new Date(sentDate);
                    const formattedDate = `${date.toLocaleDateString('es-ES')} ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
                    titleAttr = `title="Enviado el: ${formattedDate}"`;
                }

                return `<button data-action="handle-email" data-email-type="${type}" class="flex items-center justify-center px-3 py-1 rounded-md text-xs transition-colors ${buttonClass}" ${isDisabled ? 'disabled' : ''} ${titleAttr}>${icon} <span>${buttonText}</span></button>`;
            };

            row.innerHTML = `
                <td class="py-3 px-6 text-left whitespace-nowrap">${datosPaciente.nombre || 'N/A'}</td>
                <td class="py-3 px-6 text-left">${datosPaciente.id_paciente || 'N/A'}</td>
                <td class="py-3 px-6 text-center">${protocoloEstudio.fecha_estudio || 'N/A'}</td>
                <td class="py-3 px-6 text-center">
                    <select data-action="change-status" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 capitalize">
                        <option value="creado" ${reportStatus.toLowerCase() === 'creado' ? 'selected' : ''}>Creado</option>
                        <option value="en proceso" ${reportStatus.toLowerCase() === 'en proceso' ? 'selected' : ''}>En Proceso</option>
                        <option value="finalizado" ${reportStatus === 'finalizado' ? 'selected' : ''}>Finalizado</option>
                    </select>
                </td>
                <td class="py-3 px-6 text-left">${protocoloEstudio.medico_interpreta || 'N/A'}</td>
                <td class="py-3 px-6 text-center">
                    ${getEmailButton('patient', patientEmailStatus, patientEmail, study.datePAtienteEmailSent, reportStatus)}
                </td>
                <td class="py-3 px-6 text-center">
                    ${getEmailButton('doctor', doctorEmailStatus, doctorEmail, study.dateDoctorEmailSent, reportStatus)}
                </td>
                <td class="py-3 px-6 text-center">
                    <div class="flex item-center justify-center gap-2">
                        <button data-study-id="${study.id}" data-action="view-report" class="w-6 h-6 text-blue-600 hover:text-blue-800 transform hover:scale-110" title="Ver Informe">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </button>
                        <a href="angioForm.html?studyId=${study.id}" class="w-6 h-6 text-yellow-600 hover:text-yellow-800 transform hover:scale-110" title="Editar">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 5.232z" />
                            </svg>
                        </a>
                        <button data-study-id="${study.id}" class="delete-btn w-6 h-6 text-red-600 hover:text-red-800 transform hover:scale-110" title="Eliminar">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Add event listeners for new actions
        document.querySelectorAll('[data-action="change-status"]').forEach(select => {
            select.addEventListener('change', async (e) => {
                const studyId = e.target.closest('tr').dataset.studyId;
                const previousStatus = allStudies.find(s => s.id === studyId)?.reportStatus;
                const newStatus = e.target.value;
                const study = allStudies.find(s => s.id === studyId);
                if (study) {
                    study.reportStatus = newStatus;
                    try {
                        await updateStudy(studyId, { reportStatus: newStatus });
                        notyf.success(`Estudio de "${study.datos_paciente?.nombre || 'ID: '+studyId}" actualizado a "${newStatus}".`);
                    } catch (error) {
                        console.error('Error al actualizar el estado:', error);
                        notyf.error('Error al actualizar el estado.');
                        e.target.value = previousStatus; // Revert UI change on failure
                    }
                }
            });
        });

        document.querySelectorAll('[data-action="handle-email"]').forEach(button => {
            button.addEventListener('click', async (e) => {
                const button = e.currentTarget;
                const studyId = e.target.closest('tr').dataset.studyId;
                const emailType = button.dataset.emailType;
                const study = allStudies.find(s => s.id === studyId);

                if (study) {
                    // Validación: El informe debe estar finalizado para enviar correos.
                    if (study.reportStatus?.toLowerCase() !== 'finalizado') {
                        notyf.error("El informe debe estar en estado 'Finalizado' para enviar el correo.");
                        return;
                    }

                    // Obtenemos el email actual para pre-rellenar el modal
                    const emailField = emailType === 'patient' ? 'paciente_email' : 'doctorEmail';
                    const currentEmail = getValueFromPath(study, `datos_paciente.${emailField}`) || getValueFromPath(study, `protocolo_estudio.${emailField}`);
                    const isSent = study.doctorEmailStatus === 'enviado' || study.patientEmailStatus === 'enviado';

                    // Siempre abrimos la modal
                    const titleAction = currentEmail ? (isSent ? 'Editar y Reenviar' : 'Editar y Enviar') : 'Añadir';
                    const titleEntity = emailType === 'patient' ? 'Paciente' : 'Médico';
                    emailModalTitle.textContent = `${titleAction} Correo para ${titleEntity}`;
                    
                    emailForm.dataset.studyId = studyId;
                    emailForm.dataset.emailType = emailType;
                    emailInputModal.value = currentEmail || ''; // Precargamos el email si existe
                    saveEmailBtn.textContent = isSent ? 'Guardar y Reenviar' : 'Guardar y Enviar';
                    emailModal.classList.remove('hidden');
                    emailInputModal.focus();
                }
            });
        });

        document.querySelectorAll('[data-action="view-report"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const studyId = e.currentTarget.dataset.studyId;
                const study = allStudies.find(s => s.id === studyId);
                if (study) {
                    // Guardar los datos del estudio en localStorage para que informe.html los pueda leer
                    localStorage.setItem('savedAngioTACStudy', JSON.stringify(study));
                    // Abrir la página del informe en una nueva pestaña
                    window.open('informe.html', '_blank');
                } else {
                    notyf.error('No se pudieron cargar los datos del estudio para generar el informe.');
                }
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const studyId = e.currentTarget.dataset.studyId;
                if (confirm('¿Está seguro de que desea eliminar este estudio?')) {
                    try {
                        await deleteStudy(studyId);
                        notyf.success('Estudio eliminado con éxito.');
                        allStudies = allStudies.filter(s => s.id !== studyId);
                        sortAndRender();
                    } catch (error) {
                        console.error('Error al eliminar el estudio:', error);
                        notyf.error('Error al eliminar el estudio.');
                    }
                }
            });
        });
    };

    const sortAndRender = (resetPage = false) => {
        const sortedStudies = [...allStudies].sort((a, b) => {
            const valA = getValueFromPath(a, sortKey);
            const valB = getValueFromPath(b, sortKey);

            const direction = sortDirection === 'asc' ? 1 : -1;

            if (sortKey === 'protocolo_estudio.fecha_estudio') {
                return (new Date(valA) - new Date(valB)) * direction;
            }

            return valA.localeCompare(valB, 'es', { sensitivity: 'base' }) * direction;
        });
        
        const searchTerm = searchInput.value.toLowerCase();
        const filteredStudies = sortedStudies.filter(study => {
            const datosPaciente = study.datos_paciente || {};
            const patientName = (datosPaciente.nombre || '').toLowerCase();
            const patientId = (datosPaciente.id_paciente || '').toLowerCase();
            const studyDate = (study.protocolo_estudio?.fecha_estudio || '').toLowerCase();
            const reportStatus = (study.reportStatus || '').toLowerCase();
            const medico = (study.protocolo_estudio?.medico_interpreta || '').toLowerCase();

            return patientName.includes(searchTerm) || patientId.includes(searchTerm) || studyDate.includes(searchTerm);
        });

        if (resetPage) {
            currentPage = 1;
        }

        renderTable(filteredStudies);
        updatePaginationControls(filteredStudies.length);
        updateHeaderArrows();
    };

    const updatePaginationControls = (totalItems) => {
        pageNavigation.innerHTML = '';
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (totalPages <= 1) {
            totalItemsInfo.textContent = `Total: ${totalItems} estudios.`;
            return;
        }

        const createButton = (text, page, isDisabled = false, isActive = false) => {
            const button = document.createElement('button');
            button.innerHTML = text;
            button.dataset.page = page;
            button.disabled = isDisabled;
            button.className = `px-3 py-1 rounded-md transition-colors ${isDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : (isActive ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100 border')}`;
            return button;
        };

        pageNavigation.appendChild(createButton('Anterior', currentPage - 1, currentPage === 1));

        for (let i = 1; i <= totalPages; i++) {
            pageNavigation.appendChild(createButton(i, i, false, i === currentPage));
        }

        pageNavigation.appendChild(createButton('Siguiente', currentPage + 1, currentPage === totalPages));

        pageNavigation.querySelectorAll('button[data-page]').forEach(button => {
            button.addEventListener('click', (e) => {
                currentPage = parseInt(e.currentTarget.dataset.page);
                sortAndRender();
            });
        });
    };

    tableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const key = header.dataset.sortKey;
            if (sortKey === key) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortKey = key;
                sortDirection = 'asc';
            }
            sortAndRender();
        });
    });

    // --- Email Modal Logic ---
    emailModalCloseBtn.addEventListener('click', () => {
        emailModal.classList.add('hidden');
    });

    emailForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const studyId = emailForm.dataset.studyId;
        const emailType = emailForm.dataset.emailType;
        const newEmail = emailInputModal.value;

        if (!studyId || !emailType || !newEmail) return;

        saveEmailBtn.disabled = true;
        saveEmailBtn.textContent = 'Guardando...';

        const emailField = emailType === 'patient' ? 'datos_paciente.paciente_email' : 'protocolo_estudio.doctorEmail';
        const statusField = emailType === 'patient' ? 'patientEmailStatus' : 'doctorEmailStatus';
        const dateField = emailType === 'patient' ? 'datePAtienteEmailSent' : 'dateDoctorEmailSent';

        try {
            // Actualizar el email en el estudio y marcar como enviado
            await updateStudy(studyId, {
                [emailField]: newEmail,
                [statusField]: 'enviado',
                [dateField]: new Date().toISOString()
            });

            notyf.success(`Correo guardado y enviado.`);
            emailModal.classList.add('hidden');

            // Actualizar la UI sin recargar todo
            const study = allStudies.find(s => s.id === studyId);
            if (study) {
                const pathParts = emailField.split('.');
                study[pathParts[0]][pathParts[1]] = newEmail;
                study[statusField] = 'enviado';
                sortAndRender(); // Re-render para reflejar el cambio
            }
        } catch (error) {
            console.error('Error al guardar el email:', error);
            notyf.error('No se pudo guardar el correo.');
        } finally {
            saveEmailBtn.disabled = false;
            // El texto del botón se actualiza al abrir el modal
        }
    });

    searchInput.addEventListener('input', () => sortAndRender(true));

    itemsPerPageSelect.addEventListener('change', (e) => {
        itemsPerPage = parseInt(e.target.value, 10);
        currentPage = 1;
        sortAndRender();
    });

    // Initial Load
    try {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center py-4">Cargando estudios...</td></tr>';
        allStudies = await getStudies();
        sortAndRender();
    } catch (error) {
        console.error('Error al obtener los estudios:', error);
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-red-500">Error al cargar los estudios.</td></tr>';
        notyf.error('No se pudieron cargar los estudios.');
    }
});