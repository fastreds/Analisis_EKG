import { getCurrentUser } from './auth.js';
import { getUserData, updateUserData, uploadFile } from './firebaseLogic.js';

document.addEventListener('DOMContentLoaded', async () => {
    const statusMessage = document.getElementById('status-message');
    const profileForm = document.getElementById('profile-form');
    const imagenInput = document.getElementById('imagen');
    const imagenPreview = document.getElementById('imagen-preview');
    const firmaInput = document.getElementById('firma');
    const firmaPreview = document.getElementById('firma-preview');

    try {
        const user = await getCurrentUser();
        if (!user) {
            // The auth.js script should have already redirected.
            // This is a fallback.
            console.log("No user found, redirecting to login.");
            window.location.href = 'index.html';
            return;
        }

        // Populate form with existing user data
        document.getElementById('email').value = user.email;

        const userData = await getUserData(user.uid);
        if (userData) {
            document.getElementById('nombre').value = userData.nombre || '';
            document.getElementById('telefono').value = userData.telefono || '';
            document.getElementById('role').value = userData.role || 'ASISTENTE';
            if (userData.imagenUrl) {
                imagenPreview.src = userData.imagenUrl;
                imagenPreview.style.display = 'block';
            }
            if (userData.firmaUrl) {
                firmaPreview.src = userData.firmaUrl;
                firmaPreview.style.display = 'block';
            }
        }

        // Event Listeners
        imagenInput.addEventListener('change', (e) => handleFilePreview(e, imagenPreview));
        firmaInput.addEventListener('change', (e) => handleFilePreview(e, firmaPreview));

        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = profileForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Guardando...';
            statusMessage.textContent = '';

            try {
                const updatedData = {
                    nombre: document.getElementById('nombre').value,
                    telefono: document.getElementById('telefono').value,
                };

                // Handle file uploads
                if (imagenInput.files[0]) {
                    const imagePath = `profile_images/${user.uid}/${imagenInput.files[0].name}`;
                    updatedData.imagenUrl = await uploadFile(imagenInput.files[0], imagePath);
                }
                if (firmaInput.files[0]) {
                    const firmaPath = `signatures/${user.uid}/${firmaInput.files[0].name}`;
                    updatedData.firmaUrl = await uploadFile(firmaInput.files[0], firmaPath);
                }

                await updateUserData(user.uid, updatedData);

                statusMessage.textContent = '¡Perfil actualizado con éxito!';
                statusMessage.className = 'text-green-500 text-center';
            } catch (error) {
                console.error("Error updating profile:", error);
                statusMessage.textContent = 'Error al actualizar el perfil.';
                statusMessage.className = 'text-red-500 text-center';
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Guardar Cambios';
            }
        });

    } catch (error) {
        console.error("Error loading profile:", error);
        statusMessage.textContent = 'Error al cargar el perfil.';
        statusMessage.className = 'text-red-500 text-center';
    }
});

function handleFilePreview(event, previewElement) {
    const file = event.target.files[0];
    if (file) {
        previewElement.src = URL.createObjectURL(file);
        previewElement.style.display = 'block';
    }
}