import { auth } from './firebaseLogic.js';
import { onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    const loginError = document.getElementById('login-error');

    // Redirect if user is already logged in
    onAuthStateChanged(auth, user => {
        if (user) {
            window.location.href = 'angioForm.html';
        }
    });

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            loginBtn.disabled = true;
            loginBtn.textContent = 'Ingresando...';
            loginError.classList.add('hidden');

            try {
                await signInWithEmailAndPassword(auth, email, password);
                // The onAuthStateChanged listener will handle the redirect
            } catch (error) {
                console.error("Login failed:", error);
                loginError.textContent = "Correo o contraseña incorrectos.";
                loginError.classList.remove('hidden');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Ingresar';
            }
        });
    }
});