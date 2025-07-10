// Navigation handling
import { showScreen as _showScreen } from './ui.js'; // Aliasing to avoid conflict if showScreen is also defined here

let screenElements, navItemElements, headerElement, bottomNavElement, fabElement, screenRenderers;

export function initNavigation(sElements, nItems, hElement, bNavElement, fElement, sRenderers) {
    screenElements = sElements;
    navItemElements = nItems;
    headerElement = hElement;
    bottomNavElement = bNavElement;
    fabElement = fElement;
    screenRenderers = sRenderers; // Store the renderers

    // Attach event listeners
    attachNavEventListeners();
    attachProfileSubMenuListeners();
    attachBackButtonListeners();
}

// Wrapper for showScreen to pass all necessary elements from this module's scope
function showScreen(screenName, data = null) {
    _showScreen(screenName, data, screenElements, navItemElements, headerElement, bottomNavElement, fabElement, screenRenderers);
}


function attachNavEventListeners() {
    if (navItemElements.home) navItemElements.home.addEventListener('click', () => showScreen('home'));
    if (navItemElements.agenda) navItemElements.agenda.addEventListener('click', () => showScreen('agenda'));
    if (navItemElements.patients) navItemElements.patients.addEventListener('click', () => showScreen('patients'));
    if (navItemElements.profile) navItemElements.profile.addEventListener('click', () => showScreen('profile'));
}

function attachProfileSubMenuListeners() {
    // This listener needs to be on a parent that exists at load time, like document.body or a main container for profile screen items.
    // If screen-profile is always in the DOM, this is fine. Otherwise, use event delegation from a higher static parent.
    // Assuming screenElements.profile is the container for these items or they are always present.

    // Using document.body for event delegation for dynamically added .profile-menu-item or items within dynamic screens.
    document.body.addEventListener('click', (e) => {
        const profileMenuItem = e.target.closest('.profile-menu-item');
        if (profileMenuItem && profileMenuItem.dataset.target) {
            const targetScreen = profileMenuItem.dataset.target;
            showScreen(targetScreen);
        }
    });
}

function attachBackButtonListeners() {
    // Using document.body for event delegation for dynamically added back buttons.
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.back-to-profile')) {
            showScreen('profile');
        }
        if (e.target.closest('.back-to-development')) {
            showScreen('development');
        }
        if (e.target.closest('.back-to-forum')) {
            showScreen('communityForum');
        }
        if (e.target.closest('#back-to-patients')) {
            showScreen('patients');
        }
        if (e.target.closest('#back-to-home-from-review')) {
            showScreen('home');
        }
        // Add more back buttons here as needed, e.g., from auth flow
        if (e.target.closest('#back-to-login-from-register') || e.target.closest('.back-to-login-btn')) {
             e.preventDefault(); // Prevent default if it's a link
            showScreen('onboarding');
        }
    });
}
