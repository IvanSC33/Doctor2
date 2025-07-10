import * as store from './store.js';
import { showModal, hideModal, showToast, animateValue } from './ui.js'; // animateValue might be used for stats updates

let screenElementsGlobalRef;
let showScreenFunc; // To call _showScreenWrapper from main script for navigation
// Needed to re-render home screen elements like tasks and next consultation after consultation ends/signed
let homeRenderNextConsultationFunc;
let homeRenderTasksFunc;


export function initConsultationFlow(sElements, sShowScreenFunc, hRenderNextConsultation, hRenderTasks) {
    screenElementsGlobalRef = sElements;
    showScreenFunc = sShowScreenFunc;
    homeRenderNextConsultationFunc = hRenderNextConsultation;
    homeRenderTasksFunc = hRenderTasks;
    attachConsultationEventListeners();
}

// --- Rendering Functions ---
export function renderWaitingRoomScreen() {
    if (!screenElementsGlobalRef || !screenElementsGlobalRef.waitingRoom) return;
    screenElementsGlobalRef.waitingRoom.innerHTML = `
        <i class="ph-clock-countdown text-6xl text-blue-600"></i>
        <h2 class="text-2xl font-bold text-gray-800 mt-4">Sala de Espera Virtual</h2>
        <p class="text-gray-600 mt-2 max-w-sm">Aguardando a que el paciente, Jorge García, se conecte a la consulta.</p>
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mt-8"></div>
        <p class="text-sm text-gray-500 mt-8">Se ha notificado al paciente. La consulta comenzará automáticamente.</p>`;
}

export function renderConsultationItems() {
    const container = document.getElementById('panel-soap');
    if (!container) return;
    const visibleItems = store.consultationItems.filter(item => item.status !== 'discarded');
    if (visibleItems.length === 0) {
        container.innerHTML = `<p class="text-center text-gray-400 text-sm">Las sugerencias de la IA aparecerán aquí mientras habla.</p>`;
        return;
    }
    container.innerHTML = visibleItems.map(item => {
        const isConfirmed = item.status === 'confirmed';
        const cardClass = isConfirmed ? 'ai-confirmed-card' : 'ai-suggestion-card';
        const actionsHtml = isConfirmed
            ? `<button class="ai-edit-btn text-xs bg-gray-200 text-gray-700 font-semibold px-2 py-1 rounded-full">Editar</button>`
            : `<button class="ai-confirm-btn text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-1 rounded-full">Confirmar</button>
               <button class="ai-discard-btn text-xs bg-gray-200 text-gray-700 font-semibold px-2 py-1 rounded-full">Descartar</button>`;
        return `
            <div class="${cardClass} card" data-id="${item.id}" data-type="${item.type}">
                <div class="flex items-start gap-3">
                    <i class="ph-${item.icon || 'chat-dots'} text-xl ${isConfirmed ? 'text-green-600' : 'text-indigo-600'} mt-1"></i>
                    <div><h4 class="font-bold text-xs ${isConfirmed ? 'text-green-800' : 'text-indigo-800'}">${item.title}</h4><p class="text-sm text-gray-800">${item.content}</p><div class="flex space-x-2 mt-2 ai-actions">${actionsHtml}</div></div>
                </div></div>`;
    }).join('');
}

function simulateAIConsultation() {
    const suggestions = [
        { id: Date.now() + 1, type: 'subjective', icon: 'chat-circle-dots', title: 'SÍNTOMA DETECTADO (IA)', content: 'Paciente refiere persistencia de cefalea occipital...', status: 'suggested' },
        { id: Date.now() + 2, type: 'objective', icon: 'heartbeat', title: 'SIGNO VITAL DETECTADO (IA)', content: 'Funciones Vitales: PA: 150/95 mmHg...', status: 'suggested' },
        { id: Date.now() + 3, type: 'order', icon: 'pill', title: 'PRESCRIPCIÓN SUGERIDA (IA)', content: 'Losartán 50mg...', status: 'suggested' },
    ];
    store.consultationItems.push(...suggestions); // Add to existing items if any, or replace
    setTimeout(() => { renderConsultationItems(); }, 1000);
}

