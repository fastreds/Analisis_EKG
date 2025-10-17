import { getStudies, deleteStudy } from './firebaseLogic.js';

document.addEventListener('DOMContentLoaded', async () => {
    const searchInput = document.getElementById('search-input');
    const tableBody = document.getElementById('studies-table-body');
    let allStudies = [];

    const notyf = new Notyf({
        duration: 5000,
        position: { x: 'right', y: 'top' },
        types: [
            { type: 'success', background: 'green', icon: false },
            { type: 'error', background: 'indianred', duration: 8000, dismissible: true }
        ]
    });

    const renderTable = (studies) => {
        tableBody.innerHTML = ''; // Clear existing rows

        if (studies.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4">No hay estudios que coincidan con la búsqueda.</td></tr>';
            return;
        }

        studies.forEach(study => {
            const datosPaciente = study.datos_paciente || {};
            const protocoloEstudio = study.protocolo_estudio || {};
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-200 hover:bg-gray-100';

            // Status Badge
            const status = study.status || 'Borrador';
            const statusColor = status === 'Finalizado' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800';

            row.innerHTML = `
                <td class="py-3 px-6 text-left whitespace-nowrap">${datosPaciente.nombre || 'N/A'}</td>
                <td class="py-3 px-6 text-left">${datosPaciente.id_paciente || 'N/A'}</td>
                <td class="py-3 px-6 text-center">${protocoloEstudio.fecha_estudio || 'N/A'}</td>
                <td class="py-3 px-6 text-center">
                    <span class="${statusColor} py-1 px-3 rounded-full text-xs">${status}</span>
                </td>
                <td class="py-3 px-6 text-left">${protocoloEstudio.medico_interpreta || 'N/A'}</td>
                <td class="py-3 px-6 text-center">
                    <div class="flex item-center justify-center gap-4">
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

        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const studyId = e.currentTarget.dataset.studyId;
                if (confirm('¿Está seguro de que desea eliminar este estudio?')) {
                    try {
                        await deleteStudy(studyId);
                        notyf.success('Estudio eliminado con éxito.');
                        // Refetch and re-render data
                        allStudies = await getStudies();
                        renderTable(allStudies);
                    } catch (error) {
                        console.error('Error al eliminar el estudio:', error);
                        notyf.error('Error al eliminar el estudio.');
                    }
                }
            });
        });
    };

    const filterStudies = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredStudies = allStudies.filter(study => {
            const datosPaciente = study.datos_paciente || {};
            const protocoloEstudio = study.protocolo_estudio || {};
            const patientName = (datosPaciente.nombre || '').toLowerCase();
            const patientId = (datosPaciente.id_paciente || '').toLowerCase();
            const studyDate = (protocoloEstudio.fecha_estudio || '').toLowerCase();
            return patientName.includes(searchTerm) || patientId.includes(searchTerm) || studyDate.includes(searchTerm);
        });
        renderTable(filteredStudies);
    };

    searchInput.addEventListener('input', filterStudies);

    // Initial Load
    try {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4">Cargando estudios...</td></tr>';
        allStudies = await getStudies();
        renderTable(allStudies);
    } catch (error) {
        console.error('Error al obtener los estudios:', error);
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-red-500">Error al cargar los estudios.</td></tr>';
        notyf.error('No se pudieron cargar los estudios.');
    }
});
