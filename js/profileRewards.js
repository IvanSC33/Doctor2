import * as store from './store.js';
import { showModal, hideModal, showToast, animateSlotMachine } from './ui.js';

let screenElementsGlobalRef;

export function initProfileRewards(sElements) {
    screenElementsGlobalRef = sElements;
    attachRewardsEventListeners();
}

export function renderRewardsScreen() {
    if (!screenElementsGlobalRef || !screenElementsGlobalRef.rewards) return;

    screenElementsGlobalRef.rewards.innerHTML = `
        <div class="flex items-center mb-4">
            <button class="back-to-profile text-2xl text-gray-600 mr-4"><i class="ph-arrow-left"></i></button>
            <h1 class="text-xl font-bold text-gray-800">Programa de Recompensas</h1>
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

        <div class="text-center bg-white p-4 rounded-lg border mb-4">
            <i class="ph-trophy text-5xl text-yellow-500"></i>
            <p id="points-balance-rewards" class="text-2xl font-bold text-gray-800 mt-2">${store.professionalData.points.toLocaleString()} Puntos Vitalis</p>
            <p class="text-sm text-gray-500">Disponibles para canjear</p>
        </div>

        <div>
            <h2 class="font-bold text-gray-800 text-lg mb-3">Catálogo de Recompensas</h2>
            <div id="rewards-catalog" class="space-y-3">
                ${store.professionalData.rewards.map(reward => {
                    const canAfford = store.professionalData.points >= reward.cost;
                    let buttonText = reward.type === 'apply' ? 'Postular' : 'Canjear';
                    let buttonDisabled = !canAfford;
                    let buttonClass = canAfford ? 'bg-blue-600 text-white' : 'bg-blue-300 text-white cursor-not-allowed';

                    if (reward.status === 'applied') {
                        buttonText = 'Postulación Enviada';
                        buttonDisabled = true;
                        buttonClass = 'bg-yellow-500 text-white cursor-not-allowed';
                    } else if (reward.claimed) {
                        buttonText = 'Canjeado';
                        buttonDisabled = true;
                        buttonClass = 'bg-gray-300 text-gray-500 cursor-not-allowed';
                    }

                    return `
                    <div class="bg-white p-4 rounded-lg border">
                        <h3 class="font-bold text-gray-800">${reward.title}</h3>
                        <p class="text-sm text-gray-600 my-2">${reward.description}</p>
                        <div class="flex justify-between items-center mt-3">
                            <p class="font-bold text-blue-600">${reward.cost} Puntos</p>
                            <button class="redeem-reward-btn px-4 py-2 rounded-lg font-semibold text-sm ${buttonClass}"
                                    data-reward-id="${reward.id}"
                                    ${buttonDisabled ? 'disabled' : ''}>
                                ${buttonText}
                            </button>
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>
    `;
}

function openApplyForTalkModal(rewardId) {
    const reward = store.professionalData.rewards.find(r => r.id === rewardId);
    if (!reward) return;

    showModal(`
        <div class="modal-overlay visible">
            <div class="modal-content">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="font-bold text-lg text-gray-800">Postular a Ponencia</h2>
                    <button class="modal-close-btn text-gray-500"><i class="ph-x text-xl"></i></button>
                </div>
                <p class="text-sm text-gray-600 mb-4">Completa los detalles para tu postulación a "${reward.title}". Se descontarán ${reward.cost} puntos al enviar.</p>
                <div class="space-y-3">
                    <input type="text" id="talk-title" placeholder="Título de la Ponencia" class="w-full p-2 border rounded-md">
                    <textarea id="talk-description" class="w-full p-2 border rounded-md h-24" placeholder="Breve descripción..."></textarea>
                    <div class="grid grid-cols-2 gap-2">
                        <input type="date" id="talk-date" class="w-full p-2 border rounded-md">
                        <input type="time" id="talk-time" class="w-full p-2 border rounded-md">
                    </div>
                    <div>
                        <label for="talk-file" class="text-sm font-medium text-gray-700">Adjuntar archivo (opcional)</label>
                        <input type="file" id="talk-file" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
                    </div>
                </div>
                <div class="flex space-x-2 mt-6">
                    <button class="modal-close-btn w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold">Cancelar</button>
                    <button id="submit-talk-application-btn" data-reward-id="${reward.id}" class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">Enviar Postulación</button>
                </div>
            </div>
        </div>`);
}


function attachRewardsEventListeners() {
    document.body.addEventListener('click', (e) => {
        if (screenElementsGlobalRef.rewards && screenElementsGlobalRef.rewards.classList.contains('hidden') && !document.querySelector('#modal-container .modal-overlay.visible')) {
             // Only act if rewards screen is active or a relevant modal is open
            return;
        }

        if (e.target.closest('.redeem-reward-btn')) {
            const rewardId = parseInt(e.target.dataset.rewardId);
            const reward = store.professionalData.rewards.find(r => r.id === rewardId);

            if (reward && store.professionalData.points >= reward.cost && !reward.claimed && reward.status !== 'applied') {
                if (reward.type === 'apply') {
                    openApplyForTalkModal(rewardId);
                } else {
                    const startPoints = store.professionalData.points;
                    store.professionalData.points -= reward.cost;
                    reward.claimed = true;
                    showToast(`¡Has canjeado "${reward.title}"!`);
                    renderRewardsScreen(); // Re-render to update button states and points
                    const pointsEl = document.getElementById('points-balance-rewards');
                    if(pointsEl) {
                        // Ensure animateSlotMachine handles current value if already at target
                        pointsEl.textContent = `${startPoints.toLocaleString()} Puntos Vitalis`; // Set initial for animation
                        animateSlotMachine(pointsEl, startPoints, store.professionalData.points, 500);
                    }
                }
            } else if (reward && (reward.claimed || reward.status === 'applied')) {
                // Already claimed or applied
            } else if (reward) {
                showToast("No tienes suficientes puntos.");
            }
        }

        if (e.target.closest('#submit-talk-application-btn')) {
            const rewardId = parseInt(e.target.dataset.rewardId);
            const reward = store.professionalData.rewards.find(r => r.id === rewardId);
            // Basic validation for modal fields
            const talkTitle = document.getElementById('talk-title')?.value;
            if (!talkTitle) {
                showToast("Por favor, ingrese un título para la ponencia.");
                return;
            }
            if (reward) { // No need to check points again if modal was opened
                const startPoints = store.professionalData.points;
                store.professionalData.points -= reward.cost;
                reward.status = 'applied';
                showToast('Postulación enviada. ¡Gracias por tu interés!');
                hideModal();
                renderRewardsScreen();
                const pointsEl = document.getElementById('points-balance-rewards');
                if(pointsEl) {
                     pointsEl.textContent = `${startPoints.toLocaleString()} Puntos Vitalis`;
                    animateSlotMachine(pointsEl, startPoints, store.professionalData.points, 500);
                }
            }
        }
    });
}
