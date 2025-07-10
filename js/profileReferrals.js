import * as store from './store.js';
import { showToast } from './ui.js';

let screenElementsGlobalRef;

export function initProfileReferrals(sElements) {
    screenElementsGlobalRef = sElements;
    attachReferralsEventListeners();
}

export function renderReferralsScreen() {
    if (!screenElementsGlobalRef || !screenElementsGlobalRef.referrals) return;

    const totalReferrals = store.referralsDB.length;
    const totalEarnings = store.referralsDB.reduce((sum, ref) => sum + ref.earnings, 0);

    screenElementsGlobalRef.referrals.innerHTML = `
        <div class="flex items-center mb-4">
            <button class="back-to-profile text-2xl text-gray-600 mr-4"><i class="ph-arrow-left"></i></button>
            <h1 class="text-xl font-bold text-gray-800">Programa de Referidos</h1>
        </div>

        <div class="bg-white p-4 rounded-lg border border-gray-200 text-center mb-6">
            <p class="text-sm text-gray-600">Comparte tu código y gana 50 Puntos Vitalis por cada médico que complete su primera consulta.</p>
            <div class="my-3 p-3 bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg">
                <p id="referral-code-display" class="text-2xl font-bold text-blue-600 tracking-widest">VITALIS-APEREZ</p>
            </div>
            <div class="flex justify-center gap-2">
                 <button id="copy-referral-code-btn" class="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg flex-1">Copiar Código</button>
                 <a href="https://api.whatsapp.com/send?text=Usa%20mi%20código%20VITALIS-APEREZ%20para%20unirte%20a%20Vitalis%20AI%20y%20gana%20beneficios." target="_blank" class="bg-green-500 text-white font-semibold px-4 py-2 rounded-lg flex-1 flex items-center justify-center gap-2">
                     <i class="ph-whatsapp-logo"></i> Compartir
                 </a>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <p class="text-sm font-semibold text-gray-500">Total Referidos</p>
                <p class="text-3xl font-bold text-gray-800 mt-1">${totalReferrals}</p>
            </div>
            <div class="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <p class="text-sm font-semibold text-gray-500">Puntos Ganados</p>
                <p class="text-3xl font-bold text-gray-800 mt-1">${totalEarnings.toLocaleString()}</p>
            </div>
        </div>

        <div>
            <h2 class="font-bold text-gray-800 text-lg mb-3">Historial de Referidos</h2>
            <div class="space-y-3">
                ${store.referralsDB.map(ref => {
                    let statusClass = '';
                    switch(ref.status) {
                        case 'Completado': statusClass = 'bg-green-100 text-green-800'; break;
                        case 'Pendiente': statusClass = 'bg-yellow-100 text-yellow-800'; break;
                        default: statusClass = 'bg-gray-100 text-gray-800'; break;
                    }
                    return `
                    <div class="bg-white p-4 rounded-lg border flex justify-between items-center">
                        <div>
                            <p class="font-semibold text-gray-800">${ref.name}</p>
                            <p class="text-xs text-gray-500">Referido el: ${ref.date}</p>
                        </div>
                        <div class="text-right">
                            <p class="font-bold text-green-600">+ ${ref.earnings} Puntos</p>
                            <span class="text-xs font-bold px-2 py-0.5 rounded-full ${statusClass}">${ref.status}</span>
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>
    `;
}

function attachReferralsEventListeners() {
    document.body.addEventListener('click', (e) => {
        if (screenElementsGlobalRef.referrals && screenElementsGlobalRef.referrals.classList.contains('hidden')) {
            return; // Only act if referrals screen is active
        }

        if (e.target.closest('#copy-referral-code-btn')) {
            const codeElement = document.getElementById('referral-code-display');
            if (codeElement) {
                navigator.clipboard.writeText(codeElement.textContent)
                    .then(() => showToast('¡Código copiado!'))
                    .catch(err => showToast('Error al copiar código'));
            }
        }
    });
}
