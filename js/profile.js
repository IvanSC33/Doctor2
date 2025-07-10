// Profile Screen main rendering

// screenElements will be passed or accessed if this module needs to directly manipulate other screens,
// but for now, renderProfile just generates HTML for its own screen.
// import * as store from './store.js'; // Not needed for renderProfile itself
// import { showScreen as uiShowScreen } from './ui.js'; // Navigation is handled by navigation.js

let screenElementsGlobalRef; // To store screenElements.profile

export function initProfile(sElements) {
    screenElementsGlobalRef = sElements;
    // No specific event listeners to attach here for the main profile menu,
    // as they are handled by delegated listeners in navigation.js
    console.log("Profile module initialized.");
}

export function renderProfileScreen() {
    if (!screenElementsGlobalRef || !screenElementsGlobalRef.profile) return;

    screenElementsGlobalRef.profile.innerHTML = `
        <div class="text-center pt-4 pb-6">
            <img src="https://placehold.co/96x96/bfdbfe/1e3a8a?text=AP" alt="[Foto de la Dra. Ana Pérez]" class="w-24 h-24 rounded-full mx-auto mb-3" onerror="this.onerror=null;this.src='https://placehold.co/96x96/cccccc/333333?text=AP';">
            <h1 class="text-2xl font-bold text-gray-800">Dra. Ana Pérez</h1>
            <p class="text-gray-500">Medicina General</p>
        </div>
        <div class="space-y-3">
            <div class="profile-menu-item" data-target="financial"><span><i class="ph-wallet mr-3"></i>Gestión Financiera</span><i class="ph-caret-right"></i></div>
            <div class="profile-menu-item" data-target="development"><span><i class="ph-trophy mr-3"></i>Desarrollo Profesional</span><i class="ph-caret-right"></i></div>
            <div class="profile-menu-item" data-target="rewards"><span><i class="ph-gift mr-3"></i>Programa de Recompensas</span><i class="ph-caret-right"></i></div>
            <div class="profile-menu-item" data-target="referrals"><span><i class="ph-users-three mr-3"></i>Programa de Referidos</span><i class="ph-caret-right"></i></div>
            <div class="profile-menu-item" data-target="security"><span><i class="ph-key mr-3"></i>Seguridad de la Cuenta</span><i class="ph-caret-right"></i></div>
            <div class="profile-menu-item" data-target="support"><span><i class="ph-question mr-3"></i>Soporte y Ayuda</span><i class="ph-caret-right"></i></div>
        </div>
    `;
}
