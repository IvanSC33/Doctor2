// Authentication Flow (Onboarding, Register, Verify, Forgot Password)
import { showToast as uiShowToast, showScreen as uiShowScreen } from './ui.js';

// Store references passed from main script
let screenElements, navItemElements, headerElement, bottomNavElement, fabElement, screenRenderers;

// Wrapper to call the main showScreen function with all necessary arguments
function showScreen(screenName, data = null) {
    uiShowScreen(screenName, data, screenElements, navItemElements, headerElement, bottomNavElement, fabElement, screenRenderers);
}
// Wrapper for showToast
function showToast(message, isPoints = false) {
    uiShowToast(message, isPoints);
}


export function initAuth(sElements, nItems, hElement, bNavElement, fElement, sRenderers) {
    screenElements = sElements;
    navItemElements = nItems;
    headerElement = hElement;
    bottomNavElement = bNavElement;
    fabElement = fElement;
    screenRenderers = sRenderers; // Store the renderers object

    attachAuthEventListeners();
}

// --- Screen Rendering Functions (specific to auth flow) ---
// These were originally in the main script and are moved here.
// They modify the innerHTML of their respective screen elements.

function renderOnboardingScreen() {
    if (!screenElements.onboarding) return;
    screenElements.onboarding.innerHTML = `
        <div class="w-full max-w-sm text-center">
             <svg class="w-20 h-20 text-blue-600 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/></svg>
            <h1 class="text-2xl font-bold text-slate-800 mt-4">Bienvenida, Dra. Pérez</h1>
            <p class="text-slate-500 mt-1 mb-6">Ingrese a su cuenta para continuar.</p>
            <div class="space-y-4 text-left">
                 <input type="email" placeholder="Correo electrónico" value="ana.perez@vitalis.ai" class="w-full p-3 border border-slate-300 rounded-lg">
                 <input type="password" placeholder="Contraseña" value="************" class="w-full p-3 border border-slate-300 rounded-lg">
            </div>
            <a href="#" id="forgot-password-link" class="text-sm text-slate-600 mt-4 block text-center">Olvidé mi contraseña</a>
            <button id="login-btn" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-4">Iniciar Sesión</button>
            <p class="text-xs text-slate-500 mt-4">¿Nuevo en Vitalis? <a href="#" id="register-link" class="font-semibold text-blue-600">Regístrese aquí</a></p>
        </div>
    `;
}

function renderRegisterScreen() {
    if (!screenElements.register) return;
    screenElements.register.innerHTML = `
        <div class="flex items-center mb-4">
            <button id="back-to-login-from-register" class="text-2xl text-gray-600 mr-4"><i class="ph-arrow-left"></i></button>
            <h1 class="text-xl font-bold text-gray-800">Registro de Médico</h1>
        </div>
        <div class="space-y-4">
            <input type="text" placeholder="Nombre completo" class="w-full p-3 border border-slate-300 rounded-lg bg-white">
            <input type="tel" placeholder="Número de celular" class="w-full p-3 border border-slate-300 rounded-lg bg-white">
            <input type="text" placeholder="Número de CMP" class="w-full p-3 border border-slate-300 rounded-lg bg-white">
            <div>
                <label for="dni-upload" class="w-full text-center bg-white p-3 border border-slate-300 rounded-lg flex items-center justify-center gap-2 cursor-pointer">
                    <i class="ph-upload-simple"></i>
                    <span>Adjuntar DNI (Foto o PDF)</span>
                </label>
                <input type="file" id="dni-upload" class="hidden">
            </div>
            <input type="text" placeholder="Código de referido (opcional)" class="w-full p-3 border border-slate-300 rounded-lg bg-white">
            <div class="flex items-start space-x-3">
                <input type="checkbox" id="terms-checkbox" class="mt-1 h-4 w-4">
                <label for="terms-checkbox" class="text-xs text-gray-600">
                    He leído y acepto los <a href="#" class="text-blue-600 font-semibold">Términos y Condiciones</a> y la <a href="#" class="text-blue-600 font-semibold">Política de Privacidad</a> de Vitalis AI.
                </label>
            </div>
            <button id="register-form-btn" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-4">Registrarse</button>
        </div>
    `;
}

