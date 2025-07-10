import * as store from './store.js';
import { showModal, hideModal, showToast } from './ui.js';

let screenElements; // To store screenElements.agenda

export function initAgenda(sElements) {
    screenElements = sElements;
    attachAgendaEventListeners();
}

export function renderAgenda() {
    const container = screenElements.agenda;
    if (!container) return;

    const daysOfWeek = Object.keys(store.doctorAvailability);

    container.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <h1 class="text-2xl font-bold text-gray-800">Mi Agenda</h1>
            <button id="define-schedule-btn" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm">Definir Horarios</button>
        </div>
        <div id="agenda-view" class="space-y-4">
            ${daysOfWeek.map(day => `
                <div class="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 class="font-bold text-gray-800 mb-2">${day}</h3>
                    <div class="flex flex-wrap gap-2">
                        ${store.doctorAvailability[day].length > 0
                            ? store.doctorAvailability[day].map(slot => `<div class="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">${slot}</div>`).join('')
                            : '<p class="text-sm text-gray-400">No hay horarios definidos.</p>'
                        }
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function openScheduleModal() {
    // Populate modal with current availability for selected days if possible, or default.
    // For simplicity, using default values for now.
    showModal(`
        <div class="modal-overlay">
            <div class="modal-content">
                  <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold text-slate-800">Definir Horarios</h2>
                    <button class="modal-close-btn text-2xl text-slate-500 hover:text-slate-800">&times;</button>
                  </div>
                  <div class="space-y-4">
                      <div>
                          <p class="text-sm font-semibold text-slate-700 mb-2">Seleccionar días:</p>
                          <div class="grid grid-cols-7 gap-1 text-center">
                              <button class="day-selector-btn rounded-full p-2 text-xs font-bold" data-day="Lunes">L</button>
                              <button class="day-selector-btn rounded-full p-2 text-xs font-bold" data-day="Martes">M</button>
                              <button class="day-selector-btn rounded-full p-2 text-xs font-bold" data-day="Miércoles">M</button>
                              <button class="day-selector-btn rounded-full p-2 text-xs font-bold" data-day="Jueves">J</button>
                              <button class="day-selector-btn rounded-full p-2 text-xs font-bold" data-day="Viernes">V</button>
                              <button class="day-selector-btn rounded-full p-2 text-xs font-bold" data-day="Sábado">S</button>
                              <button class="day-selector-btn rounded-full p-2 text-xs font-bold" data-day="Domingo">D</button>
                          </div>
                      </div>
                      <div id="time-slots-editor" class="space-y-2">
                          <div class="flex items-center space-x-2 time-slot-row">
                              <input type="time" class="w-full p-2 border rounded-lg bg-white" value="09:00">
                              <span>-</span>
                              <input type="time" class="w-full p-2 border rounded-lg bg-white" value="11:00">
                              <button class="remove-timeslot-btn text-red-500 hover:text-red-700 p-1">
                                   <i class="ph-trash text-xl"></i>
                              </button>
                          </div>
                      </div>
                      <button class="add-timeslot-btn w-full text-sm font-semibold text-blue-600 py-2 rounded-lg bg-blue-50 hover:bg-blue-100">Añadir otro horario</button>
                  </div>
                  <button id="save-schedule-btn" class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold mt-6">Guardar Horarios</button>
            </div>
        </div>
       `);
}

function attachAgendaEventListeners() {
    // Event delegation for elements within the agenda screen or modals spawned from it
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('#define-schedule-btn')) {
            openScheduleModal();
        }

        // Listeners for within the schedule modal
        if (e.target.closest('.day-selector-btn')) {
            e.target.classList.toggle('selected');
        }

        if (e.target.closest('.add-timeslot-btn')) {
            const editor = document.getElementById('time-slots-editor'); // Assuming modal is open
            if(editor) {
                const newTimeSlotRow = document.createElement('div');
                newTimeSlotRow.className = 'flex items-center space-x-2 time-slot-row';
                newTimeSlotRow.innerHTML = `
                    <input type="time" class="w-full p-2 border rounded-lg bg-white" value="09:00">
                    <span>-</span>
                    <input type="time" class="w-full p-2 border rounded-lg bg-white" value="11:00">
                    <button class="remove-timeslot-btn text-red-500 hover:text-red-700 p-1">
                        <i class="ph-trash text-xl"></i>
                    </button>
                `;
                editor.appendChild(newTimeSlotRow);
            }
        }

        if (e.target.closest('.remove-timeslot-btn')) {
            e.target.closest('.time-slot-row').remove();
        }

        if (e.target.closest('#save-schedule-btn')) {
            const modal = document.querySelector('#modal-container .modal-overlay'); // Check if modal exists
            if (!modal) return; // Ensure this only runs if the modal is open

            const selectedDays = [...modal.querySelectorAll('.day-selector-btn.selected')].map(btn => btn.dataset.day);
            const timeSlots = [...modal.querySelectorAll('.time-slot-row')].map(row => {
                const inputs = row.querySelectorAll('input[type="time"]');
                return `${inputs[0].value} - ${inputs[1].value}`;
            });

            if (selectedDays.length === 0) {
                showToast("Por favor seleccione al menos un día.");
                return;
            }

            Object.keys(store.doctorAvailability).forEach(day => store.doctorAvailability[day] = []); // Reset all

            selectedDays.forEach(day => {
                store.doctorAvailability[day] = timeSlots;
            });

            hideModal();
            if (screenElements.agenda && !screenElements.agenda.classList.contains('hidden')) { // Re-render if agenda is visible
                renderAgenda();
            }
            showToast("Horarios actualizados correctamente.");
        }
    });
}
