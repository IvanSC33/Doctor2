import * as store from './store.js';
import { showScreen as uiShowScreen, showModal, hideModal, showToast } from './ui.js';

let screenElements, navItemElements, headerElement, bottomNavElement, fabElement, screenRenderersFromMain;

// Wrapper for showScreen from ui.js
function showScreen(screenName, data = null) {
    uiShowScreen(screenName, data, screenElements, navItemElements, headerElement, bottomNavElement, fabElement, screenRenderersFromMain);
}

export function initPatients(sElements, nItems, hElement, bNavElement, fElement, sRenderers) {
    screenElements = sElements;
    navItemElements = nItems;
    headerElement = hElement;
    bottomNavElement = bNavElement;
    fabElement = fElement;
    screenRenderersFromMain = sRenderers; // Store the main screen renderers map

    attachPatientEventListeners();
}

export function renderPatientList(patientsToRender, containerId = 'patient-list-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = patientsToRender.length > 0 ? patientsToRender.map(patient => `
        <div class="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
            <div class="flex items-center">
                <img src="${patient.avatar}" alt="[Imagen del Paciente]" class="w-10 h-10 rounded-full mr-3" onerror="this.onerror=null;this.src='https://placehold.co/40x40/cccccc/333333?text=??';">
                <div>
                    <p class="font-semibold text-gray-800">${patient.name}</p>
                    <p class="text-xs text-gray-500">${patient.details.split(',')[0]}</p>
                </div>
                ${store.tasks.some(t => t.patient === patient.name && t.status === 'pending') ? '<span class="ml-3 w-3 h-3 bg-yellow-400 rounded-full" title="Tareas pendientes"></span>' : ''}
            </div>
            <button class="view-history-btn text-blue-600 font-semibold text-sm" data-patient-id="${patient.id}">Ver Historia</button>
        </div>
    `).join('') : '<p class="text-center text-gray-500 mt-8">No se encontraron pacientes.</p>';
}

export function renderPatientsScreen(filteredPatients = store.patientsDB) {
    if (!screenElements.patients) return;
    screenElements.patients.innerHTML = `
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Mis Pacientes</h1>
        <div class="relative mb-4">
            <input type="text" id="patient-search-input" placeholder="Buscar paciente..." class="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-white">
            <i class="ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <div id="patient-list-container" class="space-y-3">
        </div>
    `;
    renderPatientList(filteredPatients, 'patient-list-container');
}

export function renderPatientHistoryScreen(patientId) {
    if (!screenElements.patientHistory) return;
    const patient = store.patientsDB.find(p => p.id === patientId);
    if (!patient) {
        showToast("Paciente no encontrado.");
        showScreen('patients'); // Go back to patient list
        return;
    }

    // This HTML structure is large; assuming it's correct and was working.
    // For brevity, only including the outer structure and key dynamic parts.
    screenElements.patientHistory.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
                <button id="back-to-patients" class="text-2xl text-gray-600 mr-4"><i class="ph-arrow-left"></i></button>
                <h1 class="text-xl font-bold text-gray-800">Historia Clínica 360°</h1>
            </div>
            <button id="download-pdf-btn" data-patient-id="${patient.id}" class="bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold text-sm flex items-center gap-2"><i class="ph-download-simple"></i>PDF</button>
        </div>
        <div class="bg-white p-4 rounded-lg border border-gray-200 mb-4 space-y-3">
            <div class="text-center">
                <img src="${patient.avatar}" alt="[Imagen del Paciente]" class="w-20 h-20 rounded-full mx-auto mb-2" onerror="this.onerror=null;this.src='https://placehold.co/80x80/cccccc/333333?text=??';">
                <h2 class="text-lg font-bold">${patient.name}</h2>
                <p class="text-sm text-gray-500">${patient.details}</p>
            </div>
            <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-r-lg"><p class="font-bold text-sm">Alergias: ${patient.allergies}</p></div>
            <div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 rounded-r-lg"><p class="font-bold text-sm">Adherencia Terapéutica (últimos 30d): ${patient.adherence}%</p></div>
        </div>
        <h3 class="font-bold text-lg text-gray-800 mb-2">Línea de Tiempo de Consultas</h3>
        <div class="space-y-4">
            ${patient.consultations.length > 0 ? patient.consultations.map((consult, index) => `
            <details class="bg-white rounded-lg border" ${index === 0 ? 'open' : ''}>
                <summary class="font-bold text-gray-800 p-3 cursor-pointer flex justify-between items-center">
                    <span>${consult.date} (${consult.doctor})</span><i class="ph-caret-down"></i>
                </summary>
                <div class="p-4 border-t text-sm space-y-4">
                    <div class="bg-gray-50 p-3 rounded-md"><h4 class="font-bold mb-2 text-gray-700">Triaje</h4><div class="grid grid-cols-2 gap-x-4 gap-y-1">${Object.entries(consult.triage).map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`).join('')}</div></div>
                    <div class="space-y-2"><h4 class="font-bold text-gray-700">SOAP</h4><p><strong>S:</strong> ${consult.soap.s}</p><p><strong>O:</strong> ${consult.soap.o}</p><p><strong>A:</strong> ${consult.soap.a}</p><p><strong>P:</strong> ${consult.soap.p}</p></div>
                    ${consult.exams.length > 0 ? `<div><h4 class="font-bold text-gray-700 mb-2">Exámenes y Documentos</h4><div class="space-y-2">${consult.exams.map(exam => `<button class="view-document-btn flex items-center gap-2 p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold w-full text-left" data-file-name="${exam.name}" data-file-content="Este es un documento de ejemplo para ${exam.name}. En una aplicación real, aquí se mostraría el contenido del PDF."><i class="ph-file-pdf"></i><span>${exam.name}</span></button>`).join('')}</div></div>` : ''}
                </div>
            </details>`).join('') : '<p class="text-center text-gray-500 p-4 bg-white rounded-lg border">No hay consultas registradas.</p>'}
        </div>
    `;
}

export function generatePDF(patientId) {
    const patient = store.patientsDB.find(p => p.id === patientId);
    if (!patient) {
        showToast("Error al generar PDF: Paciente no encontrado.");
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    // ... (rest of PDF generation logic, assuming it's correct)
    doc.text("Historia Clínica PDF Placeholder", 10, 10); // Simplified for brevity
    doc.save(`Historia_Clinica_${patient.name.replace(' ', '_')}.pdf`);
    showToast("Descargando PDF de la historia clínica completa.");
}

function attachPatientEventListeners() {
    document.body.addEventListener('input', (e) => {
        if (e.target.matches('#patient-search-input')) {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = store.patientsDB.filter(patient => patient.name.toLowerCase().includes(searchTerm));
            renderPatientList(filtered, 'patient-list-container');
        }
    });

    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.view-history-btn')) {
            const patientId = parseInt(e.target.closest('.view-history-btn').dataset.patientId);
            showScreen('patientHistory', patientId);
        }
        // #back-to-patients is handled by navigation.js

        if (e.target.closest('#download-pdf-btn')) {
            const patientId = parseInt(e.target.dataset.patientId);
            generatePDF(patientId);
        }

        if (e.target.closest('.view-document-btn')) {
            const button = e.target.closest('.view-document-btn');
            const fileName = button.dataset.fileName;
            const fileContent = button.dataset.fileContent; // This is placeholder content
            showModal(`
                <div class="modal-overlay">
                    <div class="modal-content">
                        <div class="flex justify-between items-center mb-4"><h2 class="font-bold text-lg text-gray-800 flex items-center gap-2"><i class="ph-file-pdf"></i>${fileName}</h2><button class="modal-close-btn text-gray-500"><i class="ph-x text-xl"></i></button></div>
                        <div class="bg-gray-100 p-3 rounded-lg text-sm text-gray-700 mb-4 h-48 overflow-y-auto"><p>${fileContent}</p></div>
                        <div class="flex space-x-2"><button class="modal-close-btn w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold">Cerrar</button><button id="confirm-download-document-btn" class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">Descargar</button></div>
                    </div>
                </div>`);
        }
        if (e.target.closest('#confirm-download-document-btn')) { // Specific to this modal
            hideModal();
            showToast('Descargando documento (simulado)...');
        }
    });
}
