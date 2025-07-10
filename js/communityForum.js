import * as store from './store.js';
import { showModal, hideModal, showToast } from './ui.js';

let screenElementsGlobalRef;
let showScreenFunc; // To call _showScreenWrapper from main script for navigation

export function initCommunityForum(sElements, sShowScreenFunc) {
    screenElementsGlobalRef = sElements;
    showScreenFunc = sShowScreenFunc; // Store the main showScreen wrapper
    attachForumEventListeners();
}

export function renderCommunityForumScreen(filteredTopics = store.professionalData.forumTopics) {
    if (!screenElementsGlobalRef || !screenElementsGlobalRef.communityForum) return;
    screenElementsGlobalRef.communityForum.innerHTML = `
        <div class="flex items-center mb-4">
            <button class="back-to-development text-2xl text-gray-600 mr-4"><i class="ph-arrow-left"></i></button>
            <h1 class="text-xl font-bold text-gray-800">Foro de la Comunidad</h1>
        </div>
        <div class="flex gap-2 mb-4">
            <div class="relative flex-grow">
                <input type="text" id="forum-search-input" placeholder="Buscar en el foro..." class="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-white">
                <i class="ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
            <button id="new-topic-btn" class="bg-blue-600 text-white px-4 rounded-lg font-semibold flex items-center justify-center"><i class="ph-plus text-xl"></i></button>
        </div>
        <div id="forum-topics-container" class="space-y-3">
            ${filteredTopics.map(topic => `
                <div class="bg-white p-4 rounded-lg border border-gray-200 cursor-pointer view-topic-btn" data-topic-id="${topic.id}">
                    <div class="flex justify-between items-start"><h3 class="font-bold text-gray-800 mb-1 flex-grow">${topic.title}</h3><span class="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800 whitespace-nowrap">${topic.category}</span></div>
                    <p class="text-xs text-gray-500">Por: ${topic.author} - ${topic.date}</p>
                    <div class="flex items-center justify-end text-sm text-gray-600 mt-2"><i class="ph-chat-circle-dots mr-1"></i><span>${topic.comments.length} Comentarios</span></div>
                </div>`).join('') || '<p class="text-center text-gray-500 mt-8">No se encontraron temas.</p>'}
        </div>`;
}

export function renderForumTopicDetailScreen(topicId) {
    if (!screenElementsGlobalRef || !screenElementsGlobalRef.forumTopic) return;
    const topic = store.professionalData.forumTopics.find(t => t.id === topicId);
    if (!topic) {
        showToast("Tema no encontrado.");
        if (showScreenFunc) showScreenFunc('communityForum'); // Navigate back
        return;
    }
    screenElementsGlobalRef.forumTopic.innerHTML = `
        <div class="flex items-center mb-4">
            <button class="back-to-forum text-2xl text-gray-600 mr-4"><i class="ph-arrow-left"></i></button>
            <h1 class="text-xl font-bold text-gray-800 truncate">${topic.title}</h1>
        </div>
        <div class="bg-white p-4 rounded-lg border mb-4">
            <div class="flex justify-between items-center mb-2"><p class="text-sm text-gray-600">Por <span class="font-semibold">${topic.author}</span> el ${topic.date}</p><span class="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800">${topic.category}</span></div>
            <p class="text-gray-800">${topic.description}</p>
        </div>
        <h2 class="font-bold text-lg text-gray-800 mb-3">Comentarios (${topic.comments.length})</h2>
        <div id="comments-container" class="space-y-3 mb-4">
            ${topic.comments.map(comment => `<div class="bg-white p-3 rounded-lg border"><p class="text-sm text-gray-800">${comment.text}</p><p class="text-xs text-gray-500 mt-2">-- <span class="font-semibold">${comment.author}</span>, ${comment.date}</p></div>`).join('') || '<p class="text-sm text-gray-500 bg-white p-3 rounded-lg border">No hay comentarios aún.</p>'}
        </div>
        <div class="bg-white p-3 rounded-lg border">
             <h3 class="font-semibold text-gray-700 mb-2">Añadir un Comentario</h3>
             <textarea id="new-comment-input" class="w-full p-2 border rounded-md h-20" placeholder="Escribe tu comentario..."></textarea>
             <button id="submit-comment-btn" data-topic-id="${topic.id}" class="w-full bg-blue-600 text-white py-2 mt-2 rounded-lg font-semibold">Enviar Comentario</button>
        </div>`;
}

