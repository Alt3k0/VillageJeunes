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

const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

// Noms des salles
const salles = [
    'Salle Numérique',
    'Salle Solidaire',
    'Salle Artistique/Culturel',
    'Salle Emploi/Formation'
];

// Catégories d'activités avec leurs couleurs (correspondent aux salles)
const activityCategories = {
    'numerique': {
        name: 'Numérique',
        color: '#1f658e' // Bleu - Salle Numérique
    },
    'solidaire': {
        name: 'Solidaire',
        color: '#649d50' // Vert - Salle Solidaire
    },
    'artistique': {
        name: 'Artistique/Culturel',
        color: '#f08d35' // Orange - Salle Artistique/Culturel
    },
    'formation': {
        name: 'Formation/Atelier',
        color: '#9b59b6' // Violet - Salle Emploi/Formation
    }
};

// Données d'activités (générées pour toute l'année)
let activitiesData = {};
let allActivitiesList = []; // Liste de toutes les activités uniques avec leurs dates

// Variables pour le widget de détail d'activité
let currentActivityDetail = null;
let currentActivityList = [];
let currentActivityIndex = 0;
let activityDetailContext = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Générer les activités pour toute l'année
    const year = currentDate.getFullYear();
    activitiesData = generateYearActivities(year);
    
    initializeCalendar();
    setupEventListeners();
    setupMenuToggle();
    setupActivityWidgets();
    setupAddActivityWidget();
    
    // Fonction d'alignement désactivée pour déboguer
    // setTimeout(() => {
    //     alignViewNavigation();
    // }, 100);
    
    // window.addEventListener('resize', () => {
    //     setTimeout(alignViewNavigation, 50);
    // });
});

// Aligner la hauteur de view-navigation avec sallesNavigation
function alignViewNavigation() {
    const sallesNav = document.getElementById('sallesNavigation');
    const activitesNav = document.querySelector('.view-navigation:not(#sallesNavigation)');
    
    if (sallesNav && activitesNav) {
        // Temporairement afficher sallesNavigation pour calculer sa position
        const originalDisplay = sallesNav.style.display;
        sallesNav.style.display = 'flex';
        sallesNav.style.visibility = 'hidden';
        
        // Calculer la position depuis le top de la page
        const sallesRect = sallesNav.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const sallesTopPosition = sallesRect.top + scrollTop;
        
        // Calculer la position actuelle de activitesNav
        const activitesRect = activitesNav.getBoundingClientRect();
        const activitesCurrentTop = activitesRect.top + scrollTop;
        
        // Calculer la différence
        const difference = sallesTopPosition - activitesCurrentTop;
        
        // Restaurer l'affichage original de sallesNavigation
        sallesNav.style.display = originalDisplay;
        sallesNav.style.visibility = '';
        
        // Appliquer la différence comme margin-top
        if (Math.abs(difference) > 1) {
            activitesNav.style.marginTop = `${difference}px`;
        }
    }
}

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

    const year = currentDateSalles.getFullYear();
    const month = currentDateSalles.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // 0 = Lundi

    // Ajouter les jours du mois précédent (rendus cliquables)
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const prevDay = daysInPrevMonth - i;
        const prevDayDate = new Date(year, month - 1, prevDay);
        const isSelected = prevDayDate.toDateString() === selectedDate.toDateString();
        const dayElement = createDayElementSalles(prevDay, true, isSelected, prevDayDate, year, month - 1);
        calendarGrid.appendChild(dayElement);
    }

    // Ajouter les jours du mois actuel avec réservations
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(year, month, day);
        const isSelected = dayDate.toDateString() === selectedDate.toDateString();
        const dayElement = createDayElementSalles(day, false, isSelected, dayDate, year, month);
        calendarGrid.appendChild(dayElement);
    }

    // Ajouter les jours du mois suivant pour compléter la grille (rendus cliquables)
    const totalCells = calendarGrid.children.length;
    const remainingCells = 42 - totalCells; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingCells; day++) {
        const nextDayDate = new Date(year, month + 1, day);
        const isSelected = nextDayDate.toDateString() === selectedDate.toDateString();
        const dayElement = createDayElementSalles(day, true, isSelected, nextDayDate, year, month + 1);
        calendarGrid.appendChild(dayElement);
    }
}

// Créer un élément de jour pour le calendrier salles avec couleurs
function createDayElementSalles(day, isOtherMonth, isSelected = false, date = null, year = null, month = null) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;
    
    // Stocker les valeurs dans des variables locales pour la closure
    const dayValue = day;
    const isOtherMonthValue = isOtherMonth;
    const dateValue = date;
    
    // Utiliser les paramètres fournis ou les valeurs par défaut
    const targetYear = year !== null ? year : currentDateSalles.getFullYear();
    const targetMonth = month !== null ? month : currentDateSalles.getMonth();
    
    // TOUTES les dates sont cliquables, même celles des autres mois
    dayElement.style.cursor = 'pointer';
    dayElement.style.pointerEvents = 'auto';
    dayElement.style.position = 'relative';
    dayElement.style.zIndex = '10';
    
    if (isOtherMonthValue) {
        dayElement.classList.add('other-month');
    }
    
    if (isSelected) {
        dayElement.classList.add('selected');
    }
    
    // Attacher l'event listener pour TOUTES les dates
    dayElement.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const clickedDate = new Date(targetYear, targetMonth, dayValue);
        console.log('Clic sur jour:', dayValue, 'isOtherMonth:', isOtherMonthValue, 'Date:', clickedDate, 'Month:', targetMonth, 'Year:', targetYear);
        
        // Si c'est un autre mois, changer le mois affiché d'abord
        if (isOtherMonthValue) {
            currentDateSalles.setFullYear(targetYear);
            currentDateSalles.setMonth(targetMonth);
            // Mettre à jour les sélecteurs de mois/année
            const monthSelect = document.getElementById('monthSelectSalles');
            const yearSelect = document.getElementById('yearSelectSalles');
            if (monthSelect) monthSelect.value = targetMonth;
            if (yearSelect) yearSelect.value = targetYear;
        }
        
        selectDate(clickedDate);
    }, false);
    
    // Simuler des réservations pour la démo (à remplacer par de vraies données)
    // Appliquer les couleurs même pour les autres mois si la date correspond
    if (dateValue) {
        const dayOfMonth = dateValue.getDate();
        const dateMonth = dateValue.getMonth();
        const dateYear = dateValue.getFullYear();
        
        // Simulation de réservations pour démo (appliquer à toutes les dates correspondantes)
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
        } else if (dayOfMonth === 7) {
            // Exemple : plusieurs salles le même jour
            dayElement.classList.add('multiple-salles');
        } else if (dayOfMonth === 12) {
            dayElement.classList.add('salle-numerique');
        } else if (dayOfMonth === 18) {
            dayElement.classList.add('salle-solidaire');
        }
    }
    
    return dayElement;
}

