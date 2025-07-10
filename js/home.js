import * as store from './store.js';
// We might need showScreen and showToast if actions on home screen navigate or show toasts directly.
// For now, rendering functions are called by the main script's screenRenderers.
// Event listeners added here might need to import ui functions.
// import { showScreen as uiShowScreen, showToast as uiShowToast } from './ui.js';


// --- Home Screen Rendering Functions ---
export function renderNextConsultation() {
    const container = document.getElementById('next-consultation-container');
    if (!container) return;

    if (!store.nextConsultation.visible) {
        container.innerHTML = `<div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center text-gray-500">No hay consultas próximas.</div>`;
        return;
    }

    let buttonHtml = '';
    if (store.nextConsultation.status === 'scheduled') {
        buttonHtml = `<button id="join-consultation-btn" class="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Unirse</button>`;
    } else if (store.nextConsultation.status === 'pending_review') {
        buttonHtml = `<button class="bg-amber-500 text-white px-5 py-2 rounded-lg font-semibold cursor-not-allowed">Revisión Pendiente</button>`;
    }

    container.innerHTML = `
        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Próxima Consulta</p>
            <div class="flex items-center justify-between mt-3">
                <div>
                    <p class="font-bold text-lg text-gray-800">${store.nextConsultation.patient}</p>
                    <p class="text-sm text-gray-600">${store.nextConsultation.time} - ${store.nextConsultation.reason}</p>
                </div>
                ${buttonHtml}
            </div>
        </div>
    `;
}

export function renderTasks() {
    const container = document.getElementById('tasks-container');
    if (!container) return;
    container.innerHTML = store.tasks.map(task => {
        if (task.status === 'pending') {
            return `
                <div class="bg-white p-4 rounded-lg border-l-4 border-amber-500 shadow-sm flex items-center justify-between cursor-pointer review-task-btn" data-task-id="${task.id}">
                    <div>
                        <p class="font-bold text-gray-800">${task.text}</p>
                        <p class="text-sm text-gray-600">Paciente: ${task.patient}</p>
                    </div>
                    <i class="ph-caret-right text-gray-400 text-xl"></i>
                </div>
            `;
        } else {
            return `
                <div class="bg-white p-4 rounded-lg border-l-4 border-green-500 shadow-sm flex items-center justify-between opacity-70">
                    <div>
                        <p class="font-semibold text-gray-700 line-through">${task.text}</p>
                        <p class="text-sm text-gray-500">Completado: ${task.completedAt}</p>
                    </div>
                    <i class="ph-check-circle text-green-500 text-2xl"></i>
                </div>
            `;
        }
    }).join('');
}

// --- Home Screen Event Listeners Setup ---
// Specific event listeners for elements rendered by home.js can be initialized here.
// For example, if #join-consultation-btn or .review-task-btn clicks are solely handled
// when the home screen is active and rendered by these functions.
// However, many of these are already handled by global listeners in script.js
// which delegate based on class/ID. We'll keep them there for now to avoid
// attaching/detaching listeners repeatedly unless a clear need arises.

export function initHome() {
    // Currently, rendering is triggered by the main screenRenderers.home.
    // If there were home-specific listeners that aren't globally delegated,
    // they would be attached here. For example:
    // const nextConsultationContainer = document.getElementById('next-consultation-container');
    // if (nextConsultationContainer) {
    //     nextConsultationContainer.addEventListener('click', (e) => {
    //         if (e.target.closest('#join-consultation-btn')) {
    //             // This is already handled globally in script.js
    //             // uiShowScreen('waitingRoom');
    //             // setTimeout(() => { uiShowScreen('consultation'); }, 3000);
    //         }
    //     });
    // }
    // const tasksContainer = document.getElementById('tasks-container');
    // if (tasksContainer) {
    //      tasksContainer.addEventListener('click', (e) => {
    //          if (e.target.closest('.review-task-btn')) {
    //                // Also handled globally
    //          }
    //      });
    // }
    console.log("Home module initialized (event listeners are currently global or managed by main script).");
}
