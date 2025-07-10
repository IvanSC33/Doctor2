import { initUIElements, showToast as uiShowToast, showScreen as uiShowScreen, showModal, hideModal, animateValue, animateSlotMachine } from './js/ui.js';
import { initNavigation } from './js/navigation.js';
import { initAuth, authScreenRenderers } from './js/auth.js';
import * as store from './js/store.js';
import { initHome, renderNextConsultation as homeRenderNextConsultation, renderTasks as homeRenderTasks } from './js/home.js';
import { initAgenda, renderAgenda as agendaRenderAgenda } from './js/agenda.js';
import { initPatients, renderPatientsScreen, renderPatientHistoryScreen } from './js/patients.js';
import { initProfile, renderProfileScreen } from './js/profile.js';
import { initProfileFinancial, renderFinancialScreen as financialRenderScreen } from './js/profileFinancial.js';
import { initProfileDevelopment, renderDevelopmentScreen as developmentRenderScreen } from './js/profileDevelopment.js';
import { initProfileSecurity, renderSecurityScreen as securityRenderScreen } from './js/profileSecurity.js';
import { initProfileSupport, renderSupportScreen as supportRenderScreen } from './js/profileSupport.js';
import { initProfileReferrals, renderReferralsScreen as referralsRenderScreen } from './js/profileReferrals.js';
import { initProfileRewards, renderRewardsScreen as rewardsRenderScreen } from './js/profileRewards.js';
import { initCommunityForum, renderCommunityForumScreen, renderForumTopicDetailScreen } from './js/communityForum.js';
import { initConsultationFlow, renderWaitingRoomScreen, renderConsultationScreenActive, renderReviewSignScreen } from './js/consultation.js';
import { initLanding } from './js/landing.js'; // Import initLanding