// Configuration des widgets d'activités
function setupActivityWidgets() {
    // Menu déroulant personnalisé
    const customSelect = document.getElementById('customSelect');
    const customDropdown = document.getElementById('customDropdown');
    const selectText = document.getElementById('selectText');
    const searchBar = document.getElementById('searchBar');
    const activitySelect = document.getElementById('activitySelect');
    const activitiesListGroup = document.getElementById('activitiesList');
    const activitiesGroup = document.getElementById('activitiesGroup');
    
    // Remplir la liste des activités dans le menu déroulant personnalisé
    function populateCustomDropdown() {
        if (!activitiesGroup || !allActivitiesList) return;
        
        // Supprimer les activités existantes (garder le label)
        const existingItems = activitiesGroup.querySelectorAll('.dropdown-item:not(.dropdown-group-label)');
        existingItems.forEach(item => item.remove());
        
        // Ajouter les activités
        allActivitiesList.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.setAttribute('data-value', `activity:${activity.title}`);
            item.innerHTML = `<span>${activity.title}</span>`;
            activitiesGroup.appendChild(item);
        });
        
        // Ajouter les event listeners aux nouveaux items
        attachDropdownListeners();
    }
    
    // Remplir aussi le select natif caché (pour compatibilité)
    function populateActivitySelect() {
        if (!activitiesListGroup || !allActivitiesList) return;
        
        activitiesListGroup.innerHTML = '';
        
        allActivitiesList.forEach(activity => {
            const option = document.createElement('option');
            option.value = `activity:${activity.title}`;
            option.textContent = activity.title;
            activitiesListGroup.appendChild(option);
        });
    }
    
    populateCustomDropdown();
    populateActivitySelect();
    
    // Ouvrir/fermer le menu déroulant
    function toggleDropdown() {
        const isOpen = customDropdown.classList.contains('active');
        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }
    
    function openDropdown() {
        if (!customDropdown) {
            console.error('customDropdown est null');
            return;
        }
        customDropdown.classList.add('active');
        if (searchBar) {
            searchBar.classList.add('active');
        }
        console.log('Menu ouvert', customDropdown.classList); // Debug
    }
    
    function closeDropdown() {
        if (!customDropdown) return;
        customDropdown.classList.remove('active');
        if (searchBar) {
            searchBar.classList.remove('active');
        }
        console.log('Menu fermé'); // Debug
    }
    
    // Gérer la sélection d'un item
    function selectItem(value, text) {
        // Mettre à jour le texte affiché
        selectText.textContent = text;
        selectText.classList.remove('placeholder');
        
        // Mettre à jour le select natif caché
        if (activitySelect) {
            activitySelect.value = value;
            // Déclencher l'événement change
            const event = new Event('change', { bubbles: true });
            activitySelect.dispatchEvent(event);
        }
        
        // Mettre à jour l'état visuel des items
        const allItems = customDropdown.querySelectorAll('.dropdown-item');
        allItems.forEach(item => {
            item.classList.remove('selected');
            if (item.getAttribute('data-value') === value) {
                item.classList.add('selected');
            }
        });
        
        closeDropdown();
    }
    
    // Attacher les event listeners aux items du dropdown
    function attachDropdownListeners() {
        const items = customDropdown.querySelectorAll('.dropdown-item');
        items.forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                const value = this.getAttribute('data-value');
                const text = this.querySelector('span').textContent;
                selectItem(value, text);
            });
        });
    }
    
    // Vérifier que les éléments existent
    if (!customSelect || !customDropdown || !selectText || !searchBar) {
        console.error('Éléments du menu déroulant personnalisé non trouvés');
        return;
    }
    
    // Ouvrir le menu au clic sur le select personnalisé
    customSelect.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        console.log('Clic sur customSelect détecté'); // Debug
        toggleDropdown();
    });
    
    // Fermer le menu en cliquant ailleurs (avec délai pour éviter la fermeture immédiate)
    document.addEventListener('click', function(e) {
        // Vérifier si le clic est en dehors du menu et du select
        const clickedInside = customSelect.contains(e.target) || customDropdown.contains(e.target);
        if (!clickedInside && customDropdown.classList.contains('active')) {
            // Utiliser setTimeout pour éviter que le menu se ferme avant de s'ouvrir
            setTimeout(() => {
                if (customDropdown.classList.contains('active')) {
                    closeDropdown();
                }
            }, 100);
        }
    });
    
    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && customDropdown.classList.contains('active')) {
            closeDropdown();
        }
    });
    
    // Initialiser les listeners
    attachDropdownListeners();
    
    // Obtenir toutes les activités d'une catégorie
    function getAllActivitiesByCategory(category) {
        if (!allActivitiesList) return [];
        
        const categoryActivities = [];
        allActivitiesList.forEach(activity => {
            if (activity.category === category) {
                activity.dates.forEach(dateInfo => {
                    categoryActivities.push({
                        title: activity.title,
                        time: dateInfo.time,
                        location: dateInfo.location,
                        description: dateInfo.description,
                        category: activity.category,
                        categoryName: activity.categoryName,
                        categoryColor: activity.categoryColor,
                        date: dateInfo.date,
                        dateKey: dateInfo.dateKey,
                        isComplete: dateInfo.isComplete
                    });
                });
            }
        });
        
        return categoryActivities;
    }
    
    // Gérer la sélection dans le select natif (pour compatibilité)
    if (activitySelect) {
        activitySelect.addEventListener('change', function(e) {
            const value = e.target.value;
            const cardsContainer = document.getElementById('activityCardsContainer');
            
            if (!value) {
                selectText.textContent = 'Rechercher une activité';
                selectText.classList.add('placeholder');
                if (cardsContainer) {
                    cardsContainer.classList.remove('active');
                    cardsContainer.innerHTML = '';
                }
                return;
            }
            
            if (value.startsWith('category:')) {
                const category = value.split(':')[1];
                const categoryActivities = getAllActivitiesByCategory(category);
                
                if (categoryActivities.length > 0 && cardsContainer) {
                    displayActivityCards(categoryActivities);
                }
            } else if (value.startsWith('activity:')) {
                const activityTitle = value.split(':')[1];
                const activity = allActivitiesList.find(a => a.title === activityTitle);
                
                if (activity && cardsContainer) {
                    const activitiesList = activity.dates.map(dateInfo => ({
                        title: activity.title,
                        time: dateInfo.time,
                        location: dateInfo.location,
                        description: dateInfo.description,
                        category: activity.category,
                        categoryName: activity.categoryName,
                        categoryColor: activity.categoryColor,
                        date: dateInfo.date,
                        dateKey: dateInfo.dateKey,
                        isComplete: dateInfo.isComplete
                    }));
                    
                    displayActivityCards(activitiesList);
                }
            }
        });
    }
    
    // Widget schedule
    const closeScheduleWidget = document.getElementById('closeScheduleWidget');
    const scheduleWidget = document.getElementById('scheduleWidget');
    const prevDay = document.getElementById('prevDay');
    const nextDay = document.getElementById('nextDay');
    
    if (closeScheduleWidget) {
        closeScheduleWidget.addEventListener('click', closeActivityPopup);
    }
    
    if (scheduleWidget) {
        scheduleWidget.addEventListener('click', function(e) {
            if (e.target === this) {
                closeActivityPopup();
            }
        });
    }
    
    if (prevDay) {
        prevDay.addEventListener('click', function() {
            // S'assurer que selectedDate est valide
            if (!selectedDate || isNaN(selectedDate.getTime())) {
                selectedDate = new Date();
            }
            const newDate = new Date(selectedDate);
            newDate.setDate(newDate.getDate() - 1);
            selectDate(newDate);
        });
    }
    
    if (nextDay) {
        nextDay.addEventListener('click', function() {
            // S'assurer que selectedDate est valide
            if (!selectedDate || isNaN(selectedDate.getTime())) {
                selectedDate = new Date();
            }
            const newDate = new Date(selectedDate);
            newDate.setDate(newDate.getDate() + 1);
            selectDate(newDate);
        });
    }
    
    // Widget de détail d'activité
    const closeActivityDetail = document.getElementById('closeActivityDetail');
    const activityDetailOverlay = document.getElementById('activityDetailOverlay');
    const prevActivity = document.getElementById('prevActivity');
    const nextActivity = document.getElementById('nextActivity');
    const registerActivityButton = document.getElementById('registerActivityButton');
    
    if (closeActivityDetail) {
        closeActivityDetail.addEventListener('click', function() {
            if (activityDetailOverlay) {
                activityDetailOverlay.classList.remove('active');
            }
        });
    }
    
    if (activityDetailOverlay) {
        activityDetailOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    }
    
    if (prevActivity) {
        prevActivity.addEventListener('click', function(e) {
            e.stopPropagation();
            navigateToPreviousActivity();
        });
    }
    
    if (nextActivity) {
        nextActivity.addEventListener('click', function(e) {
            e.stopPropagation();
            navigateToNextActivity();
        });
    }
    
    if (registerActivityButton) {
        registerActivityButton.addEventListener('click', function() {
            console.log('Inscription à l\'activité');
            alert('Inscription à l\'activité (fonctionnalité à implémenter)');
        });
    }
    
    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (activityDetailOverlay && activityDetailOverlay.classList.contains('active')) {
                activityDetailOverlay.classList.remove('active');
            }
            closeActivityPopup();
        }
    });
    
    // Mettre à jour l'heure actuelle toutes les minutes (seulement si une date est sélectionnée)
    setInterval(() => {
        if (selectedDate) {
            updateCurrentTimeIndicator(selectedDate);
        }
    }, 60000);
    // Mise à jour initiale
    if (selectedDate) {
        updateCurrentTimeIndicator(selectedDate);
    }
}

