// État de l'application
let currentView = 'activites'; // 'activites' ou 'salles'
let currentDate = new Date(2026, 1, 25); // Février 2026, jour 25
let currentDateSalles = new Date(2026, 1, 25); // Date pour le calendrier salles
let selectedDate = new Date(2026, 1, 25);

// Noms des jours de la semaine
const weekdays = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

// Noms des mois
const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

// Noms des salles
const salles = [
    'Salle Numérique',
    'Salle Solidaire',
    'Salle Artistique/Culturel',
    'Salle Emploi/Formation'
];

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeCalendar();
    setupEventListeners();
    setupMenuToggle();
});

// Configurer le menu déroulant
function setupMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    // Ouvrir le menu
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebarMenu.classList.add('open');
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Fermer le menu
    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }

    function closeMenu() {
        sidebarMenu.classList.remove('open');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Fermer avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebarMenu.classList.contains('open')) {
            closeMenu();
        }
    });
}

// Initialiser le calendrier
function initializeCalendar() {
    updateCalendar();
    updateViewTitle();
    toggleCalendars();
}

// Changer de mois pour le calendrier salles
function changeMonthSalles(direction) {
    currentDateSalles.setMonth(currentDateSalles.getMonth() + direction);
    updateCalendarSalles();
    updateSelectorsSalles();
}

// Mettre à jour les sélecteurs de mois et année pour salles
function updateSelectorsSalles() {
    document.getElementById('monthSelectSalles').value = currentDateSalles.getMonth();
    document.getElementById('yearSelectSalles').value = currentDateSalles.getFullYear();
}

// Générer et afficher le calendrier salles avec couleurs par salle
function updateCalendarSalles() {
    const calendarGrid = document.getElementById('calendarGridSalles');
    calendarGrid.innerHTML = '';

    // Ajouter les jours de la semaine
    weekdays.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-weekday';
        dayElement.textContent = day;
        calendarGrid.appendChild(dayElement);
    });

    // Obtenir le premier jour du mois et le nombre de jours
    const year = currentDateSalles.getFullYear();
    const month = currentDateSalles.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // 0 = Lundi

    // Ajouter les jours du mois précédent
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const dayElement = createDayElementSalles(daysInPrevMonth - i, true);
        calendarGrid.appendChild(dayElement);
    }

    // Ajouter les jours du mois actuel avec réservations
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(year, month, day);
        const isSelected = dayDate.toDateString() === selectedDate.toDateString();
        const dayElement = createDayElementSalles(day, false, isSelected, dayDate);
        calendarGrid.appendChild(dayElement);
    }

    // Ajouter les jours du mois suivant pour compléter la grille
    const totalCells = calendarGrid.children.length;
    const remainingCells = 42 - totalCells; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createDayElementSalles(day, true);
        calendarGrid.appendChild(dayElement);
    }
}

// Créer un élément de jour pour le calendrier salles avec couleurs
function createDayElementSalles(day, isOtherMonth, isSelected = false, date = null) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;
    
    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    }
    
    if (isSelected) {
        dayElement.classList.add('selected');
    }
    
    // Simuler des réservations pour la démo (à remplacer par de vraies données)
    if (!isOtherMonth && date) {
        // Exemple : certaines dates ont des réservations
        const dayOfMonth = date.getDate();
        const dayOfWeek = date.getDay();
        
        // Simulation de réservations pour démo
        if (dayOfMonth === 5) {
            dayElement.classList.add('salle-numerique');
        } else if (dayOfMonth === 10) {
            dayElement.classList.add('salle-solidaire');
        } else if (dayOfMonth === 15) {
            dayElement.classList.add('salle-artistique');
        } else if (dayOfMonth === 20) {
            dayElement.classList.add('salle-emploi');
        } else if (dayOfMonth === 25) {
            dayElement.classList.add('multiple-salles'); // Plusieurs salles réservées
        }
    }
    
    if (!isOtherMonth) {
        dayElement.addEventListener('click', () => {
            selectDate(new Date(currentDateSalles.getFullYear(), currentDateSalles.getMonth(), day));
            updateCalendarSalles();
        });
    }
    
    return dayElement;
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    // Navigation entre vues (activités/salles)
    document.getElementById('prevView').addEventListener('click', () => {
        switchView(-1);
    });
    
    document.getElementById('nextView').addEventListener('click', () => {
        switchView(1);
    });

    // Navigation du calendrier activités
    document.getElementById('prevMonth').addEventListener('click', () => {
        changeMonth(-1);
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        changeMonth(1);
    });

    // Sélecteurs de mois et année activités
    document.getElementById('monthSelect').addEventListener('change', (e) => {
        currentDate.setMonth(parseInt(e.target.value));
        updateCalendar();
    });
    
    document.getElementById('yearSelect').addEventListener('change', (e) => {
        currentDate.setFullYear(parseInt(e.target.value));
        updateCalendar();
    });

    // Navigation du calendrier salles
    document.getElementById('prevMonthSalles').addEventListener('click', () => {
        changeMonthSalles(-1);
    });
    
    document.getElementById('nextMonthSalles').addEventListener('click', () => {
        changeMonthSalles(1);
    });

    // Navigation entre vues pour les salles (retour à activités)
    const prevViewSalles = document.getElementById('prevViewSalles');
    const nextViewSalles = document.getElementById('nextViewSalles');
    
    if (prevViewSalles) {
        prevViewSalles.addEventListener('click', () => {
            currentView = 'activites';
            updateViewTitle();
            updateCalendar();
            toggleCalendars();
        });
    }
    
    if (nextViewSalles) {
        nextViewSalles.addEventListener('click', () => {
            currentView = 'activites';
            updateViewTitle();
            updateCalendar();
            toggleCalendars();
        });
    }

    // Sélecteurs de mois et année salles
    document.getElementById('monthSelectSalles').addEventListener('change', (e) => {
        currentDateSalles.setMonth(parseInt(e.target.value));
        updateCalendarSalles();
    });
    
    document.getElementById('yearSelectSalles').addEventListener('change', (e) => {
        currentDateSalles.setFullYear(parseInt(e.target.value));
        updateCalendarSalles();
    });

    // Recherche
    document.getElementById('searchInput').addEventListener('input', (e) => {
        handleSearch(e.target.value);
    });
}