function renderVerifySignatureScreen() {
    if (!screenElements.verifySignature) return;
    screenElements.verifySignature.innerHTML = `
        <div class="w-full max-w-sm text-center">
            <i class="ph-fingerprint text-6xl text-blue-600"></i>
            <h1 class="text-2xl font-bold text-slate-800 mt-4">Validación de Doble Firma</h1>
            <p class="text-slate-500 mt-1 mb-6">Hemos enviado un código de 6 dígitos a tu celular para confirmar tu identidad.</p>
            <input type="text" id="signature-code" placeholder="------" maxlength="6" class="w-full text-center tracking-[1em] text-3xl font-bold p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none mb-6">
            <button id="verify-signature-btn" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">Confirmar Firma</button>
            <button class="back-to-login-btn text-sm text-slate-600 mt-4">Volver al Inicio de Sesión</button>
        </div>
    `;
}

function renderRegisterSuccessScreen() {
    if (!screenElements.registerSuccess) return;
    screenElements.registerSuccess.innerHTML = `
        <i class="ph-check-circle text-6xl text-green-500"></i>
        <h1 class="text-2xl font-bold text-gray-800 mt-4">¡Registro Enviado!</h1>
        <p class="text-gray-600 mt-2 max-w-sm">Gracias por unirte a Vitalis AI. Nuestro equipo administrativo validará tus credenciales y documentos.</p>
        <p class="text-gray-600 mt-2 max-w-sm">Recibirás una notificación por correo y SMS en un plazo de 24-48 horas una vez que tu perfil sea aprobado y habilitado para atender citas.</p>
        <button class="back-to-login-btn w-full max-w-sm bg-blue-600 text-white py-3 rounded-lg font-semibold mt-8">Volver al Inicio de Sesión</button>
    `;
}

function renderForgotPasswordScreen() {
    if (!screenElements.forgotPassword) return;
    screenElements.forgotPassword.innerHTML = `
         <div class="w-full max-w-sm text-center">
            <i class="ph-key text-6xl text-blue-600"></i>
            <h1 class="text-2xl font-bold text-slate-800 mt-4">Recuperar Contraseña</h1>
            <p class="text-slate-500 mt-1 mb-6">Ingresa tu correo electrónico registrado y te enviaremos las instrucciones.</p>
            <input type="email" placeholder="Correo electrónico" class="w-full p-3 border border-slate-300 rounded-lg bg-white mb-4">
            <button id="recover-password-btn" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">Recuperar Contraseña</button>
            <button class="back-to-login-btn text-sm text-slate-600 mt-4">Volver al Inicio de Sesión</button>
        </div>
    `;
}

function renderForgotSuccessScreen() {
    if (!screenElements.forgotSuccess) return;
     screenElements.forgotSuccess.innerHTML = `
        <i class="ph-paper-plane-tilt text-6xl text-green-500"></i>
        <h1 class="text-2xl font-bold text-gray-800 mt-4">Correo Enviado</h1>
        <p class="text-gray-600 mt-2 max-w-sm">Se han enviado las instrucciones para recuperar tu contraseña a tu correo electrónico.</p>
        <button class="back-to-login-btn w-full max-w-sm bg-blue-600 text-white py-3 rounded-lg font-semibold mt-8">Volver al Inicio de Sesión</button>
    `;
}