// Afficher les cards d'activités
function displayActivityCards(activities) {
    const cardsContainer = document.getElementById('activityCardsContainer');
    if (!cardsContainer) return;
    
    cardsContainer.innerHTML = '';
    cardsContainer.classList.add('active');
    
    activities.forEach(activity => {
        const card = createActivityCard(activity, activities);
        cardsContainer.appendChild(card);
    });
}

// Créer une card d'activité
function createActivityCard(activity, activitiesList) {
    const card = document.createElement('div');
    card.className = 'activity-card';
    card.style.position = 'relative';
    card.style.paddingLeft = '12px';
    
    // Indicateur de couleur
    const colorIndicator = document.createElement('div');
    colorIndicator.className = 'activity-card-color-indicator';
    colorIndicator.style.backgroundColor = activity.categoryColor || '#649d50';
    card.appendChild(colorIndicator);
    
    // Header avec titre et badge
    const header = document.createElement('div');
    header.className = 'activity-card-header';
    
    const title = document.createElement('div');
    title.className = 'activity-card-title';
    title.textContent = activity.title;
    header.appendChild(title);
    
    const badge = document.createElement('div');
    badge.className = `activity-card-badge ${activity.isComplete ? 'complet' : 'disponible'}`;
    badge.textContent = activity.isComplete ? 'Complet' : 'Disponible';
    header.appendChild(badge);
    
    card.appendChild(header);
    
    // Date
    const dateDiv = document.createElement('div');
    dateDiv.className = 'activity-card-date';
    const activityDate = activity.date || (activity.dateKey ? new Date(activity.dateKey) : null);
    if (activityDate) {
        const day = activityDate.getDate();
        const monthIndex = activityDate.getMonth();
        const year = activityDate.getFullYear();
        dateDiv.textContent = `${day} ${monthsFull[monthIndex]} ${year}`;
    }
    card.appendChild(dateDiv);
    
    // Heure
    const timeDiv = document.createElement('div');
    timeDiv.className = 'activity-card-time';
    timeDiv.textContent = activity.time || '';
    card.appendChild(timeDiv);
    
    // Lieu
    if (activity.location) {
        const locationDiv = document.createElement('div');
        locationDiv.className = 'activity-card-location';
        locationDiv.textContent = activity.location;
        card.appendChild(locationDiv);
    }
    
    // Événement de clic
    card.addEventListener('click', function() {
        showActivityDetail(activity, 'search', activitiesList);
    });
    
    return card;
}

// Afficher le widget de détail d'activité
function showActivityDetail(activity, context = 'schedule', activityList = []) {
    const overlay = document.getElementById('activityDetailOverlay');
    const name = document.getElementById('activityDetailName');
    const description = document.getElementById('activityDetailDescription');
    
    if (!overlay || !name || !description) {
        return;
    }
    
    activityDetailContext = context;
    currentActivityList = activityList.length > 0 ? activityList : [activity];
    
    currentActivityIndex = currentActivityList.findIndex(a => 
        a.title === activity.title && a.time === activity.time
    );
    if (currentActivityIndex === -1) {
        currentActivityIndex = 0;
    }
    
    displayActivityInDetail(activity);
    
    overlay.classList.add('active');
}

// Afficher une activité dans le widget de détail
function displayActivityInDetail(activity) {
    const name = document.getElementById('activityDetailName');
    const description = document.getElementById('activityDetailDescription');
    const dateElement = document.getElementById('activityDetailDate');
    const timeElement = document.getElementById('activityDetailTimeDetail');
    
    if (!name || !description) {
        return;
    }
    
    name.textContent = activity.title || 'Activité';
    description.textContent = activity.description || 'Aucune description disponible.';
    
    if (dateElement) {
        const activityDate = activity.date || (activity.dateKey ? new Date(activity.dateKey) : selectedDate);
        if (activityDate) {
            const day = activityDate.getDate();
            const monthIndex = activityDate.getMonth();
            const year = activityDate.getFullYear();
            dateElement.textContent = `${day} ${monthsFull[monthIndex]} ${year}`;
        } else {
            dateElement.textContent = formatDateShort(selectedDate);
        }
    }
    
    if (timeElement) {
        timeElement.textContent = activity.time || '';
    }
    
    currentActivityDetail = activity;
}

// Navigation vers l'activité précédente
function navigateToPreviousActivity() {
    if (currentActivityList.length === 0) return;
    
    currentActivityIndex = (currentActivityIndex - 1 + currentActivityList.length) % currentActivityList.length;
    const activity = currentActivityList[currentActivityIndex];
    displayActivityInDetail(activity);
}

// Navigation vers l'activité suivante
function navigateToNextActivity() {
    if (currentActivityList.length === 0) return;
    
    currentActivityIndex = (currentActivityIndex + 1) % currentActivityList.length;
    const activity = currentActivityList[currentActivityIndex];
    displayActivityInDetail(activity);
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    // Navigation entre vues (activités/salles)
    const prevView = document.getElementById('prevView');
    const nextView = document.getElementById('nextView');
    
    if (prevView) {
        prevView.addEventListener('click', () => {
            switchView(-1);
        });
    } else {
        console.warn('Élément prevView non trouvé');
    }
    
    if (nextView) {
        nextView.addEventListener('click', () => {
            switchView(1);
        });
    } else {
        console.warn('Élément nextView non trouvé');
    }

    // Navigation du calendrier activités
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    
    if (prevMonth) {
        prevMonth.addEventListener('click', () => {
            changeMonth(-1);
        });
    }
    
    if (nextMonth) {
        nextMonth.addEventListener('click', () => {
            changeMonth(1);
        });
    }

    // Sélecteurs de mois et année activités
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    
    if (monthSelect) {
        monthSelect.addEventListener('change', (e) => {
            currentDate.setMonth(parseInt(e.target.value));
            updateCalendar();
        });
    }
    
    if (yearSelect) {
        yearSelect.addEventListener('change', (e) => {
            currentDate.setFullYear(parseInt(e.target.value));
            updateCalendar();
        });
    }

    // Navigation du calendrier salles
    const prevMonthSalles = document.getElementById('prevMonthSalles');
    const nextMonthSalles = document.getElementById('nextMonthSalles');
    
    if (prevMonthSalles) {
        prevMonthSalles.addEventListener('click', () => {
            changeMonthSalles(-1);
        });
    }
    
    if (nextMonthSalles) {
        nextMonthSalles.addEventListener('click', () => {
            changeMonthSalles(1);
        });
    }

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
    const monthSelectSalles = document.getElementById('monthSelectSalles');
    const yearSelectSalles = document.getElementById('yearSelectSalles');
    
    if (monthSelectSalles) {
        monthSelectSalles.addEventListener('change', (e) => {
            currentDateSalles.setMonth(parseInt(e.target.value));
            updateCalendarSalles();
        });
    }
    
    if (yearSelectSalles) {
        yearSelectSalles.addEventListener('change', (e) => {
            currentDateSalles.setFullYear(parseInt(e.target.value));
            updateCalendarSalles();
        });
    }
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

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // 0 = Lundi

    // Ajouter les jours du mois précédent (rendus cliquables)
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const prevDay = daysInPrevMonth - i;
        const prevDayDate = new Date(year, month - 1, prevDay);
        const isSelected = prevDayDate.toDateString() === selectedDate.toDateString();
        const dayElement = createDayElement(prevDay, true, isSelected, prevDayDate, year, month - 1);
        calendarGrid.appendChild(dayElement);
    }

    // Ajouter les jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(year, month, day);
        const isSelected = dayDate.toDateString() === selectedDate.toDateString();
        const dayElement = createDayElement(day, false, isSelected, dayDate, year, month);
        calendarGrid.appendChild(dayElement);
    }

    // Ajouter les jours du mois suivant pour compléter la grille (rendus cliquables)
    const totalCells = calendarGrid.children.length;
    const remainingCells = 42 - totalCells; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingCells; day++) {
        const nextDayDate = new Date(year, month + 1, day);
        const isSelected = nextDayDate.toDateString() === selectedDate.toDateString();
        const dayElement = createDayElement(day, true, isSelected, nextDayDate, year, month + 1);
        calendarGrid.appendChild(dayElement);
    }
}

