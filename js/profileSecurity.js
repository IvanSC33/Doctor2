import * as store from './store.js';
import { showModal, hideModal, showToast } from './ui.js';
// It's likely that adding/changing payment methods will now primarily be handled by profileFinancial.js modals.
// This module will render the display and potentially trigger those modals or simple security actions.
// import { showAddBankAccountModal, showAddYapePlinModal } from './profileFinancial.js'; // Example if we need to call them

let screenElementsGlobalRef;
let showScreenFunc; // To call _showScreenWrapper for navigation if needed
let screenRenderersFromMainRef; // To re-render dependent screens like financial if a payment method is changed here (unlikely now)

export function initProfileSecurity(sElements, sShowScreenFunc, sRenderers) {
    screenElementsGlobalRef = sElements;
    showScreenFunc = sShowScreenFunc;
    screenRenderersFromMainRef = sRenderers;
    attachSecurityEventListeners();
}

function renderPaymentMethodDetails() {
    const bankContainer = document.getElementById('bank-account-details-container');
    const yapeContainer = document.getElementById('yape-details-container');
    const plinContainer = document.getElementById('plin-details-container');

    // Bank Account
    const defaultAccount = store.financialData.bankAccounts[0];
    if (bankContainer) {
        if (defaultAccount) {
            bankContainer.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3"><i class="ph-bank text-2xl text-gray-500"></i><div><p class="font-semibold text-gray-800">${defaultAccount.holderName}</p><p class="text-sm text-gray-500">${defaultAccount.bank} - **** ${defaultAccount.accountNumber.slice(-4)}</p></div></div>
                    <button class="change-payment-method-btn text-blue-600 font-semibold text-sm" data-method-type="savings" data-action-type="change">Cambiar</button>
                </div>`;
        } else {
            bankContainer.innerHTML = `
                <div class="flex justify-between items-center"><p class="text-gray-500">Cuenta Bancaria no registrada</p><button class="add-payment-method-btn text-blue-600 font-semibold text-sm" data-method-type="savings" data-action-type="add">Añadir</button></div>`;
        }
    }

    // Yape
    if (yapeContainer) {
        if (store.financialData.yape && store.financialData.yape.number) {
            yapeContainer.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3"><img src="https://seeklogo.com/images/Y/yape-logo-343361418C-seeklogo.com.png" alt="Yape" class="h-6"><div><p class="font-semibold text-gray-800">${store.financialData.yape.name}</p><p class="text-sm text-gray-500">${store.financialData.yape.number}</p></div></div>
                    <button class="change-payment-method-btn text-blue-600 font-semibold text-sm" data-method-type="yape" data-action-type="change">Cambiar</button>
                </div>`;
        } else {
            yapeContainer.innerHTML = `
                <div class="flex justify-between items-center"><div class="flex items-center gap-3"><img src="https://seeklogo.com/images/Y/yape-logo-343361418C-seeklogo.com.png" alt="Yape" class="h-6 opacity-50"><p class="text-gray-500">Yape no registrado</p></div><button class="add-payment-method-btn text-blue-600 font-semibold text-sm" data-method-type="yape" data-action-type="add">Añadir</button></div>`;
        }
    }

    // Plin
    if (plinContainer) {
        if (store.financialData.plin && store.financialData.plin.number) {
            plinContainer.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3"><img src="https://www.plin.com.pe/logo-plin.png" alt="Plin" class="h-5"><div><p class="font-semibold text-gray-800">${store.financialData.plin.name}</p><p class="text-sm text-gray-500">${store.financialData.plin.number}</p></div></div>
                    <button class="change-payment-method-btn text-blue-600 font-semibold text-sm" data-method-type="plin" data-action-type="change">Cambiar</button>
                </div>`;
        } else {
            plinContainer.innerHTML = `
                <div class="flex justify-between items-center"><div class="flex items-center gap-3"><img src="https://www.plin.com.pe/logo-plin.png" alt="Plin" class="h-5 opacity-50"><p class="text-gray-500">Plin no registrado</p></div><button class="add-payment-method-btn text-blue-600 font-semibold text-sm" data-method-type="plin" data-action-type="add">Añadir</button></div>`;
        }
    }
}

export function renderSecurityScreen() {
    if (!screenElementsGlobalRef || !screenElementsGlobalRef.security) return;

    screenElementsGlobalRef.security.innerHTML = `
        <div class="flex items-center mb-4">
            <button class="back-to-profile text-2xl text-gray-600 mr-4"><i class="ph-arrow-left"></i></button>
            <h1 class="text-xl font-bold text-gray-800">Seguridad de la Cuenta</h1>
        </div>
        <div class="space-y-4">
            <div>
                <h3 class="font-semibold text-gray-700 mb-2">Métodos de Retiro</h3>
                <div class="space-y-2">
                    <div id="bank-account-details-container" class="bg-white p-4 rounded-lg border"></div>
                    <div id="yape-details-container" class="bg-white p-4 rounded-lg border"></div>
                    <div id="plin-details-container" class="bg-white p-4 rounded-lg border"></div>
                </div>
            </div>
            <div>
                <h3 class="font-semibold text-gray-700 mb-2">Autenticación</h3>
                <div class="space-y-2">
                    <button id="change-password-btn" class="w-full text-left bg-white p-4 rounded-lg border">Cambiar Contraseña</button>
                    <div class="bg-white p-4 rounded-lg border flex justify-between items-center">
                        <span>Autenticación de 2 Factores</span>
                        <div id="2fa-toggle" class="relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer bg-gray-300">
                            <span id="2fa-toggle-indicator" class="inline-block w-4 h-4 transform bg-white rounded-full" style="transform: translateX(4px);"></span>
                        </div>
                    </div>
                </div>
            </div>
             <div>
                <h3 class="font-semibold text-gray-700 mb-2">Cursos de Seguridad</h3>
                <div class="space-y-2">
                    <div class="profile-menu-item"><span>Protección de Datos de Pacientes (HIPAA)</span><i class="ph-caret-right"></i></div>
                    <div class="profile-menu-item"><span>Mejores Prácticas de Ciberseguridad</span><i class="ph-caret-right"></i></div>
                </div>
            </div>
            <div>
                <button id="logout-btn" class="w-full text-left bg-white p-4 rounded-lg border text-red-600 font-semibold">Cerrar Sesión</button>
            </div>
        </div>
    `;
    renderPaymentMethodDetails(); // Call after main structure is in DOM
}


function openChangePasswordModal() {
    showModal(`
        <div class="modal-overlay visible">
            <div class="modal-content">
                 <div class="flex justify-between items-center mb-4"><h2 class="font-bold text-lg text-gray-800">Cambiar Contraseña</h2><button class="modal-close-btn text-gray-500"><i class="ph-x text-xl"></i></button></div>
                <div class="space-y-3">
                    <input type="password" id="current-password" placeholder="Contraseña Actual" class="w-full p-2 border rounded-md">
                    <input type="password" id="new-password" placeholder="Nueva Contraseña" class="w-full p-2 border rounded-md">
                    <input type="password" id="confirm-new-password" placeholder="Confirmar Nueva Contraseña" class="w-full p-2 border rounded-md">
                </div>
                 <div class="flex space-x-2 mt-6">
                    <button class="modal-close-btn w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold">Cancelar</button>
                    <button id="confirm-password-change-btn" class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">Guardar Cambios</button>
                </div>
            </div>
        </div>`);
}

function attachSecurityEventListeners() {
    document.body.addEventListener('click', (e) => {
        // Ensure events are only handled if security screen is active or relevant modal is open
        const isSecurityScreenActive = screenElementsGlobalRef.security && !screenElementsGlobalRef.security.classList.contains('hidden');
        const isModalActive = document.querySelector('#modal-container .modal-overlay.visible');

        if (!isSecurityScreenActive && !isModalActive) return;


        if (e.target.closest('#change-password-btn')) {
            openChangePasswordModal();
        }
        if (e.target.closest('#confirm-password-change-btn')) {
            // Basic validation, real app would have more
            const newPass = document.getElementById('new-password')?.value;
            const confirmPass = document.getElementById('confirm-new-password')?.value;
            if (newPass && newPass === confirmPass) {
                hideModal();
                showToast("Contraseña actualizada correctamente.");
            } else {
                showToast("Las nuevas contraseñas no coinciden o están vacías.");
            }
        }
        if (e.target.closest('#logout-btn')) {
            showToast("Cerrando sesión...");
            setTimeout(() => {
                if (showScreenFunc) showScreenFunc('onboarding'); // Use the passed showScreen function
            }, 1500);
        }
        if (e.target.closest('#2fa-toggle')) {
            const toggle = e.target.closest('#2fa-toggle');
            const indicator = toggle.querySelector('#2fa-toggle-indicator');
            toggle.classList.toggle('bg-green-500'); // Simplified toggle
            toggle.classList.toggle('bg-gray-300');
            if (toggle.classList.contains('bg-green-500')) {
                indicator.style.transform = 'translateX(22px)';
                showToast("Autenticación de 2 factores activada.");
            } else {
                indicator.style.transform = 'translateX(4px)';
                showToast("Autenticación de 2 factores desactivada.");
            }
        }

        // Handling for add/change payment method buttons
        // These should now ideally open modals handled by profileFinancial.js
        // For now, they will just log, or if we import financial functions, they could call them.
        const paymentMethodBtn = e.target.closest('.add-payment-method-btn, .change-payment-method-btn');
        if (paymentMethodBtn) {
            const methodType = paymentMethodBtn.dataset.methodType;
            // const actionType = paymentMethodBtn.dataset.actionType; // 'add' or 'change'
            // Here, you would typically call a function that shows the appropriate modal from profileFinancial.js
            // e.g., if (methodType === 'savings') profileFinancial.showAddBankAccountModal();
            showToast(`Acción para ${methodType} (simulado). Implementar apertura de modal financiero.`);
            // Example: if you had imported showAddBankAccountModal from profileFinancial.js
            // if (methodType === 'savings' && typeof showAddBankAccountModal === 'function') {
            //     showAddBankAccountModal();
            // } // This requires profileFinancial.js to export these modal openers.
        }
    });
}
