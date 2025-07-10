// Data Store for the application

// --- Mock API Database (for lookups) ---
export const mockApiDatabase = {
    yape: { '987654321': 'ANA M. PEREZ G.' },
    plin: { '912345678': 'ANA PEREZ' },
    bank: { '19112345678099': 'ANA MARIA PEREZ GARCIA' }
};

// --- Application State / Data ---
export let financialData = {
    balance: 9450,
    piggyBank: 300,
    transactions: [
        { id: `VIT-${Date.now() - 10000}`, date: '04/07/2025', description: 'Consulta - Jorge García', amount: 150 },
        { id: `VIT-${Date.now() - 20000}`, date: '02/07/2025', description: 'Consulta - María López', amount: 150 },
        { id: `VIT-${Date.now() - 30000}`, date: '01/07/2025', description: 'Retiro a Cuenta BCP', amount: -2000 },
        { id: `VIT-${Date.now() - 40000}`, date: '28/06/2025', description: 'Consulta - Carlos Mendoza', amount: 150 },
    ],
    bankAccounts: [], // Example: { bank: 'BCP', accountNumber: '123...', holderName: 'Ana Perez', cci: '...' }
    yape: null, // Example: { name: 'Ana Perez', number: '987654321' }
    plin: null, // Example: { name: 'Ana Perez', number: '912345678' }
    lastWithdrawalId: null
};

export let referralsDB = [
    { name: 'Dr. Carlos Martínez', date: '15/06/2025', status: 'Completado', earnings: 50 },
    { name: 'Dra. Lucía Torres', date: '22/06/2025', status: 'Completado', earnings: 50 },
    { name: 'Dr. Javier Ríos', date: '01/07/2025', status: 'Pendiente', earnings: 0 }
];

export let professionalData = {
    points: 1235,
    level: 'Médico Senior',
    nextLevel: 'Médico Confiable',
    nextLevelPoints: 1250,
    rewards: [
        { id: 1, title: 'Ser Ponente en Evento Virtual', description: 'Postula un tema para dar una conferencia a la comunidad de pacientes y aumenta tu visibilidad.', cost: 150, type: 'apply', claimed: false, status: 'available' },
        { id: 2, title: 'Acceso a Herramientas Premium IA', description: 'Acceso anticipado a nuevas funcionalidades de diagnóstico avanzado.', cost: 300, type: 'redeem', claimed: false },
        { id: 3, title: 'Asesoría de Marca Personal', description: 'Sesiones uno a uno con expertos en marketing digital para potenciar tu presencia en línea.', cost: 450, type: 'redeem', claimed: false },
    ],
    forumTopics: [
        {
            id: 1,
            title: 'Manejo de la Hipertensión Arterial en Pacientes Diabéticos',
            description: 'Abro este hilo para discutir las últimas guías y nuestras experiencias clínicas en el manejo de la HTA en pacientes con DM2. ¿Cuáles son sus esquemas de tratamiento preferidos? ¿Cómo abordan la inercia terapéutica?',
            category: 'Cardiología',
            author: 'Dr. Carlos Martínez',
            date: '03/07/2025',
            comments: [
                { id: 101, author: 'Dra. Lucía Torres', text: 'Excelente tema. Personalmente, he tenido buenos resultados iniciando con un IECA/ARA II y un bloqueador de los canales de calcio. Es crucial monitorizar la función renal.', date: '04/07/2025' },
                { id: 102, author: 'Dra. Ana Pérez', text: 'Concuerdo, Dra. Torres. También es importante la educación al paciente sobre la adherencia. Muchos no entienden la conexión entre ambas patologías.', date: '05/07/2025' }
            ]
        },
        {
            id: 2,
            title: 'Uso de la Inteligencia Artificial en el Diagnóstico por Imágenes',
            description: '¿Qué herramientas de IA están utilizando actualmente para analizar radiografías o tomografías? Me interesa conocer plataformas y su precisión en la práctica diaria.',
            category: 'Tecnología Médica',
            author: 'Dr. Javier Ríos',
            date: '02/07/2025',
            comments: []
        }
    ]
};