// Créer un élément de jour
function createDayElement(day, isOtherMonth, isSelected = false, date = null, year = null, month = null) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;
    
    // Stocker les valeurs dans des variables locales pour la closure
    const dayValue = day;
    const isOtherMonthValue = isOtherMonth;
    const dateValue = date;
    
    // Utiliser les paramètres fournis ou les valeurs par défaut
    const targetYear = year !== null ? year : currentDate.getFullYear();
    const targetMonth = month !== null ? month : currentDate.getMonth();
    
    // TOUTES les dates sont cliquables, même celles des autres mois
    dayElement.style.cursor = 'pointer';
    dayElement.style.pointerEvents = 'auto';
    dayElement.style.position = 'relative';
    dayElement.style.zIndex = '10';
    
    if (isOtherMonthValue) {
        dayElement.classList.add('other-month');
    }
    
    if (isSelected) {
        dayElement.classList.add('selected');
    }
    
    // Appliquer les couleurs selon les activités du jour (même pour les autres mois)
    if (dateValue) {
        const dateKey = formatDateKey(dateValue);
        const activity = activitiesData[dateKey];
        
        if (activity) {
            // Récupérer toutes les catégories pour ce jour
            const dayCategories = [];
            
            // Si c'est un tableau d'activités
            if (Array.isArray(activity)) {
                activity.forEach(act => {
                    if (act.category) {
                        dayCategories.push(act.category);
                    }
                });
            } else {
                // C'est un objet unique
                if (activity.category) {
                    dayCategories.push(activity.category);
                }
            }
            
            // Vérifier aussi dans allActivitiesList pour être sûr
            if (allActivitiesList) {
                allActivitiesList.forEach(act => {
                    act.dates.forEach(dateInfo => {
                        if (dateInfo.dateKey === dateKey) {
                            dayCategories.push(act.category);
                        }
                    });
                });
            }
            
            // Obtenir les catégories uniques
            const uniqueCategories = [...new Set(dayCategories)];
            
            // Si 4 catégories différentes, appliquer le dégradé spécial
            if (uniqueCategories.length === 4) {
                dayElement.classList.add('multiple-activities');
            } else if (uniqueCategories.length > 1) {
                // 2 ou 3 catégories : appliquer le dégradé multiple-activities
                dayElement.classList.add('multiple-activities');
            } else if (uniqueCategories.length === 1) {
                // Une seule catégorie : appliquer la classe correspondante
                const category = uniqueCategories[0];
                if (category === 'numerique') {
                    dayElement.classList.add('activity-numerique');
                } else if (category === 'solidaire') {
                    dayElement.classList.add('activity-solidaire');
                } else if (category === 'artistique') {
                    dayElement.classList.add('activity-artistique');
                } else if (category === 'formation') {
                    dayElement.classList.add('activity-formation');
                }
            } else if (activity.category) {
                // Fallback : utiliser la catégorie de l'objet unique
                const category = activity.category;
                if (category === 'numerique') {
                    dayElement.classList.add('activity-numerique');
                } else if (category === 'solidaire') {
                    dayElement.classList.add('activity-solidaire');
                } else if (category === 'artistique') {
                    dayElement.classList.add('activity-artistique');
                } else if (category === 'formation') {
                    dayElement.classList.add('activity-formation');
                }
            }
        }
    }
    
    // Attacher l'event listener pour TOUTES les dates
    dayElement.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const clickedDate = new Date(targetYear, targetMonth, dayValue);
        console.log('Clic sur jour activités:', dayValue, 'isOtherMonth:', isOtherMonthValue, 'Date:', clickedDate);
        
        // Si c'est un autre mois, changer le mois affiché d'abord
        if (isOtherMonthValue) {
            currentDate.setFullYear(targetYear);
            currentDate.setMonth(targetMonth);
            // Mettre à jour les sélecteurs de mois/année
            const monthSelect = document.getElementById('monthSelect');
            const yearSelect = document.getElementById('yearSelect');
            if (monthSelect) monthSelect.value = targetMonth;
            if (yearSelect) yearSelect.value = targetYear;
        }
        
        selectDate(clickedDate);
    }, false);
    
    return dayElement;
}

// Sélectionner une date
function selectDate(date) {
    // S'assurer que la date est valide
    if (!date || isNaN(date.getTime())) {
        console.error('Date invalide passée à selectDate:', date);
        return;
    }
    
    // Créer une nouvelle instance de Date pour éviter les problèmes de référence
    const validDate = new Date(date);
    selectedDate = new Date(validDate);
    
    console.log('selectDate appelé:', {
        date: validDate,
        dateKey: formatDateKey(validDate),
        currentView: currentView
    });
    
    // Si on est en vue salles et que la date est d'un autre mois, mettre à jour le mois affiché
    if (currentView === 'salles') {
        const clickedMonth = validDate.getMonth();
        const clickedYear = validDate.getFullYear();
        const currentMonth = currentDateSalles.getMonth();
        const currentYear = currentDateSalles.getFullYear();
        
        // Si le mois ou l'année est différent, mettre à jour
        if (clickedMonth !== currentMonth || clickedYear !== currentYear) {
            currentDateSalles.setFullYear(clickedYear);
            currentDateSalles.setMonth(clickedMonth);
            updateCalendarSalles();
        } else {
            // Mettre à jour le calendrier pour refléter la sélection visuelle
            updateCalendarSalles();
        }
        
        // Afficher la pop-up pour les salles avec la date valide
        // Utiliser setTimeout pour s'assurer que le DOM est prêt
        setTimeout(() => {
            showSallesPopup(validDate);
        }, 0);
    } else {
        // Pour les activités, faire de même
        const clickedMonth = validDate.getMonth();
        const clickedYear = validDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        if (clickedMonth !== currentMonth || clickedYear !== currentYear) {
            currentDate.setFullYear(clickedYear);
            currentDate.setMonth(clickedMonth);
            updateCalendar();
        } else {
            // Mettre à jour le calendrier pour refléter la sélection visuelle
            updateCalendar();
        }
        
        // Afficher la pop-up pour les activités avec la date valide
        // Utiliser setTimeout pour s'assurer que le DOM est prêt
        setTimeout(() => {
            showActivityPopup(validDate);
        }, 0);
    }
}

