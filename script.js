document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submit-btn');
    const signatureModal = document.getElementById('signature-modal');
    const toast = document.getElementById('toast-notification');
    const referralInput = document.getElementById('referral-code-input');
    const referralStatus = document.getElementById('referral-code-status');
    let toastTimeout;
    let validationTimeout;

    function showToast(message) {
        clearTimeout(toastTimeout);
        toast.textContent = message;
        toast.classList.add('show');
        toastTimeout = setTimeout(() => { toast.classList.remove('show'); }, 2500);
    }

    function validateReferralCode() {
        const code = referralInput.value.trim().toUpperCase();
        referralStatus.textContent = '';
        referralStatus.classList.remove('text-green-600', 'text-red-600');

        if (!code) return;

        referralStatus.textContent = 'Validando código...';

        clearTimeout(validationTimeout);
        validationTimeout = setTimeout(() => {
            if (code === 'VITALIS-APEREZ-25' || code === 'VITALIS-CMART-25') {
                const doctorName = code === 'VITALIS-APEREZ-25' ? 'Dra. Ana Pérez' : 'Dr. C. Martínez';
                referralStatus.textContent = `✅ Código de ${doctorName} aplicado. ¡Bienvenido!`;
                referralStatus.classList.add('text-green-600');
            } else {
                referralStatus.textContent = '❌ El código no es válido. Por favor, verifícalo o continúa sin él.';
                referralStatus.classList.add('text-red-600');
            }
        }, 800);
    }

    referralInput.addEventListener('input', validateReferralCode);

    submitBtn.addEventListener('click', () => {
        // Basic form validation
        const requiredInputs = document.querySelectorAll('#registration-flow input[required]');
        let allFieldsValid = true;
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                allFieldsValid = false;
                // Add some visual indication for invalid fields if desired
                input.classList.add('border-red-500');
            } else {
                input.classList.remove('border-red-500');
            }
        });

        if (!allFieldsValid) {
            showToast('Por favor, complete todos los campos obligatorios.');
            return;
        }


        if (!document.getElementById('accept-terms').checked) {
            showToast('Debe aceptar los términos y condiciones.');
            return;
        }
        signatureModal.classList.remove('hidden');

        const codeInputs = signatureModal.querySelectorAll('input[type="text"]');
        const autofillMsg = document.getElementById('autofill-message');
        const userPhoneSpan = document.getElementById('user-phone');

        // Simulate fetching phone number (replace with actual logic if available)
        const phoneNumberInput = document.querySelector('input[type="tel"]');
        if (phoneNumberInput && phoneNumberInput.value) {
            const fullNumber = phoneNumberInput.value;
            // Mask part of the number, e.g., +51 *** *** 123
            const maskedNumber = fullNumber.length > 6
                ? `${fullNumber.substring(0, fullNumber.length - 6)}*** ***${fullNumber.substring(fullNumber.length - 3)}`
                : fullNumber; // Or handle shorter numbers differently
            userPhoneSpan.textContent = maskedNumber;
        } else {
            userPhoneSpan.textContent = "+51 *** *** ***"; // Default if no number entered
        }


        autofillMsg.textContent = "Detectando código de SMS...";
        codeInputs.forEach(input => input.value = '');

        setTimeout(() => {
            const code = "123456"; // Simulated code
            for(let i = 0; i < code.length; i++) {
                if(codeInputs[i]) codeInputs[i].value = code[i];
            }
            autofillMsg.textContent = "Código auto-completado desde SMS.";
            showToast("Código de verificación recibido.");
            if(codeInputs.length > 0 && codeInputs[codeInputs.length - 1]) {
                 codeInputs[codeInputs.length - 1].focus();
            }
        }, 2000);
    });

    document.getElementById('close-signature-modal').addEventListener('click', () => {
        signatureModal.classList.add('hidden');
    });

    document.getElementById('confirm-signature-btn').addEventListener('click', () => {
        // Add validation for OTP code inputs if needed
        const codeInputs = signatureModal.querySelectorAll('input[type="text"]');
        let enteredCode = "";
        codeInputs.forEach(input => enteredCode += input.value);

        if (enteredCode.length !== 6 || enteredCode !== "123456") { // Replace "123456" with actual validation logic
            showToast("Código de firma incorrecto. Inténtelo de nuevo.");
            // Optionally clear inputs or shake modal
            codeInputs.forEach(input => input.value = '');
            if(codeInputs.length > 0) codeInputs[0].focus();
            return;
        }

        showToast("Firma validada. Finalizando registro...");
        signatureModal.classList.add('hidden');
        setTimeout(() => {
            document.getElementById('registration-flow').style.display = 'none';
            document.getElementById('final-screen').classList.remove('hidden');
        }, 1500);
    });

    const codeInputs = signatureModal.querySelectorAll('input[type="text"]');
    codeInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => { // Changed from keyup to input for better handling of autofill/paste
            const value = input.value;
            if (value.length === 1 && /^[0-9]$/.test(value) && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                codeInputs[index - 1].focus();
            } else if (e.key === 'ArrowLeft' && index > 0) {
                codeInputs[index-1].focus();
            } else if (e.key === 'ArrowRight' && index < codeInputs.length - 1) {
                codeInputs[index+1].focus();
            }
        });
        // Handle paste
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim();
            if (/^[0-9]+$/.test(pasteData)) {
                for (let i = 0; i < pasteData.length && (index + i) < codeInputs.length; i++) {
                    codeInputs[index + i].value = pasteData[i];
                }
                const nextFocusIndex = Math.min(index + pasteData.length, codeInputs.length -1);
                codeInputs[nextFocusIndex].focus();
                if (nextFocusIndex === codeInputs.length -1 && codeInputs[nextFocusIndex].value !== '') {
                     // If last input is filled by paste, attempt to confirm
                     // This is optional, could also just focus the confirm button
                }
            }
        });
    });
});