export function renderConsultationScreenActive() {
    if (!screenElementsGlobalRef || !screenElementsGlobalRef.consultation) return;
    store.consultationItems = []; // Reset for a new consultation
    screenElementsGlobalRef.consultation.innerHTML = `
        <div class="flex-grow relative bg-black flex items-center justify-center">
            <div class="absolute top-4 left-4 bg-black/50 p-2 rounded-lg text-xs flex items-center gap-2"><i class="ph-microphone text-green-400 animate-pulse"></i><span>Vitalis AI escuchando...</span></div>
            <img src="https://placehold.co/400x300/cccccc/333333?text=Video+Paciente" class="w-full h-full object-cover">
            <div class="absolute top-4 right-4 w-24 h-32 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700"><img src="https://placehold.co/96x96/bfdbfe/1e3a8a?text=AP" class="w-full h-full object-cover"></div>
        </div>
        <div class="bg-white text-gray-800 p-2 h-2/5 flex flex-col">
            <div class="flex-shrink-0 flex border-b border-gray-200"><div class="segmented-control w-full mb-2"><button class="clinical-tab-btn active" data-target="panel-triage">Triaje</button><button class="clinical-tab-btn" data-target="panel-soap">SOAP (IA)</button><button class="clinical-tab-btn" data-target="panel-exams">Exámenes</button></div></div>
            <div id="consultation-panel-container" class="flex-grow overflow-y-auto mt-2 px-2">
                <div id="panel-triage" class="clinical-panel-content text-sm space-y-2"><p><strong>Talla:</strong> 1.75 m</p><p><strong>Peso:</strong> 80 kg</p><p><strong>Temperatura:</strong> 36.8 °C</p><p><strong>PA:</strong> 145/92 mmHg</p><p><strong>Motivo (previo):</strong> "Dolor de cabeza y mareos."</p></div>
                <div id="panel-soap" class="clinical-panel-content hidden space-y-2"></div>
                <div id="panel-exams" class="clinical-panel-content hidden text-sm"><a href="#" class="block p-2 rounded-md bg-gray-100 hover:bg-gray-200">Perfil_Lipidico_Previo.pdf</a></div>
            </div>
        </div>
        <div class="bg-gray-800 p-3 flex justify-between items-center">
            <div class="flex space-x-2"><button id="capture-btn" class="bg-gray-700 text-white w-12 h-12 rounded-full flex items-center justify-center" title="Tomar Foto"><i class="ph-camera text-2xl"></i></button><button id="manual-add-btn" class="bg-gray-700 text-white w-12 h-12 rounded-full flex items-center justify-center" title="Añadir Manual"><i class="ph-list-plus text-2xl"></i></button></div>
            <button id="end-consultation-btn" class="bg-red-600 text-white font-bold py-3 px-6 rounded-full">Finalizar Consulta</button>
        </div>`;
    renderConsultationItems(); // Initial render for SOAP panel
    simulateAIConsultation();
}

