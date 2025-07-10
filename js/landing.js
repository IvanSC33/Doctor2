// js/landing.js

// showScreenFuncRef and showToastFuncRef will be assigned in initLanding
let showScreenFuncGlobal;
let showToastFuncGlobal;

export function initLanding(showScreenFunc, showToastFunc) {
    showScreenFuncGlobal = showScreenFunc;
    showToastFuncGlobal = showToastFunc;

    const landingScreen = document.getElementById('screen-landing');
    if (!landingScreen) {
        console.error("Landing screen element not found for attaching listeners.");
        return;
    }

    landingScreen.addEventListener('click', (e) => {
        const targetButton = e.target.closest('.action-btn');
        if (!targetButton) return;

        e.preventDefault(); // Prevent default for <a> tags if they are used as action-btn

        const action = targetButton.dataset.action;
        const targetScreen = targetButton.dataset.targetScreen;

        if (action === 'login-google') {
            if (showToastFuncGlobal) {
                showToastFuncGlobal("Login con Google no implementado en este prototipo.");
            }
        } else if (action === 'go-to-screen' && targetScreen) {
            if (showScreenFuncGlobal) {
                showScreenFuncGlobal(targetScreen);
            }
        }
    });
    console.log("Landing module initialized and event listeners attached.");
}

// No renderLandingScreen function is needed here as the HTML is static in index.html.
// If it were dynamically rendered, it would go here.