// Afficher le widget d'emploi du temps
function showActivityPopup(date) {
    // S'assurer que la date est valide
    if (!date || isNaN(date.getTime())) {
        console.error('Date invalide passée à showActivityPopup:', date);
        return;
    }
    
    const dateKey = formatDateKey(date);
    const activities = getActivitiesForDate(date);
    
    const widget = document.getElementById('scheduleWidget');
    const dateText = document.getElementById('scheduleDateText');
    const timeline = document.getElementById('scheduleTimeline');
    
    if (!widget || !dateText || !timeline) {
        console.error('Éléments du widget non trouvés', { widget: !!widget, dateText: !!dateText, timeline: !!timeline });
        return;
    }
    
    console.log('showActivityPopup:', {
        date: date,
        dateKey: dateKey,
        activitiesCount: activities.length,
        activities: activities,
        activitiesDataForDate: activitiesData[dateKey]
    });
    
    // Forcer la fermeture/réouverture du widget pour forcer la mise à jour visuelle
    widget.classList.remove('active');
    
    // Utiliser requestAnimationFrame pour s'assurer que le DOM est prêt
    requestAnimationFrame(() => {
        // Mettre à jour la date affichée IMMÉDIATEMENT
        dateText.textContent = formatDateShort(date);
        
        // Nettoyer TOUTES les activités existantes (y compris les messages "aucune activité")
        const existingActivities = timeline.querySelectorAll('.schedule-activity');
        existingActivities.forEach(activity => activity.remove());
        
        // Nettoyer aussi les messages "aucune activité"
        const noActivityMessages = timeline.querySelectorAll('.no-activity-message');
        noActivityMessages.forEach(msg => msg.remove());
        
        // Réafficher le widget d'abord pour que le timeline ait une hauteur
        widget.classList.add('active');
        
        // Attendre un frame supplémentaire pour que le timeline ait sa hauteur calculée
        requestAnimationFrame(() => {
            // Ajouter les activités au timeline
            console.log('Ajout des activités au timeline:', { activitiesCount: activities.length, activities: activities, timelineHeight: timeline.offsetHeight });
            if (activities.length > 0) {
                activities.forEach((activity, index) => {
                    console.log(`Création du bloc d'activité ${index}:`, activity);
                    const activityBlock = createActivityBlock(activity);
                    if (activityBlock) {
                        timeline.appendChild(activityBlock);
                        console.log(`Bloc d'activité ${index} ajouté au timeline`);
                    } else {
                        console.warn(`Bloc d'activité ${index} non créé (retourné null)`, activity);
                    }
                });
            } else {
            // Afficher un message si aucune activité
            const noActivityMsg = document.createElement('div');
            noActivityMsg.className = 'schedule-activity no-activity-message';
            noActivityMsg.style.position = 'relative';
            noActivityMsg.style.top = '50%';
            noActivityMsg.style.left = '50%';
            noActivityMsg.style.transform = 'translate(-50%, -50%)';
            noActivityMsg.style.width = 'auto';
            noActivityMsg.style.padding = 'clamp(1rem, 2vw, 2rem)';
            noActivityMsg.style.backgroundColor = 'transparent';
            noActivityMsg.style.border = 'none';
            noActivityMsg.style.textAlign = 'center';
            noActivityMsg.style.color = '#6e6f75';
            noActivityMsg.style.fontSize = 'clamp(0.875rem, 1.3vw, 1.125rem)';
            noActivityMsg.textContent = 'Aucune activité prévue pour cette date';
            timeline.appendChild(noActivityMsg);
        }
        
        // Mettre à jour l'heure actuelle seulement si c'est aujourd'hui
        const today = new Date();
        const isToday = date.getDate() === today.getDate() && 
                        date.getMonth() === today.getMonth() && 
                        date.getFullYear() === today.getFullYear();
        
        if (isToday) {
            updateCurrentTimeIndicator(date);
        } else {
            // Cacher l'indicateur si ce n'est pas aujourd'hui
            const indicator = document.getElementById('currentTimeIndicator');
            if (indicator) {
                indicator.style.display = 'none';
            }
        }
        
        // Cacher la légende des salles si elle est visible (seulement si on est en vue salles)
        if (currentView === 'salles') {
            const sallesLegend = document.getElementById('sallesLegend');
            if (sallesLegend) {
                sallesLegend.style.display = 'none';
            }
        }
        
        console.log('Widget affiché', { activitiesCount: activities.length, date: formatDateShort(date), isToday });
        });
    });
}

// Récupérer les réservations de salles pour une date donnée
function getSallesForDate(date) {
    const dateKey = formatDateKey(date);
    const sallesReservations = [];
    
    // Récupérer les activités qui ont une salle assignée pour cette date
    // activitiesData[dateKey] est un objet unique, pas un tableau
    if (activitiesData[dateKey]) {
        const activity = activitiesData[dateKey];
        // Vérifier si c'est un tableau ou un objet unique
        if (Array.isArray(activity)) {
            activity.forEach(act => {
                if (act.location && salles.includes(act.location)) {
                    sallesReservations.push({
                        title: act.title,
                        time: act.time,
                        location: act.location,
                        description: act.description,
                        responsible: act.responsible || '',
                        categoryColor: act.categoryColor || '#649d50'
                    });
                }
            });
        } else {
            // C'est un objet unique
            if (activity.location && salles.includes(activity.location)) {
                sallesReservations.push({
                    title: activity.title,
                    time: activity.time,
                    location: activity.location,
                    description: activity.description,
                    responsible: activity.responsible || '',
                    categoryColor: activity.categoryColor || '#649d50'
                });
            }
        }
    }
    
    // Simulation de réservations supplémentaires pour la démo
    const dayOfMonth = date.getDate();
    if (dayOfMonth === 5) {
        sallesReservations.push({
            title: 'Réservation Salle Numérique',
            time: '10h00 - 12h00',
            location: 'Salle Numérique',
            description: 'Réunion équipe',
            responsible: 'Animateur 1',
            categoryColor: '#1f658e'
        });
    } else if (dayOfMonth === 10) {
        sallesReservations.push({
            title: 'Réservation Salle Solidaire',
            time: '14h00 - 16h00',
            location: 'Salle Solidaire',
            description: 'Atelier collectif',
            responsible: 'Animateur 2',
            categoryColor: '#649d50'
        });
    } else if (dayOfMonth === 15) {
        sallesReservations.push({
            title: 'Réservation Salle Artistique/Culturel',
            time: '16h00 - 18h00',
            location: 'Salle Artistique/Culturel',
            description: 'Atelier créatif',
            responsible: 'Animateur 3',
            categoryColor: '#f08d35'
        });
    } else if (dayOfMonth === 20) {
        sallesReservations.push({
            title: 'Réservation Salle Emploi/Formation',
            time: '09h00 - 11h00',
            location: 'Salle Emploi/Formation',
            description: 'Formation professionnelle',
            responsible: 'Animateur 4',
            categoryColor: '#9b59b6'
        });
    } else if (dayOfMonth === 25 || dayOfMonth === 7) {
        // Plusieurs salles réservées
        sallesReservations.push(
            {
                title: 'Réservation Salle Numérique',
                time: '10h00 - 12h00',
                location: 'Salle Numérique',
                description: 'Réunion',
                responsible: 'Animateur 1',
                categoryColor: '#1f658e'
            },
            {
                title: 'Réservation Salle Solidaire',
                time: '14h00 - 16h00',
                location: 'Salle Solidaire',
                description: 'Atelier',
                responsible: 'Animateur 2',
                categoryColor: '#649d50'
            }
        );
    }
    
    return sallesReservations;
}

// Afficher le widget d'emploi du temps pour les salles
function showSallesPopup(date) {
    // S'assurer que la date est valide
    if (!date || isNaN(date.getTime())) {
        console.error('Date invalide passée à showSallesPopup:', date);
        return;
    }
    
    const dateKey = formatDateKey(date);
    const sallesReservations = getSallesForDate(date);
    
    const widget = document.getElementById('scheduleWidget');
    const dateText = document.getElementById('scheduleDateText');
    const timeline = document.getElementById('scheduleTimeline');
    
    if (!widget || !dateText || !timeline) {
        console.error('Éléments du widget non trouvés', { widget: !!widget, dateText: !!dateText, timeline: !!timeline });
        return;
    }
    
    console.log('showSallesPopup:', {
        date: date,
        dateKey: dateKey,
        sallesCount: sallesReservations.length,
        salles: sallesReservations,
        activitiesDataForDate: activitiesData[dateKey]
    });
    
    // Forcer la fermeture/réouverture du widget pour forcer la mise à jour visuelle
    widget.classList.remove('active');
    
    // Utiliser requestAnimationFrame pour s'assurer que le DOM est prêt
    requestAnimationFrame(() => {
        // Mettre à jour la date affichée IMMÉDIATEMENT
        dateText.textContent = formatDateShort(date);
        
        // Nettoyer TOUTES les activités existantes (y compris les messages "aucune réservation")
        const existingActivities = timeline.querySelectorAll('.schedule-activity');
        existingActivities.forEach(activity => activity.remove());
        
        // Nettoyer aussi les messages "aucune activité"
        const noActivityMessages = timeline.querySelectorAll('.no-activity-message');
        noActivityMessages.forEach(msg => msg.remove());
        
        // Réafficher le widget d'abord pour que le timeline ait une hauteur
        widget.classList.add('active');
        
        // Attendre un frame supplémentaire pour que le timeline ait sa hauteur calculée
        requestAnimationFrame(() => {
            // Ajouter les réservations de salles au timeline
            if (sallesReservations.length > 0) {
                sallesReservations.forEach(salle => {
                    const salleBlock = createActivityBlock(salle);
                    if (salleBlock) {
                        timeline.appendChild(salleBlock);
                    }
                });
            } else {
            // Afficher un message si aucune réservation
            const noReservationMsg = document.createElement('div');
            noReservationMsg.className = 'schedule-activity no-activity-message';
            noReservationMsg.style.position = 'relative';
            noReservationMsg.style.top = '50%';
            noReservationMsg.style.left = '50%';
            noReservationMsg.style.transform = 'translate(-50%, -50%)';
            noReservationMsg.style.width = 'auto';
            noReservationMsg.style.padding = 'clamp(1rem, 2vw, 2rem)';
            noReservationMsg.style.backgroundColor = 'transparent';
            noReservationMsg.style.border = 'none';
            noReservationMsg.style.textAlign = 'center';
            noReservationMsg.style.color = '#6e6f75';
            noReservationMsg.style.fontSize = 'clamp(0.875rem, 1.3vw, 1.125rem)';
            noReservationMsg.textContent = 'Aucune réservation de salle pour cette date';
            timeline.appendChild(noReservationMsg);
        }
        
        // Mettre à jour l'heure actuelle seulement si c'est aujourd'hui
        const today = new Date();
        const isToday = date.getDate() === today.getDate() && 
                        date.getMonth() === today.getMonth() && 
                        date.getFullYear() === today.getFullYear();
        
        if (isToday) {
            updateCurrentTimeIndicator(date);
        } else {
            // Cacher l'indicateur si ce n'est pas aujourd'hui
            const indicator = document.getElementById('currentTimeIndicator');
            if (indicator) {
                indicator.style.display = 'none';
            }
        }
        
        // Cacher la légende des salles
        const sallesLegend = document.getElementById('sallesLegend');
        if (sallesLegend) {
            sallesLegend.style.display = 'none';
        }
        
        console.log('Widget salles affiché', { sallesCount: sallesReservations.length, date: formatDateShort(date), isToday });
        });
    });
}