export function renderReviewSignScreen(taskId) {
    if (!screenElementsGlobalRef || !screenElementsGlobalRef.reviewSign) return;
    const task = store.tasks.find(t => t.id === taskId);
    if (!task) { showToast("Tarea no encontrada."); if (showScreenFunc) showScreenFunc('home'); return; }

    const unconfirmedItems = task.items.filter(item => item.status === 'suggested' && ['order', 'follow-up', 'photo'].includes(item.type));
    const signButtonDisabled = unconfirmedItems.length > 0;

    screenElementsGlobalRef.reviewSign.innerHTML = `
        <div class="flex items-center mb-4"><button id="back-to-home-from-review" class="text-2xl text-gray-600 mr-4"><i class="ph-arrow-left"></i></button><h1 class="text-xl font-bold text-gray-800">Revisar y Firmar Registro</h1></div>
        <div class="bg-white p-3 rounded-lg border mb-4"><p class="text-sm text-center"><span class="font-bold">Paciente:</span> ${task.patient} | <span class="font-bold">Fecha:</span> ${new Date().toLocaleDateString('es-PE')}</p></div>
        <div class="space-y-4">
            <details class="bg-white rounded-lg border" open><summary class="font-bold text-gray-800 p-3 cursor-pointer flex justify-between">S: Subjetivo <i class="ph-caret-down"></i></summary><div class="p-3 border-t"><textarea class="w-full h-24 p-2 border rounded-md text-sm">${task.items.find(item => item.type === 'subjective')?.content || ''}</textarea></div></details>
            <details class="bg-white rounded-lg border" open><summary class="font-bold text-gray-800 p-3 cursor-pointer flex justify-between">O: Objetivo <i class="ph-caret-down"></i></summary><div class="p-3 border-t"><textarea class="w-full h-24 p-2 border rounded-md text-sm">${task.items.find(item => item.type === 'objective')?.content || ''}</textarea></div></details>
            <details class="bg-white rounded-lg border" open><summary class="font-bold text-gray-800 p-3 cursor-pointer flex justify-between">A: Apreciación / Diagnóstico <i class="ph-caret-down"></i></summary><div class="p-3 border-t space-y-2"><div class="flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1.5 rounded-md"><span class="flex-grow">I10 - Hipertensión Esencial</span><button class="text-blue-500"><i class="ph-x"></i></button></div><input type="text" placeholder="Añadir diagnóstico (CIE-10)..." class="w-full p-2 border rounded-md text-sm"></div></details>
            <details class="bg-white rounded-lg border" open><summary class="font-bold text-gray-800 p-3 cursor-pointer flex justify-between">P: Plan de Trabajo <i class="ph-caret-down"></i></summary><div class="p-3 border-t space-y-3">${task.items.filter(item => ['order', 'follow-up', 'photo'].includes(item.type) && item.status !== 'discarded').map(order => `<div class="p-3 border rounded-lg flex justify-between items-center ${order.status === 'confirmed' ? 'bg-gray-50' : 'bg-yellow-100 border-yellow-400'}"><div><p class="font-bold text-sm">${order.title}</p><p class="text-sm text-gray-600">${order.content}</p></div><div class="flex flex-col space-y-1">${order.status !== 'confirmed' ? `<button class="review-confirm-btn text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full" data-task-id="${task.id}" data-item-id="${order.id}">Confirmar</button>` : ''}<button class="review-edit-btn text-xs bg-gray-200 text-gray-700 font-semibold px-2 py-1 rounded-full" data-task-id="${task.id}" data-item-id="${order.id}">Editar</button></div></div>`).join('') || '<p class="text-sm text-gray-500">No hay plan.</p>'}<button class="w-full text-sm font-semibold text-blue-600 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 review-add-btn" data-task-id="${task.id}">Añadir Item</button></div></details>
        </div>
        <div class="mt-6"><h4 class="font-semibold mb-2 text-gray-800">Firma Médico</h4><div class="bg-gray-100 border-dashed border-2 border-gray-300 rounded-lg p-4 text-center"><img src="https://placehold.co/200x50/000000/ffffff?text=Dra.+Ana+Pérez" class="mx-auto"></div></div>
        <div class="mt-2 text-center"><button id="sign-and-seal-btn" data-task-id="${task.id}" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold ${signButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}" ${signButtonDisabled ? 'disabled' : ''}>Firmar y Sellar</button>${signButtonDisabled ? '<p class="text-xs text-red-600 mt-2">Confirme todas las sugerencias.</p>' : ''}</div>`;
}

function openManualAddModal(itemIdToEdit = null, fromReview = false, taskId = null) {
    const targetArray = fromReview ? store.tasks.find(t => t.id === taskId)?.items : store.consultationItems;
    if (!targetArray && fromReview) { console.error("Task items not found for review modal"); return; }

    const currentItems = targetArray || store.consultationItems; // Fallback for safety, though should be set
    const suggestedItems = currentItems.filter(item => item.status === 'suggested');
    const itemToEdit = currentItems.find(item => item.id === itemIdToEdit);

    let optionsHtml = suggestedItems.map(item => `<option value="${item.id}" ${itemToEdit && itemToEdit.id === item.id ? 'selected' : ''}>Editar: ${item.title}</option>`).join('');
    optionsHtml += `
        <option value="prescription" ${itemToEdit ? 'disabled' : ''}>Nueva Prescripción</option>
        <option value="lab_order" ${itemToEdit ? 'disabled' : ''}>Nueva Orden Lab.</option>
        <option value="certificate" ${itemToEdit ? 'disabled' : ''}>Nuevo Certificado</option>`;

    const modalContentVal = itemToEdit ? itemToEdit.content : '';
    const modalTitle = itemToEdit ? `Editar: ${itemToEdit.title}` : 'Añadir/Editar Plan';

    showModal(`
        <div class="modal-overlay"><div class="modal-content">
            <h2 class="font-bold text-lg text-gray-800 mb-4">${modalTitle}</h2>
            <select id="manual-item-select" class="w-full p-2 border rounded-md mb-2 ${itemToEdit ? 'hidden' : ''}">${optionsHtml}</select>
            <div class="textarea-container"><textarea id="manual-item-content" class="w-full p-2 pr-10 border rounded-md h-24" placeholder="Detalles...">${modalContentVal}</textarea><button class="dictate-icon-btn"><i class="ph-microphone"></i></button></div>
            <div class="flex space-x-2 mt-4"><button class="modal-close-btn w-full bg-gray-200 py-2 rounded-lg">Cancelar</button><button id="confirm-manual-add-btn" data-task-id="${taskId || ''}" data-from-review="${fromReview}" class="w-full bg-blue-600 text-white py-2 rounded-lg">Guardar</button></div>
        </div></div>`);

    const select = document.getElementById('manual-item-select');
    const textarea = document.getElementById('manual-item-content');
    if (select && textarea && !itemToEdit && suggestedItems.length > 0 && select.value && !isNaN(parseInt(select.value))) { // Pre-fill if first suggested is selected
        const prefillItem = currentItems.find(i => i.id === parseInt(select.value));
        if (prefillItem) textarea.value = prefillItem.content;
    }
    if (select) {
        select.addEventListener('change', (e) => {
            const selectedId = parseInt(e.target.value);
            if (!isNaN(selectedId)) {
                const selectedItem = currentItems.find(i => i.id === selectedId);
                if (textarea) textarea.value = selectedItem ? selectedItem.content : '';
            } else {
                if (textarea) textarea.value = '';
            }
        });
    }
}


