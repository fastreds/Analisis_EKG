import { getCurrentUser } from './auth.js';
import { getAllUsers, updateUserData, getUserData } from './firebaseLogic.js';

document.addEventListener('DOMContentLoaded', async () => {
    const userListContainer = document.getElementById('user-list-container');

    try {
        const user = await getCurrentUser();
        if (!user) {
            // auth.js ya debería redirigir, esto es un fallback.
            console.log("No user found, redirecting to login.");
            window.location.href = 'index.html';
            return;
        }

        // Verificar el rol del usuario actual
        const userData = await getUserData(user.uid);
        if (!userData || userData.role !== 'ADMINISTRADOR') {
            alert('Acceso denegado. Solo los administradores pueden ver esta página.');
            window.location.href = 'estudios.html'; // Redirigir a una página segura
            return;
        }

        loadUsers();

    } catch (error) {
        console.error("Error loading admin page:", error);
        userListContainer.innerHTML = '<p class="text-center text-red-500">Error al cargar la página de administración.</p>';
    }

    async function loadUsers() {
        userListContainer.innerHTML = '<p class="text-center text-gray-500">Cargando usuarios...</p>';
        try {
            const users = await getAllUsers();
            userListContainer.innerHTML = ''; // Limpiar mensaje de carga

            if (users.length === 0) {
                userListContainer.innerHTML = '<p class="text-center text-gray-500">No hay usuarios registrados.</p>';
                return;
            }

            users.forEach(u => {
                const userElement = document.createElement('div');
                userElement.className = 'flex flex-col md:flex-row items-center justify-between p-4 hover:bg-gray-50 transition-colors';
                userElement.innerHTML = `
                    <div class="mb-2 md:mb-0 md:w-1/3">
                        <p class="font-semibold text-gray-800">${u.nombre || 'N/A'}</p>
                        <p class="text-sm text-gray-600">${u.email}</p>
                    </div>
                    <div class="md:w-1/3 text-center md:text-left mb-2 md:mb-0">
                        <p class="text-sm text-gray-700">Teléfono: ${u.telefono || 'N/A'}</p>
                    </div>
                    <div class="md:w-1/3 flex justify-center md:justify-end items-center gap-2">
                        <select data-uid="${u.uid}" class="user-role-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5">
                            <option value="ASISTENTE" ${u.role === 'ASISTENTE' ? 'selected' : ''}>Asistente</option>
                            <option value="MÉDICO" ${u.role === 'MÉDICO' ? 'selected' : ''}>Médico</option>
                            <option value="ADMINISTRADOR" ${u.role === 'ADMINISTRADOR' ? 'selected' : ''}>Administrador</option>
                        </select>
                        <button data-uid="${u.uid}" class="save-role-btn bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors text-sm">Guardar</button>
                    </div>
                `;
                userListContainer.appendChild(userElement);
            });

            // Añadir event listeners para los cambios de rol
            userListContainer.querySelectorAll('.save-role-btn').forEach(button => {
                button.addEventListener('click', handleRoleChange);
            });

        } catch (error) {
            console.error("Error loading users:", error);
            userListContainer.innerHTML = '<p class="text-center text-red-500">Error al cargar los usuarios.</p>';
        }
    }

    async function handleRoleChange(event) {
        const button = event.target;
        const userId = button.dataset.uid;
        const selectElement = button.previousElementSibling; // El elemento select está justo antes del botón
        const newRole = selectElement.value;

        button.disabled = true;
        button.textContent = 'Guardando...';

        try {
            await updateUserData(userId, { role: newRole });
            button.textContent = 'Guardado';
            button.classList.remove('bg-blue-500', 'hover:bg-blue-600');
            button.classList.add('bg-green-500');
            setTimeout(() => {
                button.textContent = 'Guardar';
                button.classList.remove('bg-green-500');
                button.classList.add('bg-blue-500', 'hover:bg-blue-600');
                button.disabled = false;
            }, 2000);
        } catch (error) {
            console.error("Error updating user role:", error);
            button.textContent = 'Error';
            button.classList.remove('bg-blue-500', 'hover:bg-blue-600');
            button.classList.add('bg-red-500');
            setTimeout(() => {
                button.textContent = 'Guardar';
                button.classList.remove('bg-red-500');
                button.classList.add('bg-blue-500', 'hover:bg-blue-600');
                button.disabled = false;
            }, 2000);
        }
    }
});