// Créer un bloc d'activité pour le timeline
function createActivityBlock(activity) {
    if (!activity) {
        console.error('createActivityBlock: activity est null ou undefined');
        return null;
    }
    
    const block = document.createElement('div');
    block.className = 'schedule-activity';
    block.style.cursor = 'pointer';
    
    // Stocker les données de l'activité pour le clic
    block.dataset.activityTitle = activity.title || '';
    block.dataset.activityTime = activity.time || '';
    block.dataset.activityLocation = activity.location || '';
    block.dataset.activityDescription = activity.description || '';
    block.dataset.activityCategory = activity.categoryName || '';
    block.dataset.activityColor = activity.categoryColor || '#649d50';
    
    // Vérifier que l'activité a une propriété time
    if (!activity.time) {
        console.error('createActivityBlock: activity.time est manquant', activity);
        return null;
    }
    
    // Parser l'heure pour positionner le bloc
    const timeParts = activity.time.split(' - ');
    if (timeParts.length === 2) {
        const startMatch = timeParts[0].match(/(\d+)h(\d+)?/);
        const endMatch = timeParts[1].match(/(\d+)h(\d+)?/);
        
        if (startMatch && endMatch) {
            const startHour = parseInt(startMatch[1]);
            const startMinute = startMatch[2] ? parseInt(startMatch[2]) : 0;
            const endHour = parseInt(endMatch[1]);
            const endMinute = endMatch[2] ? parseInt(endMatch[2]) : 0;
            
            const startTotalMinutes = startHour * 60 + startMinute;
            const endTotalMinutes = endHour * 60 + endMinute;
            const durationMinutes = endTotalMinutes - startTotalMinutes;
            const durationHours = durationMinutes / 60;
            
            const pixelsPerHour = 20;
            const paddingTop = 10;
            const paddingBottom = 15;
            const timeline = document.getElementById('scheduleTimeline');
            // Utiliser une hauteur par défaut si le timeline n'a pas encore de hauteur (pendant le rendu initial)
            // Hauteur par défaut basée sur les heures affichées (6h à 22h = 16h)
            const defaultTimelineHeight = (22 - 6) * pixelsPerHour + paddingTop + paddingBottom;
            let timelineHeight = defaultTimelineHeight;
            if (timeline) {
                // Essayer d'obtenir la hauteur réelle, sinon utiliser la hauteur par défaut
                timelineHeight = timeline.offsetHeight || timeline.scrollHeight || defaultTimelineHeight;
                // Si la hauteur est toujours 0 ou très petite, utiliser la hauteur par défaut
                if (timelineHeight < 100) {
                    timelineHeight = defaultTimelineHeight;
                }
            }
            const minHeight = 28; // Hauteur minimale pour la lisibilité
            const topPosition = paddingTop + Math.max(0, (startHour - 6) * pixelsPerHour + (startMinute / 60) * pixelsPerHour);
            const calculatedHeight = durationHours * pixelsPerHour;
            const maxAvailableHeight = timelineHeight - topPosition - paddingBottom;
            const height = Math.max(minHeight, Math.min(calculatedHeight, maxAvailableHeight));
            
            // Vérifier que le bloc est dans les limites du timeline
            // Utiliser timelineHeight (qui a toujours une valeur par défaut maintenant)
            if (topPosition >= 0 && topPosition < timelineHeight && height > 0) {
                block.style.top = `${topPosition}px`;
                block.style.height = `${height}px`;
                block.style.minHeight = `${minHeight}px`;
                block.style.maxHeight = `${Math.min(calculatedHeight, maxAvailableHeight)}px`;
                
                const rgb = hexToRgb(activity.categoryColor);
                if (rgb) {
                    block.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;
                } else {
                    block.style.backgroundColor = activity.categoryColor;
                    block.style.opacity = '0.5';
                }
                
                // Créer le contenu du texte avec meilleure structure
                const textContainer = document.createElement('div');
                textContainer.className = 'schedule-activity-text';
                
                const titleSpan = document.createElement('span');
                titleSpan.className = 'schedule-activity-title';
                titleSpan.textContent = activity.title;
                textContainer.appendChild(titleSpan);
                
                // Afficher la durée seulement si le bloc est assez haut
                if (height >= 32) {
                    const durationSpan = document.createElement('span');
                    durationSpan.className = 'schedule-activity-duration';
                    durationSpan.textContent = formatDuration(durationHours);
                    textContainer.appendChild(durationSpan);
                } else {
                    // Si le bloc est petit, mettre titre et durée sur la même ligne
                    titleSpan.textContent = `${activity.title} (${formatDuration(durationHours)})`;
                }
                
                block.appendChild(textContainer);
            } else {
                console.log('Activity block rejected:', { 
                    topPosition, 
                    timelineHeight, 
                    height, 
                    activity: activity.title 
                });
                return null;
            }
        }
    }
    
    if (!block.style.top) {
        return null;
    }
    
    // Ajouter l'événement de clic
    block.addEventListener('click', function(e) {
        e.stopPropagation();
        const activityData = {
            title: block.dataset.activityTitle,
            time: block.dataset.activityTime,
            location: block.dataset.activityLocation,
            description: block.dataset.activityDescription,
            categoryName: block.dataset.activityCategory,
            categoryColor: block.dataset.activityColor,
            date: selectedDate,
            dateKey: formatDateKey(selectedDate)
        };
        
        const activities = getActivitiesForDate(selectedDate);
        showActivityDetail(activityData, 'schedule', activities);
    });
    
    return block;
}