// --- Event Listeners ---
function attachConsultationEventListeners() {
    document.body.addEventListener('click', (e) => {
        // These listeners are now specific to consultation flow
        if (e.target.closest('#join-consultation-btn')) {
            if(showScreenFunc) showScreenFunc('waitingRoom');
            setTimeout(() => { if(showScreenFunc) showScreenFunc('consultation'); }, 3000);
        }
        if (e.target.closest('#end-consultation-btn')) {
            const newTaskId = Date.now();
            store.tasks.unshift({ id: newTaskId, text: 'Revisar y Firmar Consulta', patient: store.nextConsultation.patient || 'Paciente Desconocido', status: 'pending', items: [...store.consultationItems] });
            store.nextConsultation.status = 'pending_review'; // Or some other status update
            if(homeRenderNextConsultationFunc) homeRenderNextConsultationFunc();
            if(homeRenderTasksFunc) homeRenderTasksFunc();
            showToast('Consulta finalizada. Tarea de firma creada.');
            if(showScreenFunc) showScreenFunc('home');
        }
        if (e.target.closest('.review-task-btn')) {
            const taskId = parseInt(e.target.closest('.review-task-btn').dataset.taskId);
            if(showScreenFunc) showScreenFunc('reviewSign', taskId);
        }
        if (e.target.closest('#sign-and-seal-btn')) {
            const taskId = parseInt(e.target.dataset.taskId);
            const task = store.tasks.find(t => t.id === taskId);
            if (task) {
                const unconfirmed = task.items.filter(item => item.status === 'suggested' && ['order', 'follow-up', 'photo'].includes(item.type));
                if (unconfirmed.length > 0) {
                    showToast("Confirme todas las sugerencias del Plan antes de firmar."); return;
                }
                task.status = 'completed';
                task.completedAt = new Date().toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' });

                const consultationCountEl = document.getElementById('consultation-count');
                if (consultationCountEl) animateValue(consultationCountEl, parseInt(consultationCountEl.textContent), parseInt(consultationCountEl.textContent) + 1, 1000);
                const incomeCountEl = document.getElementById('income-count');
                if (incomeCountEl) { const currentIncome = parseFloat(incomeCountEl.textContent.replace('S/ ', '').replace(',', '')); animateValue(incomeCountEl, currentIncome, currentIncome + 150, 1000, true, 'S/');}

                store.nextConsultation.visible = false; // Example: update next consultation
                if(homeRenderNextConsultationFunc) homeRenderNextConsultationFunc();
                if(homeRenderTasksFunc) homeRenderTasksFunc();
                showToast('Registro firmado. +10 Puntos Vitalis!', true);
                if(showScreenFunc) showScreenFunc('home');
            }
        }
        if (e.target.closest('#capture-btn')) {
            showModal(`
                <div class="modal-overlay"><div class="modal-content text-center">
                    <h2 class="font-bold text-lg text-gray-800 mb-2">Confirmar Captura</h2><img src="https://placehold.co/300x200/cccccc/333333?text=Sim+foto" class="rounded-lg mb-4 mx-auto">
                    <div class="flex space-x-2"><button class="modal-close-btn w-full bg-gray-200 py-2 rounded-lg">Descartar</button><button id="confirm-capture-btn" class="w-full bg-blue-600 text-white py-2 rounded-lg">Adjuntar</button></div>
                </div></div>`);
        }
        if (e.target.closest('#confirm-capture-btn')) {
            const newItem = { id: Date.now(), type: 'photo', icon: 'image', title: 'FOTOGRAFÍA CLÍNICA', content: `captura_${Date.now()}.jpg`, status: 'confirmed' };
            store.consultationItems.push(newItem);
            renderConsultationItems();
            showToast('Imagen adjuntada.');
            hideModal();
        }
        if (e.target.closest('.ai-confirm-btn')) {
            const cardId = parseInt(e.target.closest('.card').dataset.id);
            const item = store.consultationItems.find(i => i.id === cardId);
            if (item) { item.status = 'confirmed'; renderConsultationItems(); }
        }
        if (e.target.closest('.review-confirm-btn')) {
            const taskId = parseInt(e.target.dataset.taskId);
            const itemId = parseInt(e.target.dataset.itemId);
            const task = store.tasks.find(t => t.id === taskId);
            if (task) { const item = task.items.find(i => i.id === itemId); if (item) { item.status = 'confirmed'; renderReviewSignScreen(taskId); }}
        }
        if (e.target.closest('.ai-discard-btn')) {
            const cardId = parseInt(e.target.closest('.card').dataset.id);
            const item = store.consultationItems.find(i => i.id === cardId);
            if (item) { item.status = 'discarded'; renderConsultationItems(); }
        }
        if (e.target.closest('.ai-edit-btn')) {
            const cardId = parseInt(e.target.closest('.card').dataset.id);
            openManualAddModal(cardId, false, null); // Not from review, no task ID
        }
        if (e.target.closest('#manual-add-btn')) {
            openManualAddModal(null, false, null); // New item, not from review
        }
        if (e.target.closest('.review-edit-btn') || e.target.closest('.review-add-btn')) {
            const taskId = parseInt(e.target.dataset.taskId);
            const itemId = e.target.closest('.review-edit-btn') ? parseInt(e.target.dataset.itemId) : null;
            openManualAddModal(itemId, true, taskId);
        }
        if (e.target.closest('#confirm-manual-add-btn')) {
            const select = document.getElementById('manual-item-select');
            const contentTextarea = document.getElementById('manual-item-content');
            if(!select || !contentTextarea) return;

            const fromReview = e.target.dataset.fromReview === 'true';
            const taskId = e.target.dataset.taskId ? parseInt(e.target.dataset.taskId) : null;

            const selectedOptionValue = select.value;
            const itemId = (!isNaN(parseInt(selectedOptionValue))) ? parseInt(selectedOptionValue) : null;
            const isNewEntryType = isNaN(parseInt(selectedOptionValue)); // True if 'prescription', 'lab_order', etc.

            let targetArray = fromReview && taskId ? store.tasks.find(t => t.id === taskId)?.items : store.consultationItems;
            if (!targetArray && fromReview) { console.error("Task not found for manual add"); return; }
            if (!targetArray) targetArray = store.consultationItems; // Fallback

            if (isNewEntryType) { // Adding a brand new item of a selected type
                const newTypeKey = selectedOptionValue; // 'prescription', 'lab_order', 'certificate'
                const titles = { 'prescription': 'PRESCRIPCIÓN', 'lab_order': 'ORDEN DE LAB.', 'certificate': 'CERT. DE DESCANSO' };
                const icons = { 'prescription': 'pill', 'lab_order': 'test-tube', 'certificate': 'bed' };
                const newItem = { id: Date.now(), type: 'order', icon: icons[newTypeKey], title: titles[newTypeKey], content: contentTextarea.value, status: 'confirmed' };
                targetArray.push(newItem);
            } else if (itemId) { // Editing an existing item
                const item = targetArray.find(i => i.id === itemId);
                if(item) { item.content = contentTextarea.value; item.status = 'confirmed'; }
            }

            if(fromReview && taskId) renderReviewSignScreen(taskId);
            else renderConsultationItems();
            hideModal();
        }
        if (e.target.matches('.clinical-tab-btn')) {
            const parentScreen = e.target.closest('#screen-consultation'); // Ensure we are in consultation screen
            if (!parentScreen) return;
            parentScreen.querySelectorAll('.clinical-tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const container = parentScreen.querySelector('#consultation-panel-container');
            if(container) {
                container.querySelectorAll('.clinical-panel-content').forEach(c => c.classList.add('hidden'));
                const targetPanel = container.querySelector(`#${e.target.dataset.target}`);
                if(targetPanel) targetPanel.classList.remove('hidden');
            }
        }
    });
}