// Changer de vue (activités <-> salles)
function switchView(direction) {
    if (currentView === 'activites' && direction === 1) {
        currentView = 'salles';
    } else if (currentView === 'salles' && direction === -1) {
        currentView = 'activites';
    }
    
    updateViewTitle();
    updateCalendar();
    toggleCalendars();
}

// Mettre à jour le titre de la vue
function updateViewTitle() {
    const titleElement = document.getElementById('viewTitle');
    if (currentView === 'activites') {
        titleElement.textContent = 'ACTIVITÉS';
    } else {
        titleElement.textContent = 'SALLES OCCUPÉES';
    }
    
    // Mettre à jour le placeholder de recherche
    const searchInput = document.getElementById('searchInput');
    if (currentView === 'activites') {
        searchInput.placeholder = 'Activités';
    } else {
        searchInput.placeholder = 'Rechercher une salle';
    }
}

// Basculer entre les deux calendriers
function toggleCalendars() {
    const calendarActivites = document.getElementById('calendarActivites');
    const calendarSalles = document.getElementById('calendarSalles');
    const sallesNavigation = document.getElementById('sallesNavigation');
    const sallesLegend = document.getElementById('sallesLegend');
    const searchContainer = document.getElementById('searchContainer');
    const mainNavigation = document.querySelector('.view-navigation');
    
    if (currentView === 'activites') {
        calendarActivites.style.display = 'block';
        calendarSalles.style.display = 'none';
        sallesNavigation.style.display = 'none';
        sallesLegend.style.display = 'none';
        searchContainer.style.display = 'block';
        if (mainNavigation) mainNavigation.style.display = 'flex';
    } else {
        calendarActivites.style.display = 'none';
        calendarSalles.style.display = 'block';
        sallesNavigation.style.display = 'flex';
        sallesLegend.style.display = 'block';
        searchContainer.style.display = 'none';
        if (mainNavigation) mainNavigation.style.display = 'none'; // Cacher la navigation principale
        updateCalendarSalles();
    }
}

// Changer de mois
function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    updateCalendar();
    updateSelectors();
}

// Mettre à jour les sélecteurs de mois et année
function updateSelectors() {
    document.getElementById('monthSelect').value = currentDate.getMonth();
    document.getElementById('yearSelect').value = currentDate.getFullYear();
}

// Générer et afficher le calendrier
function updateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';

    // Ajouter les jours de la semaine
    weekdays.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-weekday';
        dayElement.textContent = day;
        calendarGrid.appendChild(dayElement);
    });

    // Obtenir le premier jour du mois et le nombre de jours
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // 0 = Lundi

    // Ajouter les jours du mois précédent
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const dayElement = createDayElement(daysInPrevMonth - i, true);
        calendarGrid.appendChild(dayElement);
    }

    // Ajouter les jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(year, month, day);
        const isSelected = dayDate.toDateString() === selectedDate.toDateString();
        const dayElement = createDayElement(day, false, isSelected);
        calendarGrid.appendChild(dayElement);
    }

    // Ajouter les jours du mois suivant pour compléter la grille
    const totalCells = calendarGrid.children.length;
    const remainingCells = 42 - totalCells; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createDayElement(day, true);
        calendarGrid.appendChild(dayElement);
    }
}

// Créer un élément de jour
function createDayElement(day, isOtherMonth, isSelected = false) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;
    
    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    }
    
    if (isSelected) {
        dayElement.classList.add('selected');
    }
    
    if (!isOtherMonth) {
        dayElement.addEventListener('click', () => {
            selectDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
        });
    }
    
    return dayElement;
}

// Sélectionner une date
function selectDate(date) {
    selectedDate = new Date(date);
    updateCalendar();
    // Ici, on pourrait charger les activités/salles pour cette date
    loadDataForDate(selectedDate);
}

// Charger les données pour une date donnée
function loadDataForDate(date) {
    // TODO: Implémenter le chargement des activités ou salles pour cette date
    console.log(`Chargement des données pour le ${date.toLocaleDateString('fr-FR')}`);
    if (currentView === 'activites') {
        console.log('Vue: Activités');
    } else {
        console.log(`Vue: ${salles[currentSalleIndex]}`);
    }
}

// Gérer la recherche
function handleSearch(query) {
    // TODO: Implémenter la recherche d'activités ou de salles
    console.log(`Recherche: ${query}`);
}

// Variable pour suivre l'index de la salle actuelle
let currentSalleIndex = 0;
