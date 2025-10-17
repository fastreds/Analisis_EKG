import { getStudies, deleteStudy, updateStudy } from './firebaseLogic.js';

document.addEventListener('DOMContentLoaded', async () => {
    const searchInput = document.getElementById('search-input');
    const tableBody = document.getElementById('studies-table-body');
    const tableHeaders = document.querySelectorAll('th[data-sort-key]');
    let allStudies = [];
    let sortKey = 'protocolo_estudio.fecha_estudio';
    let sortDirection = 'desc';

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

    const renderTable = (studies) => {
        tableBody.innerHTML = ''; // Clear existing rows

        if (studies.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" class="text-center py-4">No hay estudios que coincidan con la búsqueda.</td></tr>';
            return;
        }

        studies.forEach(study => {
            const datosPaciente = study.datos_paciente || {};
            const protocoloEstudio = study.protocolo_estudio || {};
            const medicoReferente = study.protocolo_estudio || {};
            const row = document.createElement('tr');
            row.dataset.studyId = study.id;
            row.className = 'border-b border-gray-200 hover:bg-gray-100';

            const reportStatus = study.reportStatus || 'borrador';
            const patientEmailStatus = study.patientEmailStatus || 'no enviado';
            const doctorEmailStatus = study.doctorEmailStatus || 'no enviado';

            const patientEmail = datosPaciente.paciente_email || null;
            const doctorEmail = medicoReferente.medico_email || null; // Asumiendo que el email del médico está aquí

            const getStatusBadge = (status) => {
                const isFinalizado = status.toLowerCase() === 'finalizado';
                const bgColor = isFinalizado ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800';
                return `<span class="${bgColor} py-1 px-3 rounded-full text-xs">${status}</span>`;
            };

            const getEmailButton = (type, status, email, sentDate) => {
                const isSent = status.toLowerCase() === 'enviado';
                const isDisabled = !email || isSent;
                const buttonClass = isSent ? 'bg-green-500 text-white' : (email ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed');
                const buttonText = isSent ? 'Enviado' : 'Enviar';
                const icon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>`;
                
                let titleAttr = '';
                if (isSent && sentDate) {
                    const date = new Date(sentDate);
                    const formattedDate = `${date.toLocaleDateString('es-ES')} ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
                    titleAttr = `title="Enviado el: ${formattedDate}"`;
                }

                return `<button data-action="send-email" data-email-type="${type}" class="flex items-center justify-center px-3 py-1 rounded-md text-xs transition-colors ${buttonClass}" ${isDisabled ? 'disabled' : ''} ${titleAttr}>${icon} <span>${buttonText}</span></button>`;
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
                    ${getEmailButton('patient', patientEmailStatus, patientEmail, study.datePAtienteEmailSent)}
                </td>
                <td class="py-3 px-6 text-center">
                    ${getEmailButton('doctor', doctorEmailStatus, doctorEmail, study.dateDoctorEmailSent)}
                </td>
                <td class="py-3 px-6 text-center">
                    <div class="flex item-center justify-center gap-2">
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

        document.querySelectorAll('[data-action="send-email"]').forEach(button => {
            button.addEventListener('click', async (e) => {
                const studyId = e.target.closest('tr').dataset.studyId;
                const emailType = e.currentTarget.dataset.emailType;
                const study = allStudies.find(s => s.id === studyId);

                if (study) {
                    const fieldToUpdate = emailType === 'patient' ? 'patientEmailStatus' : 'doctorEmailStatus';
                    const dateFieldToUpdate = emailType === 'patient' ? 'datePAtienteEmailSent' : 'dateDoctorEmailSent';
                    
                    // Simulate sending email
                    console.log(`Simulando envío de email a ${emailType} para el estudio ${studyId}`);
                    
                    try {
                        await updateStudy(studyId, { 
                            [fieldToUpdate]: 'enviado',
                            [dateFieldToUpdate]: new Date().toISOString()
                        });
                        notyf.success(`Email para ${emailType} marcado como enviado.`);
                        const buttonTextSpan = e.currentTarget.querySelector('span');
                        if (buttonTextSpan) {
                            buttonTextSpan.textContent = 'Enviado';
                        }
                        e.currentTarget.classList.replace('bg-blue-500', 'bg-green-500');
                        e.currentTarget.disabled = true;
                    } catch (error) {
                        console.error(`Error al actualizar estado de email para ${emailType}:`, error);
                        notyf.error('Error al actualizar el estado del email.');
                    }
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

    const sortAndRender = () => {
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

        renderTable(filteredStudies);
        updateHeaderArrows();
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

    searchInput.addEventListener('input', sortAndRender);

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