// Mettre à jour l'indicateur de l'heure actuelle
function updateCurrentTimeIndicator(date = null) {
    // Utiliser la date fournie ou la date actuelle
    const targetDate = date || new Date();
    const now = new Date();
    
    // Vérifier que c'est bien aujourd'hui
    const isToday = targetDate.getDate() === now.getDate() && 
                    targetDate.getMonth() === now.getMonth() && 
                    targetDate.getFullYear() === now.getFullYear();
    
    if (!isToday) {
        const indicator = document.getElementById('currentTimeIndicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
        return;
    }
    
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const paddingTop = 10;
    const pixelsPerHour = 20;
    const topPosition = paddingTop + (currentHour - 6) * pixelsPerHour + (currentMinute / 60) * pixelsPerHour;
    
    const indicator = document.getElementById('currentTimeIndicator');
    const timeText = document.getElementById('currentTimeText');
    const timeline = document.getElementById('scheduleTimeline');
    
    if (!indicator || !timeText || !timeline) return;
    
    // Vérifier que l'indicateur est dans les limites du timeline
    const timelineHeight = timeline.offsetHeight || 300;
    
    if (currentHour >= 6 && currentHour <= 20 && topPosition >= 0 && topPosition <= timelineHeight) {
        indicator.style.top = `${topPosition}px`;
        timeText.textContent = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
        indicator.style.display = 'flex';
        
        // S'assurer que l'indicateur reste visible dans le timeline
        if (topPosition + indicator.offsetHeight > timelineHeight) {
            indicator.style.top = `${timelineHeight - indicator.offsetHeight - 5}px`;
        }
    } else {
        indicator.style.display = 'none';
    }
}

// Fermer le widget
function closeActivityPopup() {
    const widget = document.getElementById('scheduleWidget');
    if (widget) {
        widget.classList.remove('active');
    }
    
    // Réafficher la légende des salles si on est en vue salles
    if (currentView === 'salles') {
        const sallesLegend = document.getElementById('sallesLegend');
        if (sallesLegend) {
            sallesLegend.style.display = 'block';
        }
    }
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

// Génération de 4-5 activités avec plusieurs dates et horaires
function generateYearActivities(year) {
    const activities = {};
    
    // Définir 5 activités avec leurs dates et horaires multiples
    const predefinedActivities = [
        {
            title: 'Atelier Numérique',
            category: 'numerique',
            categoryName: 'Numérique',
            categoryColor: '#1f658e',
            location: 'Salle Numérique',
            description: 'Initiation aux outils numériques et bureautique. Pour débutants et intermédiaires.',
            dates: [
                { month: 1, day: 5, time: '10h00 - 12h00' },
                { month: 1, day: 12, time: '14h00 - 16h00' },
                { month: 1, day: 19, time: '09h00 - 11h00' },
                { month: 2, day: 3, time: '10h00 - 12h00' },
                { month: 2, day: 15, time: '14h00 - 16h00' }
            ]
        },
        {
            title: 'Aide aux Devoirs',
            category: 'solidaire',
            categoryName: 'Solidaire',
            categoryColor: '#649d50',
            location: 'Salle Solidaire',
            description: 'Soutien scolaire pour tous les niveaux. Accompagnement personnalisé pour réussir vos études.',
            dates: [
                { month: 1, day: 3, time: '16h00 - 18h00' },
                { month: 1, day: 10, time: '16h00 - 18h00' },
                { month: 1, day: 17, time: '16h00 - 18h00' },
                { month: 1, day: 24, time: '16h00 - 18h00' },
                { month: 2, day: 7, time: '16h00 - 18h00' },
                { month: 2, day: 14, time: '16h00 - 18h00' },
                { month: 2, day: 21, time: '16h00 - 18h00' }
            ]
        },
        {
            title: 'Atelier Créatif',
            category: 'artistique',
            categoryName: 'Artistique/Culturel',
            categoryColor: '#f08d35',
            location: 'Salle Artistique/Culturel',
            description: 'Venez découvrir différentes techniques créatives et artistiques. Matériel fourni.',
            dates: [
                { month: 1, day: 8, time: '14h00 - 16h00' },
                { month: 1, day: 15, time: '14h00 - 16h00' },
                { month: 1, day: 22, time: '14h00 - 16h00' },
                { month: 2, day: 5, time: '14h00 - 16h00' },
                { month: 2, day: 12, time: '14h00 - 16h00' }
            ]
        },
        {
            title: 'Formation Professionnelle',
            category: 'formation',
            categoryName: 'Formation/Atelier',
            categoryColor: '#9b59b6',
            location: 'Salle Emploi/Formation',
            description: 'Ateliers de formation professionnelle et recherche d\'emploi. CV, entretiens, compétences.',
            dates: [
                { month: 1, day: 6, time: '10h00 - 12h00' },
                { month: 1, day: 13, time: '10h00 - 12h00' },
                { month: 1, day: 20, time: '10h00 - 12h00' },
                { month: 2, day: 6, time: '10h00 - 12h00' },
                { month: 2, day: 13, time: '10h00 - 12h00' }
            ]
        },
        {
            title: 'Visite Culturelle',
            category: 'artistique',
            categoryName: 'Artistique/Culturel',
            categoryColor: '#f08d35',
            location: 'Musée de la ville',
            description: 'Découverte du patrimoine culturel local. Visite guidée avec médiateur culturel.',
            dates: [
                { month: 1, day: 11, time: '14h00 - 17h00' },
                { month: 1, day: 25, time: '14h00 - 17h00' },
                { month: 2, day: 8, time: '14h00 - 17h00' },
                { month: 2, day: 22, time: '14h00 - 17h00' }
            ]
        }
    ];
    
    // Créer les activités pour chaque date
    predefinedActivities.forEach(activity => {
        activity.dates.forEach(dateInfo => {
            const dateKey = `${year}-${String(dateInfo.month + 1).padStart(2, '0')}-${String(dateInfo.day).padStart(2, '0')}`;
            // Si la date existe déjà, créer un tableau, sinon créer un objet unique
            if (activities[dateKey]) {
                // Si c'est déjà un tableau, ajouter l'activité
                if (Array.isArray(activities[dateKey])) {
                    activities[dateKey].push({
                        title: activity.title,
                        time: dateInfo.time,
                        location: activity.location,
                        description: activity.description,
                        category: activity.category,
                        categoryName: activity.categoryName,
                        categoryColor: activity.categoryColor
                    });
                } else {
                    // Convertir l'objet unique en tableau
                    const existingActivity = activities[dateKey];
                    activities[dateKey] = [existingActivity, {
                        title: activity.title,
                        time: dateInfo.time,
                        location: activity.location,
                        description: activity.description,
                        category: activity.category,
                        categoryName: activity.categoryName,
                        categoryColor: activity.categoryColor
                    }];
                }
            } else {
                activities[dateKey] = {
                    title: activity.title,
                    time: dateInfo.time,
                    location: activity.location,
                    description: activity.description,
                    category: activity.category,
                    categoryName: activity.categoryName,
                    categoryColor: activity.categoryColor
                };
            }
        });
    });
    
    // Ajouter 4 activités pour le jour 15 de chaque mois (une par catégorie)
    for (let month = 0; month < 12; month++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-15`;
        const day15Activities = [
            {
                title: 'Atelier Numérique - Journée spéciale',
                time: '09h00 - 11h00',
                location: 'Salle Numérique',
                description: 'Initiation aux outils numériques et bureautique. Pour débutants et intermédiaires.',
                category: 'numerique',
                categoryName: 'Numérique',
                categoryColor: '#1f658e'
            },
            {
                title: 'Aide aux Devoirs - Journée spéciale',
                time: '11h00 - 13h00',
                location: 'Salle Solidaire',
                description: 'Soutien scolaire pour tous les niveaux. Accompagnement personnalisé pour réussir vos études.',
                category: 'solidaire',
                categoryName: 'Solidaire',
                categoryColor: '#649d50'
            },
            {
                title: 'Atelier Créatif - Journée spéciale',
                time: '14h00 - 16h00',
                location: 'Salle Artistique/Culturel',
                description: 'Venez découvrir différentes techniques créatives et artistiques. Matériel fourni.',
                category: 'artistique',
                categoryName: 'Artistique/Culturel',
                categoryColor: '#f08d35'
            },
            {
                title: 'Formation Professionnelle - Journée spéciale',
                time: '16h00 - 18h00',
                location: 'Salle Emploi/Formation',
                description: 'Ateliers de formation professionnelle et recherche d\'emploi. CV, entretiens, compétences.',
                category: 'formation',
                categoryName: 'Formation/Atelier',
                categoryColor: '#9b59b6'
            }
        ];
        
        // Si une activité existe déjà pour ce jour, convertir en tableau
        if (activities[dateKey]) {
            if (Array.isArray(activities[dateKey])) {
                activities[dateKey].push(...day15Activities);
            } else {
                activities[dateKey] = [activities[dateKey], ...day15Activities];
            }
        } else {
            activities[dateKey] = day15Activities;
        }
    }
    
    // Créer la liste des activités avec leurs dates
    const activitiesMap = {};
    predefinedActivities.forEach(activity => {
        activitiesMap[activity.title] = {
            title: activity.title,
            category: activity.category,
            categoryName: activity.categoryName,
            categoryColor: activity.categoryColor,
            dates: [],
            maxParticipants: Math.floor(Math.random() * 10) + 5,
            currentParticipants: {}
        };
        
        activity.dates.forEach(dateInfo => {
            const dateKey = `${year}-${String(dateInfo.month + 1).padStart(2, '0')}-${String(dateInfo.day).padStart(2, '0')}`;
            const participants = Math.floor(Math.random() * activitiesMap[activity.title].maxParticipants);
            activitiesMap[activity.title].dates.push({
                dateKey: dateKey,
                date: new Date(dateKey),
                time: dateInfo.time,
                location: activity.location,
                description: activity.description,
                participants: participants,
                isComplete: participants >= activitiesMap[activity.title].maxParticipants
            });
            activitiesMap[activity.title].currentParticipants[dateKey] = participants;
        });
    });
    
    // Ajouter les activités du jour 15 à la liste
    const day15ActivityTitles = [
        'Atelier Numérique - Journée spéciale',
        'Aide aux Devoirs - Journée spéciale',
        'Atelier Créatif - Journée spéciale',
        'Formation Professionnelle - Journée spéciale'
    ];
    
    const day15Categories = ['numerique', 'solidaire', 'artistique', 'formation'];
    const day15CategoryNames = ['Numérique', 'Solidaire', 'Artistique/Culturel', 'Formation/Atelier'];
    const day15CategoryColors = ['#1f658e', '#649d50', '#f08d35', '#9b59b6'];
    const day15Locations = ['Salle Numérique', 'Salle Solidaire', 'Salle Artistique/Culturel', 'Salle Emploi/Formation'];
    const day15Times = ['09h00 - 11h00', '11h00 - 13h00', '14h00 - 16h00', '16h00 - 18h00'];
    const day15Descriptions = [
        'Initiation aux outils numériques et bureautique. Pour débutants et intermédiaires.',
        'Soutien scolaire pour tous les niveaux. Accompagnement personnalisé pour réussir vos études.',
        'Venez découvrir différentes techniques créatives et artistiques. Matériel fourni.',
        'Ateliers de formation professionnelle et recherche d\'emploi. CV, entretiens, compétences.'
    ];
    
    day15ActivityTitles.forEach((title, index) => {
        if (!activitiesMap[title]) {
            activitiesMap[title] = {
                title: title,
                category: day15Categories[index],
                categoryName: day15CategoryNames[index],
                categoryColor: day15CategoryColors[index],
                dates: [],
                maxParticipants: Math.floor(Math.random() * 10) + 5,
                currentParticipants: {}
            };
        }
        
        // Ajouter les dates pour chaque mois
        for (let month = 0; month < 12; month++) {
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-15`;
            const participants = Math.floor(Math.random() * activitiesMap[title].maxParticipants);
            activitiesMap[title].dates.push({
                dateKey: dateKey,
                date: new Date(dateKey),
                time: day15Times[index],
                location: day15Locations[index],
                description: day15Descriptions[index],
                participants: participants,
                isComplete: participants >= activitiesMap[title].maxParticipants
            });
            activitiesMap[title].currentParticipants[dateKey] = participants;
        }
    });
    
    // Convertir en tableau et trier par titre
    allActivitiesList = Object.values(activitiesMap).sort((a, b) => a.title.localeCompare(b.title));
    
    return activities;
}

