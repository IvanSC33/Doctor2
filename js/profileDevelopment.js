import * as store from './store.js';
// import { showScreen as uiShowScreen } from './ui.js'; // If needed for specific navigation from this screen not covered by global nav

let screenElementsGlobalRef;

export function initProfileDevelopment(sElements) {
    screenElementsGlobalRef = sElements;
    // Attach any specific event listeners for the development screen here if not handled globally
    console.log("Profile Development module initialized.");
}

export function renderDevelopmentScreen() {
    if (!screenElementsGlobalRef || !screenElementsGlobalRef.development) return;

    screenElementsGlobalRef.development.innerHTML = `
        <div class="flex items-center mb-4">
            <button class="back-to-profile text-2xl text-gray-600 mr-4"><i class="ph-arrow-left"></i></button>
            <h1 class="text-xl font-bold text-gray-800">Desarrollo Profesional</h1>
        </div>
        <div class="bg-white p-4 rounded-lg border mb-4">
              <div>
                <div class="flex justify-between items-center text-sm font-semibold mb-1">
                    <span>${store.professionalData.level}</span>
                    <span>${store.professionalData.nextLevel}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-yellow-400 h-2.5 rounded-full" style="width: ${Math.min((store.professionalData.points / store.professionalData.nextLevelPoints) * 100, 100)}%"></div>
                </div>
                <p class="text-center text-xs text-gray-500 mt-1">Faltan ${Math.max(0, store.professionalData.nextLevelPoints - store.professionalData.points)} puntos para el siguiente nivel</p>
            </div>
        </div>
        <div class="text-center bg-white p-4 rounded-lg border mb-6">
            <i class="ph-trophy text-5xl text-yellow-500"></i>
            <p id="points-balance-dev" class="text-2xl font-bold text-gray-800 mt-2">${store.professionalData.points.toLocaleString()} Puntos Vitalis</p>
            <p class="text-sm text-gray-500">Nivel: ${store.professionalData.level}</p>
        </div>
        <div class="space-y-3">
            <div class="profile-menu-item" data-target="communityForum"><span><i class="ph-chats-circle mr-3"></i>Comunidad y Foros</span><i class="ph-caret-right"></i></div>
            <div class="profile-menu-item" data-target="courses"><span><i class="ph-graduation-cap mr-3"></i>Cursos y Capacitación</span><i class="ph-caret-right"></i></div>
        </div>
    `;
    // Note: data-target="courses" is new, implies a 'courses' screen might be needed or this is a placeholder.
}