// --- Event Listeners for Auth Flow ---
function attachAuthEventListeners() {
    document.body.addEventListener('click', (e) => {
        // Email Login Screen specific button
        if (e.target.closest('#email-login-btn')) {
            // Add basic validation for email/password fields if desired
            const emailInput = document.querySelector('#screen-email-login input[type="email"]');
            const passwordInput = document.querySelector('#screen-email-login input[type="password"]');
            if (emailInput && emailInput.value && passwordInput && passwordInput.value) {
                showToast("Iniciando sesión...");
                setTimeout(() => {
                    if(showScreenFunc) showScreenFunc('home');
                }, 1500);
            } else {
                showToast("Por favor ingrese correo y contraseña.");
            }
        }

        // Existing auth buttons (onboarding, register, verify, forgot)
        if (e.target.closest('#login-btn')) { // This is the main login on original onboarding, may need adjustment if screen-onboarding is removed/changed
            showToast("Iniciando sesión...");
            setTimeout(() => {
                if(showScreenFunc) showScreenFunc('home');
            }, 1500);
        }
        // register-link is now on landing.js, handled there.
        // if (e.target.closest('#register-link')) {
        //     e.preventDefault();
        //     if(showScreenFunc) showScreenFunc('register');
        // }

        if (e.target.closest('#register-form-btn')) {
            const termsCheckbox = document.getElementById('terms-checkbox');
            if (!termsCheckbox?.checked) {
                showToast('Debe aceptar los términos y condiciones.');
                return;
            }
            if(showScreenFunc) showScreenFunc('verifySignature');
        }
        if (e.target.closest('#verify-signature-btn')) {
            const codeInput = document.getElementById('signature-code');
            if (!codeInput || codeInput.value.length < 6) {
                showToast('Por favor ingrese el código de 6 dígitos.');
                return;
            }
            if(showScreenFunc) showScreenFunc('registerSuccess'); // This will trigger the timeout for home navigation
        }
        if (e.target.closest('#forgot-password-link')) { // This might be on the new email-login screen
            e.preventDefault();
            if(showScreenFunc) showScreenFunc('forgotPassword');
        }
        if (e.target.closest('#email-forgot-password-link')) { // Specific link from new email login screen
             e.preventDefault();
            if(showScreenFunc) showScreenFunc('forgotPassword');
        }
        if (e.target.closest('#recover-password-btn')) {
            if(showScreenFunc) showScreenFunc('forgotSuccess');
        }
    });
}


export function renderEmailLoginScreen() {
    if (!screenElements || !screenElements.emailLogin) return;
    screenElements.emailLogin.innerHTML = `
        <div class="w-full max-w-sm text-center p-6">
            <button class="back-to-landing-btn text-gray-600 absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full">
                <i class="ph-arrow-left text-2xl"></i>
            </button>
            <svg class="w-20 h-20 text-blue-600 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/></svg>
            <h1 class="text-2xl font-bold text-slate-800 mt-4">Iniciar Sesión</h1>
            <p class="text-slate-500 mt-1 mb-6">Ingresa con tu correo electrónico.</p>
            <div class="space-y-4 text-left">
                 <input type="email" placeholder="Correo electrónico" value="ana.perez@vitalis.ai" class="w-full p-3 border border-slate-300 rounded-lg bg-white">
                 <input type="password" placeholder="Contraseña" value="************" class="w-full p-3 border border-slate-300 rounded-lg bg-white">
            </div>
            <a href="#" id="email-forgot-password-link" class="text-sm text-slate-600 mt-4 block text-center">Olvidé mi contraseña</a>
            <button id="email-login-btn" class="btn-primary w-full mt-4">Iniciar Sesión</button>
            <p class="text-xs text-slate-500 mt-6">
                <button class="back-to-landing-btn font-semibold text-blue-600 hover:underline">Volver a opciones de ingreso</button>
            </p>
        </div>
    `;
    // Add listener for the new back button if not handled by global navigation
    const backButton = screenElements.emailLogin.querySelector('.back-to-landing-btn');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            if(showScreenFunc) showScreenFunc('landing');
        });
    }
     const backButtonBottom = screenElements.emailLogin.querySelector('p > .back-to-landing-btn');
    if (backButtonBottom) {
        backButtonBottom.addEventListener('click', (e) => {
            e.preventDefault();
            if(showScreenFunc) showScreenFunc('landing');
        });
    }
}


// Make auth screen renderers available to the main script if needed for the screenRenderers object
export const authScreenRenderers = {
    onboarding: renderOnboardingScreen, // This might become obsolete or merged with emailLogin
    emailLogin: renderEmailLoginScreen, // New
    register: renderRegisterScreen,
    verifySignature: renderVerifySignatureScreen,
    registerSuccess: renderRegisterSuccessScreen,
    forgotPassword: renderForgotPasswordScreen,
    forgotSuccess: renderForgotSuccessScreen,
};
