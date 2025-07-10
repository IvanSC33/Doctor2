// UI Core Functions (Modals, Toast, Screen Management, Animations)

// --- Elements (Screens, Modal Container, Toast) ---
// These will be initialized by the main script after DOM is loaded,
// or passed to functions if needed. For now, assume they are accessible globally
// or refactor later to pass them explicitly.
let screens = {};
let modalContainer = null;
let toast = null;

export function initUIElements(screenElements, modalElement, toastElement) {
    screens = screenElements;
    modalContainer = modalElement;
    toast = toastElement;
}

// --- Toast Notification ---
let toastTimeout;
export function showToast(message, isPoints = false) {
    if (!toast) return;
    if (isPoints) {
        toast.innerHTML = `${message} <i class="ph-star-fill text-yellow-400 ml-1"></i>`;
    } else {
        toast.textContent = message;
    }
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// --- Screen Management ---
export function showScreen(screenName, data = null, allScreenElements, navItemElements, headerElement, bottomNavElement, fabElement, screenRenderers) {
    if (!allScreenElements || !navItemElements || !headerElement || !bottomNavElement || !fabElement || !screenRenderers) {
        console.error("UI elements or renderers not initialized for showScreen");
        return;
    }

    Object.values(allScreenElements).forEach(s => s.classList.add('hidden'));
    const screenToShow = allScreenElements[screenName];
    if (screenToShow) {
        screenToShow.classList.remove('hidden');
    } else {
        console.warn(`Screen "${screenName}" not found.`);
        // Fallback or error handling
        if (allScreenElements.home) allScreenElements.home.classList.remove('hidden');
        else if (Object.keys(allScreenElements).length > 0) {
            allScreenElements[Object.keys(allScreenElements)[0]].classList.remove('hidden'); // Show the first available screen
        }
    }

    const isFullScreen = ['welcome', 'onboarding', 'register', 'verifySignature', 'registerSuccess', 'forgotPassword', 'forgotSuccess', 'waitingRoom', 'consultation'].includes(screenName);
    const hasNav = ['home', 'agenda', 'patients', 'profile'].includes(screenName);

    headerElement.style.display = hasNav ? 'flex' : 'none';
    bottomNavElement.style.display = hasNav ? 'flex' : 'none';
    fabElement.style.display = (screenName === 'home' && !isFullScreen) ? 'flex' : 'none';


    if (isFullScreen) {
        headerElement.style.display = 'none';
        bottomNavElement.style.display = 'none';
        fabElement.style.display = 'none';
    }

    Object.values(navItemElements).forEach(item => item.classList.remove('active'));
    if (navItemElements[screenName]) {
        navItemElements[screenName].classList.add('active');
    } else if (['financial', 'development', 'security', 'support', 'referrals', 'rewards', 'communityForum', 'forumTopic'].includes(screenName)) {
        if (navItemElements.profile) navItemElements.profile.classList.add('active');
    }

    // Call specific renderer if it exists
    if (screenRenderers[screenName]) {
        screenRenderers[screenName](data);
    }
}

// --- Modal Management ---
export function showModal(content) {
    if (!modalContainer) return;
    modalContainer.innerHTML = content;
    const overlay = modalContainer.querySelector('.modal-overlay');
    if (overlay) {
        setTimeout(() => overlay.classList.add('visible'), 10); // Delay for CSS transition
    }
     // Add event listener for closing modal here to keep logic encapsulated
    const closeButton = modalContainer.querySelector('.modal-close-btn');
    if (closeButton) {
        closeButton.addEventListener('click', hideModal, { once: true });
    }
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) { // Only close if clicking on the overlay itself
                hideModal();
            }
        }, { once: true });
    }
}

export function hideModal() {
    if (!modalContainer) return;
    const overlay = modalContainer.querySelector('.modal-overlay');
    if (overlay) {
        overlay.classList.remove('visible');
        // Remove after transition
        overlay.addEventListener('transitionend', () => {
            if (!overlay.classList.contains('visible')) { // Check if it wasn't re-opened
                 modalContainer.innerHTML = '';
            }
        }, { once: true });
    } else {
        modalContainer.innerHTML = ''; // Fallback if no overlay found
    }
}


// --- Animations ---
export function animateValue(element, start, end, duration, isCurrency = false, prefix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = start + (end - start) * progress;
        if (isCurrency) {
            element.textContent = `${prefix} ${currentValue.toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        } else {
            element.textContent = Math.floor(currentValue);
        }
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
             if (isCurrency) {
                element.textContent = `${prefix} ${end.toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
             } else {
                element.textContent = end.toLocaleString();
             }
        }
    };
    window.requestAnimationFrame(step);
}

export function animateSlotMachine(element, start, end, duration) {
    let current = start;
    const diff = start - end; // Use difference for step calculation
    if (diff === 0) { // If no change, set directly
        element.textContent = `${end.toLocaleString()} Puntos Vitalis`;
        return;
    }
    // Ensure stepTime is positive and reasonable
    const stepTime = Math.max(10, Math.abs(Math.floor(duration / diff)));

    const timer = setInterval(() => {
        if (current > end) {
            current -= 1;
        } else if (current < end) { // Handle cases where points might increase
            current +=1;
        } else { // current === end
            clearInterval(timer);
        }
        element.textContent = `${current.toLocaleString()} Puntos Vitalis`;
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}