// Format de date pour la clé
function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Formater la date courte
function formatDateShort(date) {
    const day = date.getDate();
    const month = monthsFull[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

// Convertir hex en RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Formater la durée
function formatDuration(hours) {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (minutes === 0) {
        return `${wholeHours}h`;
    } else if (wholeHours === 0) {
        return `${minutes}min`;
    } else {
        return `${wholeHours}h${String(minutes).padStart(2, '0')}`;
    }
}

// Obtenir toutes les activités pour une date donnée
function getActivitiesForDate(date) {
    const dateKey = formatDateKey(date);
    const activity = activitiesData[dateKey];
    
    if (!activity) {
        return [];
    }
    
    // Si c'est un tableau, traiter chaque activité
    if (Array.isArray(activity)) {
        return activity.map(act => ({
            ...act,
            date: date,
            dateKey: dateKey,
            categoryName: act.categoryName || activityCategories[act.category]?.name || 'Activité',
            categoryColor: act.categoryColor || activityCategories[act.category]?.color || '#649d50',
            location: act.location || '',
            description: act.description || ''
        }));
    }
    
    // Si c'est un objet unique, retourner un tableau avec un seul élément
    return [{
        ...activity,
        date: date,
        dateKey: dateKey,
        categoryName: activity.categoryName || activityCategories[activity.category]?.name || 'Activité',
        categoryColor: activity.categoryColor || activityCategories[activity.category]?.color || '#649d50',
        location: activity.location || '',
        description: activity.description || ''
    }];
}

// Configuration du widget d'ajout d'activité
function setupAddActivityWidget() {
    const addButton = document.getElementById('addActivityButton');
    const overlay = document.getElementById('addActivityOverlay');
    const closeButton = document.getElementById('closeAddActivity');
    const cancelButton = document.getElementById('cancelAddActivity');
    const form = document.getElementById('addActivityForm');
    
    if (!addButton || !overlay || !form) {
        console.warn('Éléments du widget d\'ajout d\'activité non trouvés');
        return;
    }
    
    // Ouvrir le widget
    addButton.addEventListener('click', () => {
        overlay.classList.add('active');
        // Définir la date par défaut à aujourd'hui
        const today = new Date();
        const dateInput = document.getElementById('activityDate');
        if (dateInput) {
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            dateInput.value = `${year}-${month}-${day}`;
        }
    });
    
    // Fermer le widget
    function closeWidget() {
        overlay.classList.remove('active');
        form.reset();
    }
    
    if (closeButton) {
        closeButton.addEventListener('click', closeWidget);
    }
    
    if (cancelButton) {
        cancelButton.addEventListener('click', closeWidget);
    }
    
    // Fermer en cliquant sur l'overlay (mais pas sur le widget)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeWidget();
        }
    });
    
    // Fermer avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeWidget();
        }
    });
    
    // Gérer la soumission du formulaire
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Récupérer les valeurs du formulaire
        const name = document.getElementById('activityName').value.trim();
        const date = document.getElementById('activityDate').value;
        const startTime = document.getElementById('activityStartTime').value;
        const endTime = document.getElementById('activityEndTime').value;
        const category = document.getElementById('activityCategory').value;
        const room = document.getElementById('activityRoom').value;
        const responsible = document.getElementById('activityResponsible').value;
        const description = document.getElementById('activityDescription').value.trim();
        
        // Validation
        if (!name || !date || !startTime || !endTime || !category || !room || !responsible) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }
        
        // Vérifier que l'heure de fin est après l'heure de début
        if (startTime >= endTime) {
            alert('L\'heure de fin doit être après l\'heure de début.');
            return;
        }
        
        // Créer l'objet activité
        const activityDate = new Date(date);
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        
        // Formater l'heure pour l'affichage
        const timeString = `${startHour}h${startMinute.toString().padStart(2, '0')} - ${endHour}h${endMinute.toString().padStart(2, '0')}`;
        
        // Ajouter l'activité aux données
        const dateKey = formatDateKey(activityDate);
        const activityData = {
            title: name,
            category: category,
            categoryName: activityCategories[category].name,
            categoryColor: activityCategories[category].color,
            location: room,
            description: description,
            responsible: responsible,
            time: timeString,
            date: activityDate,
            dateKey: dateKey
        };
        
        // Ajouter à activitiesData
        if (!activitiesData[dateKey]) {
            activitiesData[dateKey] = [];
        }
        activitiesData[dateKey].push(activityData);
        
        // Mettre à jour allActivitiesList
        const existingActivity = allActivitiesList.find(a => a.title === name && a.category === category);
        if (existingActivity) {
            // Ajouter la date à l'activité existante
            existingActivity.dates.push({
                date: activityDate,
                dateKey: dateKey,
                time: timeString,
                location: room,
                description: description
            });
        } else {
            // Créer une nouvelle activité
            allActivitiesList.push({
                title: name,
                category: category,
                categoryName: activityCategories[category].name,
                categoryColor: activityCategories[category].color,
                dates: [{
                    date: activityDate,
                    dateKey: dateKey,
                    time: timeString,
                    location: room,
                    description: description
                }]
            });
        }
        
        // Mettre à jour les calendriers
        updateCalendar();
        if (currentView === 'salles') {
            updateCalendarSalles();
        }
        
        // Mettre à jour le menu déroulant des activités
        setupActivityWidgets();
        
        // Fermer le widget
        closeWidget();
        
        // Afficher un message de confirmation
        alert('Activité ajoutée avec succès !');
    });
}