export let patientsDB = [
    {
        id: 1, name: 'Jorge García', details: '34 años, Masculino, 1.75m, 80kg', avatar: 'https://placehold.co/80x80/dbeafe/1e3a8a?text=JG', allergies: 'Penicilina', adherence: 85,
        consultations: [
            { date: '04/07/2025', doctor: 'Dra. Ana Pérez', triage: { 'PA': '145/92 mmHg', 'T': '36.8°C', 'FC': '88 lpm', 'FR': '18 rpm' }, soap: { s: 'Cefalea occipital...', o: 'PA elevada.', a: 'HTA descompensada.', p: 'Ajustar Losartán...' }, exams: [ { name: 'Lab Order', file: 'lab_order_040725.pdf' } ] },
            { date: '01/06/2025', doctor: 'Dr. Carlos Martínez', triage: { 'PA': '130/85 mmHg', 'T': '36.5°C', 'FC': '80 lpm', 'FR': '16 rpm' }, soap: { s: 'Control HTA.', o: 'PA controlada.', a: 'HTA controlada.', p: 'Continuar tto.' }, exams: [ { name: 'Follow-up Note', file: 'followup_note_010625.pdf' } ] }
        ]
    },
    {
        id: 2, name: 'María López', details: '28 años, Femenino, 1.65m, 60kg', avatar: 'https://placehold.co/80x80/fce7f3/831843?text=ML', allergies: 'Ninguna conocida', adherence: 95,
        consultations: [ { date: '02/07/2025', doctor: 'Dra. Ana Pérez', triage: { 'PA': '120/80 mmHg', 'T': '37.0°C', 'FC': '75 lpm', 'FR': '16 rpm' }, soap: { s: 'Migraña seguimiento.', o: 'Examen normal.', a: 'Migraña.', p: 'Continuar profilaxis.' }, exams: [ { name: 'Referral Neuro', file: 'referral_neuro_020725.pdf' } ] } ]
    },
    {
        id: 3, name: 'Carlos Mendoza', details: '45 años, Masculino, 1.80m, 90kg', avatar: 'https://placehold.co/80x80/dcfce7/14532d?text=CM', allergies: 'AINEs', adherence: 70,
        consultations: [ { date: '28/06/2025', doctor: 'Dr. Luis Torres', triage: { 'PA': '135/88 mmHg', 'T': '36.9°C', 'FC': '92 lpm', 'FR': '20 rpm' }, soap: { s: 'Tos y fiebre.', o: 'Roncantes difusos.', a: 'Bronquitis aguda.', p: 'Amoxicilina.' }, exams: [ { name: 'Lab Results', file: 'lab_results_280625.pdf' } ] } ]
    },
    {
        id: 4, name: 'Sofía Rodríguez', details: '52 años, Femenino, 1.60m, 72kg', avatar: 'https://placehold.co/80x80/f3e8ff/581c87?text=SR', allergies: 'Yodo', adherence: 90,
        consultations: []
    }
];

export let nextConsultation = {
    visible: true,
    patient: 'Jorge García',
    time: '10:00 AM',
    reason: 'Seguimiento de hipertensión',
    status: 'scheduled' // 'scheduled', 'pending_review'
};

export let tasks = [
    { id: 1, text: 'Revisar resultados de laboratorio', patient: 'Carlos Mendoza', status: 'pending', items: [] },
    { id: 2, text: 'Consulta Firmada', patient: 'María López', status: 'completed', completedAt: '01/07/2025 - 10:30 AM', items: [] },
];

// Items generated during a consultation, before being finalized into a task's items for review
export let consultationItems = [];

export let doctorAvailability = {
    'Lunes': ['09:00 - 11:00', '15:00 - 17:00'],
    'Martes': ['09:00 - 11:00'],
    'Miércoles': ['09:00 - 11:00', '18:00 - 20:00'],
    'Jueves': [],
    'Viernes': ['09:00 - 11:00'],
    'Sábado': [],
    'Domingo': []
};

// If you need to modify these from other modules, you might export functions
// that handle the modification to keep the store as the single source of truth.
// For example:
// export function updateBalance(newBalance) {
//     financialData.balance = newBalance;
// }
// export function addTransaction(transaction) {
//    financialData.transactions.unshift(transaction);
// }
// etc.
// For now, direct export and import is simpler for this prototype stage.