function openNewTopicModal() {
    showModal(`
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="flex justify-between items-center mb-4"><h2 class="font-bold text-lg text-gray-800">Iniciar Nuevo Tema</h2><button class="modal-close-btn text-gray-500"><i class="ph-x text-xl"></i></button></div>
                <div class="space-y-3">
                    <input id="new-topic-title" type="text" placeholder="Título del Tema" class="w-full p-2 border rounded-md">
                    <textarea id="new-topic-description" class="w-full p-2 border rounded-md h-24" placeholder="Descripción..."></textarea>
                    <select id="new-topic-category" class="w-full p-2 border rounded-md bg-white"><option value="" disabled selected>Categoría</option><option>Cardiología</option><option>Tecnología Médica</option><option>General</option></select>
                </div>
                <div class="flex space-x-2 mt-6"><button class="modal-close-btn w-full bg-gray-200 py-2 rounded-lg">Cancelar</button><button id="submit-new-topic-btn" class="w-full bg-blue-600 text-white py-2 rounded-lg">Publicar</button></div>
            </div>
        </div>`);
}

function attachForumEventListeners() {
    document.body.addEventListener('input', (e) => {
        if (e.target.matches('#forum-search-input') && screenElementsGlobalRef.communityForum && !screenElementsGlobalRef.communityForum.classList.contains('hidden')) {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = store.professionalData.forumTopics.filter(topic =>
                topic.title.toLowerCase().includes(searchTerm) ||
                topic.description.toLowerCase().includes(searchTerm) ||
                topic.category.toLowerCase().includes(searchTerm)
            );
            renderCommunityForumScreen(filtered); // Re-render the list part
        }
    });

    document.body.addEventListener('click', (e) => {
        const isForumScreenActive = screenElementsGlobalRef.communityForum && !screenElementsGlobalRef.communityForum.classList.contains('hidden');
        const isTopicScreenActive = screenElementsGlobalRef.forumTopic && !screenElementsGlobalRef.forumTopic.classList.contains('hidden');
        const isModalActive = document.querySelector('#modal-container .modal-overlay.visible');

        // Only proceed if on relevant screen or modal is active for forum actions
        if (!isForumScreenActive && !isTopicScreenActive && !isModalActive) return;

        if (e.target.closest('#new-topic-btn') && isForumScreenActive) {
            openNewTopicModal();
        }
        if (e.target.closest('#submit-new-topic-btn') && isModalActive) { // Check if modal is active
            const titleInput = document.getElementById('new-topic-title');
            const descriptionInput = document.getElementById('new-topic-description');
            const categoryInput = document.getElementById('new-topic-category');
            if (titleInput && descriptionInput && categoryInput) {
                const title = titleInput.value; const description = descriptionInput.value; const category = categoryInput.value;
                if (title && description && category) {
                    const newTopic = { id: Date.now(), title, description, category, author: 'Dra. Ana Pérez', date: new Date().toLocaleDateString('es-PE'), comments: [] };
                    store.professionalData.forumTopics.unshift(newTopic);
                    store.professionalData.points += 5;
                    renderCommunityForumScreen(); // Re-render the main forum screen
                    hideModal();
                    showToast('¡Tema creado! +5 Puntos Vitalis', true);
                } else { showToast('Por favor complete todos los campos.'); }
            }
        }
        if (e.target.closest('.view-topic-btn') && isForumScreenActive) {
            const topicId = parseInt(e.target.closest('.view-topic-btn').dataset.topicId);
            if (showScreenFunc) showScreenFunc('forumTopic', topicId);
        }
        if (e.target.closest('#submit-comment-btn') && isTopicScreenActive) {
            const topicId = parseInt(e.target.dataset.topicId);
            const commentInput = document.getElementById('new-comment-input');
            if (commentInput) {
                const commentText = commentInput.value;
                const topic = store.professionalData.forumTopics.find(t => t.id === topicId);
                if (commentText && topic) {
                    const newComment = { id: Date.now(), author: 'Dra. Ana Pérez', text: commentText, date: new Date().toLocaleDateString('es-PE') };
                    topic.comments.push(newComment);
                    store.professionalData.points += 2;
                    renderForumTopicDetailScreen(topicId); // Re-render topic detail
                    showToast('¡Comentario añadido! +2 Puntos Vitalis', true);
                } else { showToast('Por favor escriba un comentario.'); }
            }
        }
    });
}