document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const screenElements = {
        landing: document.getElementById('screen-landing'), // New landing screen
        emailLogin: document.getElementById('screen-email-login'), // New email login screen
        onboarding: document.getElementById('screen-onboarding'), // Kept for now, might be deprecated
        home: document.getElementById('screen-home'),
        agenda: document.getElementById('screen-agenda'),
        patients: document.getElementById('screen-patients'),
        patientHistory: document.getElementById('screen-patient-history'),
        profile: document.getElementById('screen-profile'),
        waitingRoom: document.getElementById('screen-waiting-room'),
        consultation: document.getElementById('screen-consultation'),
        reviewSign: document.getElementById('screen-review-sign'),
        financial: document.getElementById('screen-financial'),
        development: document.getElementById('screen-development'),
        security: document.getElementById('screen-security'),
        support: document.getElementById('screen-support'),
        referrals: document.getElementById('screen-referrals'),
        rewards: document.getElementById('screen-rewards'),
        communityForum: document.getElementById('screen-community-forum'),
        forumTopic: document.getElementById('screen-forum-topic'),
        register: document.getElementById('screen-register'),
        verifySignature: document.getElementById('screen-verify-signature'),
        registerSuccess: document.getElementById('screen-register-success'),
        forgotPassword: document.getElementById('screen-forgot-password'),
        forgotSuccess: document.getElementById('screen-forgot-success'),
        // Note: screen-welcome is removed
    };
    const navItemElements = {
        home: document.getElementById('nav-home'),
        agenda: document.getElementById('nav-agenda'),
        patients: document.getElementById('nav-patients'),
        profile: document.getElementById('nav-profile'),
    };
    const headerElement = document.getElementById('header');
    const bottomNavElement = document.getElementById('bottom-nav');
    const fabElement = document.getElementById('fab-ai');
    const toastElement = document.getElementById('toast-notification');
    const modalContainerElement = document.getElementById('modal-container');

    initUIElements(screenElements, modalContainerElement, toastElement);

    // --- RENDER FUNCTIONS (mostly moved or very simple) ---
    // renderWelcomeScreen is removed.
    // Most other render functions are now imported from their respective modules and used in screenRenderers.

    // Example of a simple render function that might remain if not complex enough for its own file yet:
    // function renderSimpleScreenTemplate(screenId, title) {
    //     if (screenElements[screenId]) {
    //         screenElements[screenId].innerHTML = `<div class="p-4"><h1 class="text-xl font-bold">${title}</h1><p>Content for ${title}...</p></div>`;
    //     }
    // }

    const screenRenderers = {
        landing: null, // Static HTML, no JS render function needed
        // welcome: renderWelcomeScreen, // Removed
        home: () => { homeRenderNextConsultation(); homeRenderTasks(); },
        agenda: agendaRenderAgenda,
        patients: renderPatientsScreen,
        patientHistory: renderPatientHistoryScreen,
        profile: renderProfileScreen,
        financial: financialRenderScreen,
        development: developmentRenderScreen,
        security: securityRenderScreen,
        support: supportRenderScreen,
        referrals: referralsRenderScreen,
        rewards: rewardsRenderScreen,
        communityForum: renderCommunityForumScreen,
        forumTopic: renderForumTopicDetailScreen,
        waitingRoom: renderWaitingRoomScreen,
        consultation: renderConsultationScreenActive,
        reviewSign: renderReviewSignScreen,
        ...authScreenRenderers // This includes onboarding, emailLogin, register, verifySignature, etc.
    };

    // This wrapper is crucial for passing all necessary context to uiShowScreen
    function _showScreenWrapper(screenName, data = null) {
        uiShowScreen(screenName, data, screenElements, navItemElements, headerElement, bottomNavElement, fabElement, screenRenderers);
    }

    // Initialize all modules
    initNavigation(screenElements, navItemElements, headerElement, bottomNavElement, fabElement, screenRenderers, _showScreenWrapper); // Pass _showScreenWrapper
    initAuth(screenElements, _showScreenWrapper, uiShowToast); // Pass _showScreenWrapper and uiShowToast
    initHome(screenElements, _showScreenWrapper, uiShowToast); // Pass necessary functions if home needs to trigger navigation/toasts
    initAgenda(screenElements, _showScreenWrapper);
    initPatients(screenElements, navItemElements, headerElement, bottomNavElement, fabElement, screenRenderersFromMain /* This was 'screenRenderers', but should be more specific or passed as _showScreenWrapper */, _showScreenWrapper, uiShowToast);
    initProfile(screenElements, _showScreenWrapper);
    initProfileFinancial(screenElements, _showScreenWrapper, screenRenderers /* or specific renderers needed by financial */, uiShowToast);
    initProfileDevelopment(screenElements, _showScreenWrapper);
    initProfileSecurity(screenElements, _showScreenWrapper, screenRenderers, uiShowToast);
    initProfileSupport(screenElements, _showScreenWrapper);
    initProfileReferrals(screenElements, _showScreenWrapper, uiShowToast);
    initProfileRewards(screenElements, _showScreenWrapper, uiShowToast);
    initCommunityForum(screenElements, _showScreenWrapper, uiShowToast);
    initConsultationFlow(screenElements, _showScreenWrapper, homeRenderNextConsultation, homeRenderTasks, uiShowToast);
    initLanding(_showScreenWrapper, uiShowToast); // Initialize new landing module, pass only needed functions


    // --- Global Event Listeners (minimal, most should be in modules) ---
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('#fab-ai')) {
            showModal(`
                <div class="modal-overlay">
                    <div class="modal-content">
                        <div class="flex justify-between items-center mb-4"><h2 class="font-bold text-lg text-gray-800 flex items-center"><i class="ph-brain mr-2"></i>Asistente Clínico IA</h2><button class="modal-close-btn text-gray-500"><i class="ph-x text-xl"></i></button></div>
                        <div class="bg-gray-100 p-3 rounded-lg text-sm text-gray-700 mb-4 h-48 overflow-y-auto"><p>Hola Dra. Pérez, ¿en qué puedo ayudarle?</p></div>
                        <input type="text" placeholder="Escriba su consulta..." class="w-full p-2 border rounded-md">
                    </div></div>`);
        }
        if (e.target.closest('#online-toggle')) {
            const toggle = e.target.closest('#online-toggle');
            const indicator = toggle.querySelector('span');
            const statusText = document.getElementById('online-status-text');
            toggle.classList.toggle('available'); // Assuming 'available' class drives bg-color via Tailwind
            if (toggle.classList.contains('available')) {
                indicator.style.transform = 'translateX(22px)'; statusText.textContent = 'Disponible Ahora'; statusText.className = 'online-status-text available'; uiShowToast('Ahora estás disponible');
            } else {
                indicator.style.transform = 'translateX(4px)'; statusText.textContent = 'No Disponible'; statusText.className = 'online-status-text unavailable'; uiShowToast('Ahora no estás disponible');
            }
        }
    });

    _showScreenWrapper('landing'); // Show the new landing screen by default
});
