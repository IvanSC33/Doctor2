// Profile Support Screen

let screenElementsGlobalRef;

export function initProfileSupport(sElements) {
    screenElementsGlobalRef = sElements;
    // No specific event listeners to attach here for now as content is static links.
    console.log("Profile Support module initialized.");
}

export function renderSupportScreen() {
    if (!screenElementsGlobalRef || !screenElementsGlobalRef.support) return;

    screenElementsGlobalRef.support.innerHTML = `
        <div class="flex items-center mb-4">
            <button class="back-to-profile text-2xl text-gray-600 mr-4"><i class="ph-arrow-left"></i></button>
            <h1 class="text-xl font-bold text-gray-800">Soporte y Ayuda</h1>
        </div>

        <div class="space-y-4">
            <div>
                <h3 class="font-semibold text-gray-700 mb-2">Preguntas Frecuentes</h3>
                <div class="space-y-2">
                    <details class="bg-white rounded-lg border">
                        <summary class="font-bold text-gray-800 p-3 cursor-pointer">¿Cómo defino o modifico mis horarios de atención?</summary>
                        <div class="p-3 border-t text-sm text-gray-600">
                            Para establecer tus horarios, ve a la pestaña "Agenda" en la barra de navegación inferior y presiona el botón "Definir Horarios". Podrás seleccionar los días y los bloques de tiempo en los que estarás disponible para consultas.
                        </div>
                    </details>
                    <details class="bg-white rounded-lg border">
                        <summary class="font-bold text-gray-800 p-3 cursor-pointer">¿Cómo funciona el retiro de mis ganancias?</summary>
                        <div class="p-3 border-t text-sm text-gray-600">
                            Puedes retirar tu saldo disponible desde "Perfil" > "Gestión Financiera". Ingresa el monto, elige un método de pago (cuenta bancaria, Yape o Plin) y confirma la transacción. Los fondos se procesarán en un plazo de 24 horas hábiles.
                        </div>
                    </details>
                    <details class="bg-white rounded-lg border">
                        <summary class="font-bold text-gray-800 p-3 cursor-pointer">¿Qué hago si la IA no transcribe correctamente?</summary>
                        <div class="p-3 border-t text-sm text-gray-600">
                            Durante la consulta, puedes editar manualmente cualquier campo del SOAP. Al finalizar, en la pantalla "Revisar y Firmar", tienes la oportunidad de corregir todas las secciones antes de sellar el registro clínico.
                        </div>
                    </details>
                </div>
            </div>

            <div>
                <h3 class="font-semibold text-gray-700 mb-2">Contactar a Soporte</h3>
                <div class="space-y-2">
                    <a href="https://wa.me/51999888777" target="_blank" class="w-full text-left bg-white p-4 rounded-lg border flex items-center gap-3">
                        <i class="ph-whatsapp-logo text-2xl text-green-500"></i>
                        <div>
                            <p class="font-bold">Chatear por WhatsApp</p>
                            <p class="text-xs text-gray-500">Respuesta usualmente en minutos.</p>
                        </div>
                    </a>
                    <a href="mailto:soporte@vitalis.ai" class="w-full text-left bg-white p-4 rounded-lg border flex items-center gap-3">
                        <i class="ph-envelope text-2xl text-blue-500"></i>
                        <div>
                            <p class="font-bold">Enviar un Email</p>
                            <p class="text-xs text-gray-500">soporte@vitalis.ai</p>
                        </div>
                    </a>
                     <a href="tel:+5116401234" class="w-full text-left bg-white p-4 rounded-lg border flex items-center gap-3">
                        <i class="ph-phone text-2xl text-gray-500"></i>
                        <div>
                            <p class="font-bold">Llamar a Central</p>
                            <p class="text-xs text-gray-500">(01) 640-1234</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    `;
}
