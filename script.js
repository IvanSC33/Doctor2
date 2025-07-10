import { initUIElements, showToast, showScreen as uiShowScreen, showModal, hideModal, animateValue, animateSlotMachine } from './js/ui.js';
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


document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const screenElements = {
        welcome: document.getElementById('screen-welcome'),
        onboarding: document.getElementById('screen-onboarding'),
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

    // --- RENDER FUNCTIONS (to be further modularized or that are very simple) ---
    // MOVED: All major screen renderers to their respective modules.

    function renderWelcomeScreen() {
        screenElements.welcome.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full animate-pulse">
                <svg class="w-24 h-24 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/></svg>
                <h1 class="text-3xl font-bold text-gray-800 mt-4">Vitalis AI</h1>
                <p class="text-gray-500">Su asistente médico inteligente</p>
            </div>`;
        setTimeout(() => {
            const welcomeScreenElement = screenElements.welcome;
            if (welcomeScreenElement) {
                welcomeScreenElement.classList.add('fade-out');
                welcomeScreenElement.addEventListener('animationend', () => {
                    _showScreenWrapper('onboarding');
                }, { once: true });
            }
        }, 2500);
    }

    const screenRenderers = {
        welcome: renderWelcomeScreen,
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
        ...authScreenRenderers
    };

    function _showScreenWrapper(screenName, data = null) {
        uiShowScreen(screenName, data, screenElements, navItemElements, headerElement, bottomNavElement, fabElement, screenRenderers);
    }

    // Initialize all modules
    initNavigation(screenElements, navItemElements, headerElement, bottomNavElement, fabElement, screenRenderers);
    initAuth(screenElements, navItemElements, headerElement, bottomNavElement, fabElement, screenRenderers);
    initHome(); // screenElements already available via ui.js or passed if needed by home.js init
    initAgenda(screenElements);
    initPatients(screenElements, navItemElements, headerElement, bottomNavElement, fabElement, screenRenderers);
    initProfile(screenElements);
    initProfileFinancial(screenElements, _showScreenWrapper, screenRenderers);
    initProfileDevelopment(screenElements);
    initProfileSecurity(screenElements, _showScreenWrapper, screenRenderers);
    initProfileSupport(screenElements);
    initProfileReferrals(screenElements);
    initProfileRewards(screenElements);
    initCommunityForum(screenElements, _showScreenWrapper);
    initConsultationFlow(screenElements, _showScreenWrapper, homeRenderNextConsultation, homeRenderTasks);


    // --- Global Event Listeners (minimal, most should be in modules) ---
    document.body.addEventListener('click', (e) => {
        // FAB and Online Toggle are global UI elements, their listeners can remain here or move to a dedicated global UI interaction module
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
            toggle.classList.toggle('available');
            if (toggle.classList.contains('available')) {
                indicator.style.transform = 'translateX(22px)'; statusText.textContent = 'Disponible Ahora'; statusText.className = 'online-status-text available'; showToast('Ahora estás disponible');
            } else {
                indicator.style.transform = 'translateX(4px)'; statusText.textContent = 'No Disponible'; statusText.className = 'online-status-text unavailable'; showToast('Ahora no estás disponible');
            }
        }
        // Other very generic global listeners could be here, but most specific interactions are now in modules.
    });

    // --- Helper Functions (Consider moving to a utils.js or specific modules if not already) ---
    // Most helpers like open...Modal, render...Items, simulate... are now in their respective modules.
    // fetchAccountHolderName is in profileFinancial.js
    // generatePDF is in patients.js

    _showScreenWrapper('welcome');
});
