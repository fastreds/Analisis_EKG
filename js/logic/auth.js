import { auth, getUserData } from './firebaseLogic.js';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// --- Estado de Autenticación y Gestión de UI ---

let currentUser = null;

const authPromise = new Promise((resolve, reject) => {
    onAuthStateChanged(auth, user => {
        currentUser = user;
        resolve(user);
    }, reject);
});

export const getCurrentUser = () => authPromise;


document.addEventListener('DOMContentLoaded', async () => {
    const user = await getCurrentUser();
    const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

    if (user) {
        // Si el usuario está logueado
        if (isLoginPage) {
            window.location.href = 'estudios.html'; // Redirigir desde el login a la página principal
        } else {
            // En otras páginas, configurar la UI
            setupUIForLoggedInUser(user);
        }
    } else {
        // Si el usuario NO está logueado
        if (!isLoginPage) {
            window.location.href = 'index.html'; // Proteger páginas y redirigir al login
        }
    }

    // --- Manejadores de Eventos ---

    // Formulario de Login (solo en index.html)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Botón de Logout (en todas las páginas excepto index.html)
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout); // Corregido para usar el ID correcto
    }
});

async function setupUIForLoggedInUser(user) {
    const userInfoDiv = document.getElementById('user-info');
    if (userInfoDiv) {
        userInfoDiv.classList.remove('hidden');
    }

    // Mostrar email del usuario
    const userEmailSpan = document.getElementById('user-email');
    if (userEmailSpan) {
        userEmailSpan.textContent = user.email;
    }

    // Verificar si el usuario es administrador para mostrar el enlace de gestión
    const userData = await getUserData(user.uid);
    if (userData && userData.role === 'ADMINISTRADOR') {
        const adminUsersLink = document.getElementById('admin-users-link');
        if (adminUsersLink) {
            adminUsersLink.style.display = 'block';
        }
    }

    // El botón de logout ya tiene un listener en DOMContentLoaded,
    // así que no necesitamos añadir otro aquí.
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.classList.remove('hidden');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const loginBtn = document.getElementById('login-btn');
    const loginError = document.getElementById('login-error');
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    loginBtn.disabled = true;
    loginBtn.textContent = 'Ingresando...';
    loginError.classList.add('hidden');

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'estudios.html';
    } catch (error) {
        console.error("Login failed:", error);
        loginError.textContent = "Correo o contraseña incorrectos.";
        loginError.classList.remove('hidden');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Ingresar';
    }
}

async function handleLogout() {
    try {
        await signOut(auth);
        console.log("Cierre de sesión exitoso");
        window.location.href = 'index.html'; // Redirigir al usuario al login
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
}
