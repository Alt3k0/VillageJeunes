// Gestion du calendrier et des interactions - Partie Adhérent (lecture seule, Je suis intéressé)

const weekdays = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

let currentView = 'activites';
let currentDate = new Date(2026, 1, 25);
let currentDateSalles = new Date(2026, 1, 25);
let selectedDate = new Date(2026, 1, 25);

const salles = ['Salle du Vent', 'Salle du Feu', "Salle de l'Eau", 'Salle de la Terre + patio', 'Salle de formation', 'Accueil'];
/** Mapping nom de salle → classe CSS pour le calendrier salles */
const salleNameToClass = {
    'Salle du Vent': 'salle-vent',
    'Salle du Feu': 'salle-feu',
    "Salle de l'Eau": 'salle-eau',
    'Salle de la Terre + patio': 'salle-terre-patio',
    'Salle de formation': 'salle-formation',
    'Accueil': 'salle-accueil'
};
const salleToColor = {
    "Salle de l'Eau": '#1f658e',
    'Salle de la Terre + patio': '#649d50',
    'Salle du Feu': '#f08d35',
    'Salle du Vent': '#9b59b6',
    'Salle de formation': '#6e6f75',
    'Accueil': '#e6b800'
};

// Catégories d'activités avec leurs couleurs (alignées avec accueil-staff)
const activityCategories = {
    'numerique': {
        name: 'Numérique',
        color: '#1f658e' // Bleu
    },
    'arts-vivants': {
        name: 'Arts vivants',
        color: '#f08d35' // Orange
    },
    'projet-pro': {
        name: 'Projet pro',
        color: '#9b59b6' // Violet
    },
    'solidarite': {
        name: 'Solidarité',
        color: '#649d50' // Vert
    }
};

// Génération de 4-5 activités avec plusieurs dates et horaires (format compatible staff)
function generateYearActivities(year) {
    const activities = {};
    
    const predefinedActivities = [
        {
            title: 'Sortie Nature',
            category: 'solidarite',
            categoryName: 'Solidarité',
            categoryColor: '#649d50',
            location: 'Salle de la Terre + patio',
            responsible: 'Marie Dupont',
            description: 'Balade découverte de la faune et de la flore locale. Activité en plein air pour toute la famille.',
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
            category: 'solidarite',
            categoryName: 'Solidarité',
            categoryColor: '#649d50',
            location: 'Salle du Feu',
            responsible: 'Jean Martin',
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
            category: 'arts-vivants',
            categoryName: 'Arts vivants',
            categoryColor: '#f08d35',
            location: "Salle de l'Eau",
            responsible: 'Sophie Bernard',
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
            title: 'Formation Numérique',
            category: 'numerique',
            categoryName: 'Numérique',
            categoryColor: '#1f658e',
            location: 'Salle du Vent',
            responsible: 'Pierre Leroy',
            description: 'Initiation aux outils numériques et bureautique. Pour débutants et intermédiaires.',
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
            category: 'arts-vivants',
            categoryName: 'Arts vivants',
            categoryColor: '#f08d35',
            location: 'Accueil',
            responsible: 'Léa Petit',
            description: 'Découverte du patrimoine culturel local. Visite guidée avec médiateur culturel.',
            dates: [
                { month: 1, day: 11, time: '14h00 - 17h00' },
                { month: 1, day: 25, time: '14h00 - 17h00' },
                { month: 2, day: 8, time: '14h00 - 17h00' },
                { month: 2, day: 22, time: '14h00 - 17h00' }
            ]
        }
    ];
    
    // Créer les activités pour chaque date (format tableau si plusieurs par jour)
    predefinedActivities.forEach(activity => {
        activity.dates.forEach(dateInfo => {
            const dateKey = `${year}-${String(dateInfo.month + 1).padStart(2, '0')}-${String(dateInfo.day).padStart(2, '0')}`;
            const act = {
                title: activity.title,
                time: dateInfo.time,
                location: activity.location,
                description: activity.description,
                category: activity.category,
                categoryName: activity.categoryName,
                categoryColor: activity.categoryColor,
                responsible: activity.responsible
            };
            if (activities[dateKey]) {
                activities[dateKey] = Array.isArray(activities[dateKey])
                    ? [...activities[dateKey], act]
                    : [activities[dateKey], act];
            } else {
                activities[dateKey] = act;
            }
        });
    });
    
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
    
    // Convertir en tableau et trier par titre
    allActivitiesList = Object.values(activitiesMap).sort((a, b) => a.title.localeCompare(b.title));
    
    return activities;
}

// Données d'activités (générées pour toute l'année)
let activitiesData = {};
let allActivitiesList = []; // Liste de toutes les activités uniques avec leurs dates

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    const year = currentDate.getFullYear();
    activitiesData = generateYearActivities(year);
    
    initializeCalendar();
    setupEventListeners();
    setupActivityWidgets();
    setupInteretWidget();
    
    // Afficher le widget emploi du temps pour la date sélectionnée par défaut
    setTimeout(() => showActivityPopup(selectedDate), 100);
});

// Initialiser le calendrier
function initializeCalendar() {
    updateCalendar();
    updateViewTitle();
    toggleCalendars();
}

// Mettre à jour le calendrier
function updateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;
    
    calendarGrid.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // 0 = Lundi
    
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const prevDay = daysInPrevMonth - i;
        const prevDayDate = new Date(year, month - 1, prevDay);
        const isSelected = prevDayDate.toDateString() === selectedDate.toDateString();
        const day = createDayElement(prevDay, true, isSelected, prevDayDate, year, month - 1);
        calendarGrid.appendChild(day);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(year, month, day);
        const isSelected = dayDate.toDateString() === selectedDate.toDateString();
        const dayEl = createDayElement(day, false, isSelected, dayDate, year, month);
        calendarGrid.appendChild(dayEl);
    }
    
    const totalCells = calendarGrid.children.length;
    const remainingCells = 42 - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
        const nextDayDate = new Date(year, month + 1, day);
        const isSelected = nextDayDate.toDateString() === selectedDate.toDateString();
        const dayEl = createDayElement(day, true, isSelected, nextDayDate, year, month + 1);
        calendarGrid.appendChild(dayEl);
    }
}

// Créer un élément de jour
function createDayElement(day, isOtherMonth, isSelected, date, year, month) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;
    dayElement.style.cursor = 'pointer';
    
    const dateKey = formatDateKey(date);
    const activity = activitiesData[dateKey];
    
    if (isOtherMonth) dayElement.classList.add('other-month');
    if (isSelected) dayElement.classList.add('selected');
    
    if (activity) {
        const acts = Array.isArray(activity) ? activity : [activity];
        const cats = [...new Set(acts.map(a => a.category))];
        if (cats.length >= 2) dayElement.classList.add('multiple-activities');
        else if (cats.length === 1) dayElement.classList.add('activity-' + cats[0]);
    }
    
    dayElement.addEventListener('click', function() {
        const clickedDate = new Date(year, month, day);
        if (isOtherMonth) {
            currentDate.setFullYear(year);
            currentDate.setMonth(month);
            const ms = document.getElementById('monthSelect');
            const ys = document.getElementById('yearSelect');
            if (ms) ms.value = month;
            if (ys) ys.value = year;
        }
        selectDate(clickedDate);
    });
    
    return dayElement;
}

function updateViewTitle() {
    const title = document.getElementById('viewTitle');
    if (title) title.textContent = currentView === 'activites' ? 'ACTIVITÉS' : 'SALLES OCCUPÉES';
}

function toggleCalendars() {
    const calActivites = document.getElementById('calendarActivites');
    const calSalles = document.getElementById('calendarSalles');
    const activitesLegend = document.getElementById('activitesLegend');
    const sallesLegend = document.getElementById('sallesLegend');
    const searchContainer = document.getElementById('searchContainer');
    if (currentView === 'activites') {
        if (calActivites) calActivites.style.display = 'block';
        if (calSalles) calSalles.style.display = 'none';
        if (activitesLegend) activitesLegend.style.display = 'block';
        if (sallesLegend) sallesLegend.style.display = 'none';
        if (searchContainer) searchContainer.style.display = 'block';
    } else {
        if (calActivites) calActivites.style.display = 'none';
        if (calSalles) calSalles.style.display = 'block';
        if (activitesLegend) activitesLegend.style.display = 'none';
        if (sallesLegend) sallesLegend.style.display = 'block';
        if (searchContainer) searchContainer.style.display = 'none';
    }
}

function updateSelectors() {
    const ms = document.getElementById('monthSelect');
    const ys = document.getElementById('yearSelect');
    if (ms) ms.value = currentDate.getMonth();
    if (ys) ys.value = currentDate.getFullYear();
}

/** Retourne les classes CSS salle(s) pour une date à partir des activités (lieu) */
function getSalleClassesForDate(date) {
    const activities = getActivitiesForDate(date);
    if (!activities.length) return [];
    const locations = [...new Set(activities.map(a => (a.location || '').trim()).filter(Boolean))];
    if (locations.length === 0) return [];
    if (locations.length >= 2) return ['multiple-salles'];
    const salleClass = salleNameToClass[locations[0]];
    return salleClass ? [salleClass] : [];
}

function updateCalendarSalles() {
    const grid = document.getElementById('calendarGridSalles');
    if (!grid) return;
    const monthSelect = document.getElementById('monthSelectSalles');
    const yearSelect = document.getElementById('yearSelectSalles');
    if (monthSelect) monthSelect.value = currentDateSalles.getMonth();
    if (yearSelect) yearSelect.value = currentDateSalles.getFullYear();

    grid.innerHTML = '';
    const year = currentDateSalles.getFullYear();
    const month = currentDateSalles.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();

    function addDayEl(dayNum, isOtherMonth, targetYear, targetMonth) {
        const date = new Date(targetYear, targetMonth, dayNum);
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = dayNum;
        dayEl.style.cursor = 'pointer';
        dayEl.style.pointerEvents = 'auto';
        if (isOtherMonth) dayEl.classList.add('other-month');
        const isSelected = date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth() && date.getFullYear() === selectedDate.getFullYear();
        if (isSelected) dayEl.classList.add('selected');
        getSalleClassesForDate(date).forEach(c => dayEl.classList.add(c));
        dayEl.addEventListener('click', function() {
            if (isOtherMonth) {
                currentDateSalles.setFullYear(targetYear);
                currentDateSalles.setMonth(targetMonth);
            }
            selectDate(new Date(targetYear, targetMonth, dayNum));
            updateCalendarSalles();
        });
        grid.appendChild(dayEl);
    }

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const prevDay = daysInPrevMonth - i;
        addDayEl(prevDay, true, month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        addDayEl(day, false, year, month);
    }
    const total = grid.children.length;
    for (let day = 1; day <= 42 - total; day++) {
        addDayEl(day, true, month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1);
    }
}

// Sélectionner une date
function selectDate(date) {
    if (!date || isNaN(date.getTime())) return;
    selectedDate = new Date(date);
    
    if (currentView === 'activites') {
        const clickedMonth = date.getMonth();
        const clickedYear = date.getFullYear();
        if (clickedMonth !== currentDate.getMonth() || clickedYear !== currentDate.getFullYear()) {
            currentDate.setFullYear(clickedYear);
            currentDate.setMonth(clickedMonth);
            updateCalendar();
        } else {
            updateCalendar();
        }
        setTimeout(() => showActivityPopup(date), 0);
    } else {
        if (date.getMonth() !== currentDateSalles.getMonth() || date.getFullYear() !== currentDateSalles.getFullYear()) {
            currentDateSalles.setFullYear(date.getFullYear());
            currentDateSalles.setMonth(date.getMonth());
        }
        showSallesPopup(date);
        setTimeout(() => showActivityPopup(date), 0);
    }
}

// Afficher le widget d'emploi du temps
function showActivityPopup(date) {
    const dateKey = formatDateKey(date);
    const activities = getActivitiesForDate(date);
    
    const widget = document.getElementById('scheduleWidget');
    const dateText = document.getElementById('scheduleDateText');
    const timeline = document.getElementById('scheduleTimeline');
    
    if (!widget || !dateText || !timeline) return;
    
    dateText.textContent = formatDateShort(date);
    
    const existingActivities = timeline.querySelectorAll('.schedule-activity');
    existingActivities.forEach(a => a.remove());
    const noMsgs = timeline.querySelectorAll('.no-activity-message');
    noMsgs.forEach(m => m.remove());
    
    if (activities.length > 0) {
        activities.forEach((act) => {
            const block = createActivityBlock(act, 0, 1);
            if (block) timeline.appendChild(block);
        });
    } else {
        const noMsg = document.createElement('div');
        noMsg.className = 'schedule-activity no-activity-message';
        noMsg.style.cssText = 'position:relative;top:50%;left:50%;transform:translate(-50%,-50%);color:#6e6f75;';
        noMsg.textContent = 'Aucune activité prévue pour cette date';
        timeline.appendChild(noMsg);
    }
    
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    if (isToday) updateCurrentTimeIndicator(date);
    else {
        const ind = document.getElementById('currentTimeIndicator');
        if (ind) ind.style.display = 'none';
    }
    
    widget.classList.add('active');
}

function showSallesPopup(date) {
    // Vue salles : afficher le calendrier salles (lecture seule)
    const calSalles = document.getElementById('calendarSalles');
    if (calSalles) calSalles.style.display = 'block';
}

// Obtenir toutes les activités pour une date donnée
function getActivitiesForDate(date) {
    const dateKey = formatDateKey(date);
    const activity = activitiesData[dateKey];
    
    if (!activity) return [];
    
    const list = Array.isArray(activity) ? activity : [activity];
    return list.map(act => ({
        ...act,
        date: date,
        dateKey: dateKey,
        categoryName: act.categoryName || activityCategories[act.category]?.name || 'Activité',
        categoryColor: act.categoryColor || activityCategories[act.category]?.color || '#649d50',
        location: act.location || '',
        description: act.description || '',
        responsible: act.responsible || ''
    }));
}

// Créer un bloc d'activité pour le timeline (sans bouton supprimer - adhérent)
function createActivityBlock(activity, columnIndex = 0, totalColumns = 1) {
    const block = document.createElement('div');
    block.className = 'schedule-activity';
    block.style.cursor = 'pointer';
    block.setAttribute('data-column', columnIndex);
    block.setAttribute('data-total-columns', totalColumns);
    block.style.setProperty('--activity-col', columnIndex);
    block.style.setProperty('--activity-total', totalColumns);
    
    block.dataset.activityTitle = activity.title || '';
    block.dataset.activityTime = activity.time || '';
    block.dataset.activityLocation = activity.location || '';
    block.dataset.activityDescription = activity.description || '';
    block.dataset.activityCategory = activity.categoryName || '';
    block.dataset.activityColor = activity.categoryColor || '#649d50';
    block.dataset.activityResponsible = activity.responsible || '';
    block.dataset.activityDateKey = activity.dateKey || formatDateKey(selectedDate);
    
    // Parser l'heure pour positionner le bloc
    // Format attendu: "14h00 - 15h30" ou "14h - 15h30"
    const timeParts = activity.time.split(' - ');
    if (timeParts.length === 2) {
        const startMatch = timeParts[0].match(/(\d+)h(\d+)?/);
        const endMatch = timeParts[1].match(/(\d+)h(\d+)?/);
        
        if (startMatch && endMatch) {
            const startHour = parseInt(startMatch[1]);
            const startMinute = startMatch[2] ? parseInt(startMatch[2]) : 0;
            const endHour = parseInt(endMatch[1]);
            const endMinute = endMatch[2] ? parseInt(endMatch[2]) : 0;
            
            // Calculer la durée en heures
            const startTotalMinutes = startHour * 60 + startMinute;
            const endTotalMinutes = endHour * 60 + endMinute;
            const durationMinutes = endTotalMinutes - startTotalMinutes;
            const durationHours = durationMinutes / 60;
            
            // Positionner le bloc : chaque heure = 20px (50% de l'espace entre deux marqueurs)
            // Les marqueurs sont espacés de 40px mais décalés de 10px (padding-top)
            // 6h=10px, 8h=50px, 10h=90px, etc.
            // Donc 1h = 20px (50% de l'espace), 2h = 40px (100% de l'espace)
            const pixelsPerHour = 20; // Chaque heure = 20px (50% de l'espace entre deux marqueurs)
            const paddingTop = 10; // Padding pour éviter que les heures soient coupées
            const timelineHeight = 300; // Hauteur maximale du timeline avec padding (280px + 20px padding)
            const topPosition = paddingTop + Math.max(0, (startHour - 6) * pixelsPerHour + (startMinute / 60) * pixelsPerHour);
            const height = Math.min(durationHours * pixelsPerHour, timelineHeight - topPosition);
            
            // Ne créer le bloc que s'il est visible dans le timeline
            if (topPosition < timelineHeight && height > 0) {
                block.style.top = `${topPosition}px`;
                block.style.height = `${height}px`;
                
                // Ajouter le fond coloré avec 50% d'opacité en utilisant rgba (seul le fond, pas le texte)
                const rgb = hexToRgb(activity.categoryColor);
                if (rgb) {
                    block.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;
                } else {
                    block.style.backgroundColor = activity.categoryColor;
                    block.style.opacity = '0.5';
                }
                
                const text = document.createElement('span');
                text.className = 'schedule-activity-text';
                // Hauteur insuffisante (ex. ≤ 40px) : n'afficher que le nom, pas la durée
                text.textContent = height >= 40 ? `${activity.title} : ${formatDuration(durationHours)}` : activity.title;
                block.appendChild(text);
            } else {
                // Si l'activité est complètement en dehors du timeline, ne pas la créer
                return null;
            }
        }
    } else {
        // Format simple: "14h00" ou "14h"
        const timeMatch = activity.time.match(/(\d+)h(\d+)?/);
        if (timeMatch) {
            const startHour = parseInt(timeMatch[1]);
            const startMinute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
            const durationHours = 1; // Durée par défaut
            
            // Positionner le bloc : chaque heure = 20px (50% de l'espace entre deux marqueurs)
            // Les marqueurs sont espacés de 40px mais décalés de 10px (padding-top)
            const pixelsPerHour = 20; // Chaque heure = 20px (50% de l'espace entre deux marqueurs)
            const paddingTop = 10; // Padding pour éviter que les heures soient coupées
            const timelineHeight = 300; // Hauteur maximale du timeline avec padding
            const topPosition = paddingTop + Math.max(0, (startHour - 6) * pixelsPerHour + (startMinute / 60) * pixelsPerHour);
            const height = Math.min(durationHours * pixelsPerHour, timelineHeight - topPosition);
            
            // Ne créer le bloc que s'il est visible dans le timeline
            if (topPosition < timelineHeight && height > 0) {
                block.style.top = `${topPosition}px`;
                block.style.height = `${height}px`;
                
                // Ajouter le fond coloré avec 50% d'opacité en utilisant rgba
                const rgb = hexToRgb(activity.categoryColor);
                if (rgb) {
                    block.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;
                } else {
                    block.style.backgroundColor = activity.categoryColor;
                    block.style.opacity = '0.5';
                }
                
                const text = document.createElement('span');
                text.className = 'schedule-activity-text';
                // Hauteur insuffisante (ex. ≤ 40px) : n'afficher que le nom, pas la durée
                text.textContent = height >= 40 ? `${activity.title} : ${formatDuration(durationHours)}` : activity.title;
                block.appendChild(text);
            } else {
                // Si l'activité est complètement en dehors du timeline, ne pas la créer
                return null;
            }
        }
    }
    
    // Si le bloc n'a pas été créé (retour null), ne pas ajouter d'événement
    if (!block.style.top) {
        return null;
    }
    
    block.addEventListener('click', function(e) {
        e.stopPropagation();
        const activityData = {
            title: block.dataset.activityTitle,
            time: block.dataset.activityTime,
            location: block.dataset.activityLocation,
            description: block.dataset.activityDescription,
            categoryName: block.dataset.activityCategory,
            categoryColor: block.dataset.activityColor,
            responsible: block.dataset.activityResponsible || '',
            date: selectedDate,
            dateKey: block.dataset.activityDateKey || formatDateKey(selectedDate)
        };
        const activities = getActivitiesForDate(selectedDate);
        showActivityDetail(activityData, 'schedule', activities);
    });
    
    return block;
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

// Formater la date courte (ex: 10 Février 2026)
function formatDateShort(date) {
    const day = date.getDate();
    const month = monthsFull[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

// Mettre à jour l'indicateur de l'heure actuelle
function updateCurrentTimeIndicator(date) {
    const targetDate = date || new Date();
    const now = new Date();
    const isToday = targetDate.getDate() === now.getDate() && targetDate.getMonth() === now.getMonth() && targetDate.getFullYear() === now.getFullYear();
    if (!isToday) {
        const ind = document.getElementById('currentTimeIndicator');
        if (ind) ind.style.display = 'none';
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
    if (!indicator || !timeText) return;
    const timelineHeight = timeline?.offsetHeight || 300;
    if (currentHour >= 6 && currentHour <= 20 && topPosition >= 0 && topPosition <= timelineHeight) {
        indicator.style.top = `${topPosition}px`;
        timeText.textContent = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
        indicator.style.display = 'flex';
    } else {
        indicator.style.display = 'none';
    }
}

// Fermer le widget
function closeActivityPopup() {
    document.getElementById('scheduleWidget').classList.remove('active');
}

// Format de date pour la clé
function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Format de date complet
function formatDateFull(date) {
    const day = date.getDate();
    const month = monthsFull[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

// Configuration du menu déroulant recherche et widgets (sans appel, sans ajout activité)
function setupActivityWidgets() {
    const customSelect = document.getElementById('customSelect');
    const customDropdown = document.getElementById('customDropdown');
    const selectText = document.getElementById('selectText');
    const searchBar = document.getElementById('searchBar');
    const activitySelect = document.getElementById('activitySelect');
    const activitiesGroup = document.getElementById('activitiesGroup');
    
    function populateCustomDropdown() {
        if (!activitiesGroup || !allActivitiesList) return;
        const existing = activitiesGroup.querySelectorAll('.dropdown-item:not(.dropdown-group-label)');
        existing.forEach(i => i.remove());
        allActivitiesList.forEach(act => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.setAttribute('data-value', `activity:${act.title}`);
            item.innerHTML = `<span>${act.title}</span>`;
            activitiesGroup.appendChild(item);
        });
        attachDropdownListeners();
    }
    
    function attachDropdownListeners() {
        if (!customDropdown) return;
        customDropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.onclick = function(e) {
                e.stopPropagation();
                const value = this.getAttribute('data-value');
                const text = this.querySelector('span')?.textContent || '';
                selectText.textContent = text;
                selectText.classList.remove('placeholder');
                if (activitySelect) { activitySelect.value = value; activitySelect.dispatchEvent(new Event('change', { bubbles: true })); }
                customDropdown.classList.remove('active');
                if (searchBar) searchBar.classList.remove('active');
            };
        });
    }
    
    populateCustomDropdown();
    
    if (customSelect && customDropdown) {
        customSelect.addEventListener('click', function(e) {
            e.stopPropagation();
            customDropdown.classList.toggle('active');
            if (searchBar) searchBar.classList.toggle('active', customDropdown.classList.contains('active'));
        });
    }
    
    document.addEventListener('click', function(e) {
        if (customDropdown?.classList.contains('active') && !customSelect?.contains(e.target) && !customDropdown.contains(e.target)) {
            setTimeout(() => { if (customDropdown.classList.contains('active')) customDropdown.classList.remove('active'); if (searchBar) searchBar.classList.remove('active'); }, 100);
        }
    });
    
    const closeScheduleWidget = document.getElementById('closeScheduleWidget');
    const scheduleWidget = document.getElementById('scheduleWidget');
    const prevDay = document.getElementById('prevDay');
    const nextDay = document.getElementById('nextDay');
    
    if (closeScheduleWidget) closeScheduleWidget.addEventListener('click', closeActivityPopup);
    if (scheduleWidget) scheduleWidget.addEventListener('click', function(e) { if (e.target === this) closeActivityPopup(); });
    if (prevDay) prevDay.addEventListener('click', () => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); selectDate(d); });
    if (nextDay) nextDay.addEventListener('click', () => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); selectDate(d); });
    
    if (activitySelect) {
        activitySelect.addEventListener('change', function() {
            const value = this.value;
            const cardsContainer = document.getElementById('activityCardsContainer');
            if (!value) {
                if (selectText) { selectText.textContent = 'Rechercher une activité'; selectText.classList.add('placeholder'); }
                if (cardsContainer) { cardsContainer.classList.remove('active'); cardsContainer.innerHTML = ''; }
                return;
            }
            if (value.startsWith('category:')) {
                const cat = value.split(':')[1];
                const list = allActivitiesList.filter(a => a.category === cat).flatMap(a =>
                    a.dates.map(d => ({
                        title: a.title, category: a.category, categoryName: a.categoryName, categoryColor: a.categoryColor,
                        time: d.time, location: d.location, description: d.description, date: d.date, dateKey: d.dateKey, isComplete: d.isComplete
                    }))
                );
                if (list.length && cardsContainer) displayActivityCards(list);
            } else if (value.startsWith('activity:')) {
                const title = value.split(':')[1];
                const act = allActivitiesList.find(a => a.title === title);
                if (act && cardsContainer) displayActivityCards(act.dates.map(d => ({
                    title: act.title, category: act.category, categoryName: act.categoryName, categoryColor: act.categoryColor,
                    time: d.time, location: d.location, description: d.description, date: d.date, dateKey: d.dateKey, isComplete: d.isComplete
                })));
            }
        });
    }
    
    setInterval(() => { if (selectedDate) updateCurrentTimeIndicator(selectedDate); }, 60000);
    if (selectedDate) updateCurrentTimeIndicator(selectedDate);
}

function displayActivityCards(activities) {
    const container = document.getElementById('activityCardsContainer');
    if (!container) return;
    container.innerHTML = '';
    container.classList.add('active');
    activities.forEach(act => {
        const card = createActivityCard(act, activities);
        container.appendChild(card);
    });
}

function createActivityCard(activity, activitiesList) {
    const card = document.createElement('div');
    card.className = 'activity-card';
    card.style.position = 'relative';
    card.style.paddingLeft = '12px';
    const colorIndicator = document.createElement('div');
    colorIndicator.className = 'activity-card-color-indicator';
    colorIndicator.style.backgroundColor = activity.categoryColor || '#649d50';
    card.appendChild(colorIndicator);
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
    const dateDiv = document.createElement('div');
    dateDiv.className = 'activity-card-date';
    const ad = activity.date || (activity.dateKey ? new Date(activity.dateKey) : null);
    if (ad) dateDiv.textContent = `${ad.getDate()} ${monthsFull[ad.getMonth()]} ${ad.getFullYear()}`;
    card.appendChild(dateDiv);
    const timeDiv = document.createElement('div');
    timeDiv.className = 'activity-card-time';
    timeDiv.textContent = activity.time || '';
    card.appendChild(timeDiv);
    if (activity.location) { const loc = document.createElement('div'); loc.className = 'activity-card-location'; loc.textContent = activity.location; card.appendChild(loc); }
    if (activity.responsible) { const resp = document.createElement('div'); resp.className = 'activity-card-responsible'; resp.textContent = activity.responsible; card.appendChild(resp); }
    card.addEventListener('click', () => showActivityDetail(activity, 'search', activitiesList));
    return card;
}

// Configuration des événements
function setupEventListeners() {
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    const prevView = document.getElementById('prevView');
    const nextView = document.getElementById('nextView');
    
    if (prevMonth) prevMonth.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); updateCalendar(); updateSelectors(); });
    if (nextMonth) nextMonth.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); updateCalendar(); updateSelectors(); });
    
    if (monthSelect) monthSelect.addEventListener('change', (e) => { currentDate.setMonth(parseInt(e.target.value)); updateCalendar(); });
    if (yearSelect) yearSelect.addEventListener('change', (e) => { currentDate.setFullYear(parseInt(e.target.value)); updateCalendar(); });
    
    if (prevView) prevView.addEventListener('click', () => { if (currentView === 'salles') { currentView = 'activites'; updateViewTitle(); updateCalendar(); toggleCalendars(); } });
    if (nextView) nextView.addEventListener('click', () => { if (currentView === 'activites') { currentView = 'salles'; updateViewTitle(); toggleCalendars(); updateCalendarSalles(); } });
    
    const prevMonthSalles = document.getElementById('prevMonthSalles');
    const nextMonthSalles = document.getElementById('nextMonthSalles');
    const monthSelectSalles = document.getElementById('monthSelectSalles');
    const yearSelectSalles = document.getElementById('yearSelectSalles');
    if (prevMonthSalles) prevMonthSalles.addEventListener('click', () => { currentDateSalles.setMonth(currentDateSalles.getMonth() - 1); updateCalendarSalles(); });
    if (nextMonthSalles) nextMonthSalles.addEventListener('click', () => { currentDateSalles.setMonth(currentDateSalles.getMonth() + 1); updateCalendarSalles(); });
    if (monthSelectSalles) monthSelectSalles.addEventListener('change', (e) => { currentDateSalles.setMonth(parseInt(e.target.value)); updateCalendarSalles(); });
    if (yearSelectSalles) yearSelectSalles.addEventListener('change', (e) => { currentDateSalles.setFullYear(parseInt(e.target.value)); updateCalendarSalles(); });
    
    // Remplir le select natif caché (activitiesList)
    const activitiesListGroup = document.getElementById('activitiesList');
    if (activitiesListGroup && allActivitiesList) {
        allActivitiesList.forEach(act => {
            const opt = document.createElement('option');
            opt.value = `activity:${act.title}`;
            opt.textContent = act.title;
            activitiesListGroup.appendChild(opt);
        });
    }
    
    // Fermer le widget avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeActivityPopup();
        }
    });
    
    // Mettre à jour l'heure actuelle toutes les minutes
    setInterval(updateCurrentTimeIndicator, 60000);
    updateCurrentTimeIndicator();
}

// Afficher le widget de détail d'activité
function showActivityDetail(activity, context = 'schedule', activityList = []) {
    const overlay = document.getElementById('activityDetailOverlay');
    const name = document.getElementById('activityDetailName');
    const description = document.getElementById('activityDetailDescription');
    
    if (!overlay || !name || !description) {
        return;
    }
    
    // Stocker le contexte et la liste d'activités
    activityDetailContext = context;
    currentActivityList = activityList.length > 0 ? activityList : [activity];
    
    // Trouver l'index de l'activité actuelle dans la liste
    currentActivityIndex = currentActivityList.findIndex(a => 
        a.title === activity.title && a.time === activity.time
    );
    if (currentActivityIndex === -1) {
        currentActivityIndex = 0;
    }
    
    // Afficher l'activité
    displayActivityInDetail(activity);
    
    overlay.classList.add('active');
    document.body.classList.add('schedule-widget-open');
}

// Afficher une activité dans le widget de détail (salle en lecture seule)
function displayActivityInDetail(activity) {
    const name = document.getElementById('activityDetailName');
    const description = document.getElementById('activityDetailDescription');
    const dateElement = document.getElementById('activityDetailDate');
    const timeElement = document.getElementById('activityDetailTimeDetail');
    const salleDisplay = document.getElementById('activityDetailSalleDisplay');
    const salleBadge = document.getElementById('activityDetailSalleBadge');
    const benevoleName = document.getElementById('activityDetailBenevoleName');
    const benevoleBadge = document.getElementById('activityDetailBenevoleBadge');
    const card = document.querySelector('.activity-detail-card');
    
    if (!name || !description) return;
    
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
    
    if (timeElement) timeElement.textContent = activity.time || '';
    
    const salle = activity.location?.trim() || '';
    const salleColor = salleToColor[salle] || '#6e6f75';
    if (card) card.style.setProperty('--salle-color', salleColor);
    if (salleDisplay && salleBadge) {
        salleDisplay.textContent = salle || '—';
        salleBadge.style.display = '';
    }
    
    if (benevoleName && benevoleBadge) {
        benevoleName.textContent = activity.responsible?.trim() || '—';
        benevoleBadge.style.display = '';
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

// Fermer le widget de détail d'activité
function closeActivityDetail() {
    const overlay = document.getElementById('activityDetailOverlay');
    if (overlay) overlay.classList.remove('active');
    document.body.classList.remove('schedule-widget-open');
}

// --- Widget Je suis intéressé ---
function openInteretWidget(activity) {
    const overlay = document.getElementById('interetOverlay');
    const nameEl = document.getElementById('interetActivityName');
    const dateEl = document.getElementById('interetActivityDate');
    if (!overlay || !nameEl || !dateEl) return;
    
    nameEl.textContent = activity.title || 'Activité';
    const activityDate = activity.date || (activity.dateKey ? new Date(activity.dateKey) : selectedDate);
    if (activityDate) {
        const day = activityDate.getDate();
        const monthIndex = activityDate.getMonth();
        const year = activityDate.getFullYear();
        dateEl.textContent = `${day} ${monthsFull[monthIndex]} ${year} • ${activity.time || ''}`;
    } else {
        dateEl.textContent = formatDateShort(selectedDate) + (activity.time ? ' • ' + activity.time : '');
    }
    overlay.classList.add('active');
}

function setupInteretWidget() {
    const overlay = document.getElementById('interetOverlay');
    const closeBtn = document.getElementById('closeInteretWidget');
    const confirmBtn = document.getElementById('interetConfirmBtn');
    
    if (closeBtn) closeBtn.addEventListener('click', () => overlay?.classList.remove('active'));
    if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); });
    
    if (confirmBtn) confirmBtn.addEventListener('click', function() {
        if (!currentActivityDetail) return;
        const email = (typeof CONFIG !== 'undefined' && CONFIG.EMAIL_CONTACT) ? CONFIG.EMAIL_CONTACT : 'contact@vill-age-jeunes.fr';
        const subject = encodeURIComponent(`Intérêt pour l'activité : ${currentActivityDetail.title || 'Activité'}`);
        const activityDate = currentActivityDetail.date || (currentActivityDetail.dateKey ? new Date(currentActivityDetail.dateKey) : selectedDate);
        const dateStr = activityDate ? formatDateShort(activityDate) : formatDateShort(selectedDate);
        const body = encodeURIComponent(
            `Bonjour,\n\nJe souhaite participer à l'activité suivante :\n\n` +
            `- Activité : ${currentActivityDetail.title || 'Activité'}\n` +
            `- Date : ${dateStr}\n` +
            `- Horaire : ${currentActivityDetail.time || ''}\n\n` +
            `Numéro adhérent : {adherent_numero}\n` +
            `Nom : {adherent_nom}\n` +
            `Prénom : {adherent_prenom}\n\n` +
            `(Ces informations seront remplacées par les données de session/API)`
        );
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
        overlay?.classList.remove('active');
        document.getElementById('activityDetailOverlay')?.classList.remove('active');
        document.body.classList.remove('schedule-widget-open');
        alert('Votre demande a été envoyée. Le responsable d\'activité vous recontactera.');
    });
}

// Variable pour stocker l'activité actuellement affichée
let currentActivityDetail = null;
let currentActivityList = []; // Liste des activités disponibles pour la navigation
let currentActivityIndex = 0; // Index de l'activité actuelle dans la liste
let activityDetailContext = null; // 'schedule' ou 'search' pour savoir d'où vient l'ouverture

// Événements pour fermer le widget et navigation
document.addEventListener('DOMContentLoaded', function() {
    const closeButton = document.getElementById('closeActivityDetail');
    const overlay = document.getElementById('activityDetailOverlay');
    const prevButton = document.getElementById('prevActivity');
    const nextButton = document.getElementById('nextActivity');
    const interetBtn = document.getElementById('interetActivityButton');
    
    if (closeButton) closeButton.addEventListener('click', closeActivityDetail);
    
    if (overlay) overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeActivityDetail();
    });
    
    if (prevButton) prevButton.addEventListener('click', function(e) { e.stopPropagation(); navigateToPreviousActivity(); });
    if (nextButton) nextButton.addEventListener('click', function(e) { e.stopPropagation(); navigateToNextActivity(); });
    
    if (interetBtn) interetBtn.addEventListener('click', function() {
        if (currentActivityDetail) openInteretWidget(currentActivityDetail);
    });

    // ----- Widget "Faire une demande" (réservation salle / RDV) -----
    const demandesOverlayEl = document.getElementById('demandesAdherentOverlay');
    const demandesChoiceStep = document.getElementById('demandesChoiceStep');
    const demandesFormStep = document.getElementById('demandesFormStep');
    const demandesBenevoleStep = document.getElementById('demandesBenevoleStep');
    const demandesBenevoleForm = document.getElementById('demandesBenevoleForm');
    const demandesFormTitle = document.getElementById('demandesFormTitle');
    const demandesTypeInput = document.getElementById('demandesType');
    const demandesForm = document.getElementById('demandesAdherentForm');
    const demandesContactGroup = document.getElementById('demandesContactGroup');
    const demandesCategorieGroup = document.getElementById('demandesCategorieGroup');
    const demandesContactSelect = document.getElementById('demandesContact');
    const demandesCategorieSelect = document.getElementById('demandesCategorie');
    const demandesDateInput = document.getElementById('demandesDate');
    const demandesTimeInput = document.getElementById('demandesTime');
    const demandesMotifInput = document.getElementById('demandesMotif');

    // Liste des bénévoles (alignée avec accueil-staff)
    const demandesBenevoles = [
        'Animateur 1', 'Animateur 2', 'Animateur 3', 'Animateur 4', 'Animateur 5',
        'Animateur 6', 'Animateur 7', 'Animateur 8', 'Animateur 9', 'Animateur 10'
    ];
    if (demandesContactSelect) {
        demandesBenevoles.forEach(function(name) {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            demandesContactSelect.appendChild(opt);
        });
    }
    if (demandesCategorieSelect && typeof activityCategories !== 'undefined') {
        Object.keys(activityCategories).forEach(function(key) {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = activityCategories[key].name;
            demandesCategorieSelect.appendChild(opt);
        });
    }

    function openDemandesWidget() {
        if (!demandesOverlayEl) return;
        demandesChoiceStep?.removeAttribute('hidden');
        demandesFormStep?.setAttribute('hidden', '');
        demandesBenevoleStep?.setAttribute('hidden', '');
        demandesOverlayEl.classList.add('active');
        document.documentElement.classList.add('demandes-overlay-open');
        document.body.classList.add('demandes-overlay-open');
    }

    function closeDemandesWidget() {
        if (!demandesOverlayEl) return;
        demandesOverlayEl.classList.remove('active');
        document.documentElement.classList.remove('demandes-overlay-open');
        document.body.classList.remove('demandes-overlay-open');
        demandesChoiceStep?.removeAttribute('hidden');
        demandesFormStep?.setAttribute('hidden', '');
        demandesBenevoleStep?.setAttribute('hidden', '');
        if (demandesForm) demandesForm.reset();
        if (demandesBenevoleForm) demandesBenevoleForm.reset();
    }

    function showDemandesForm(type) {
        if (type === 'benevole') {
            if (demandesChoiceStep) demandesChoiceStep.setAttribute('hidden', '');
            if (demandesFormStep) demandesFormStep.setAttribute('hidden', '');
            if (demandesBenevoleStep) demandesBenevoleStep.removeAttribute('hidden');
            return;
        }
        const isSalle = type === 'salle';
        if (demandesTypeInput) demandesTypeInput.value = type;
        if (demandesFormTitle) demandesFormTitle.textContent = isSalle ? 'Réserver une salle' : 'Prendre rendez-vous';
        // Prendre RDV : afficher uniquement "Membre à contacter", pas de Catégorie
        if (demandesContactGroup) {
            demandesContactGroup.hidden = isSalle;
            demandesContactGroup.style.display = isSalle ? 'none' : '';
            if (demandesContactSelect) {
                demandesContactSelect.required = !isSalle;
                if (isSalle) demandesContactSelect.value = '';
            }
        }
        // Réserver une salle : afficher uniquement "Catégorie", pas de Bénévole
        if (demandesCategorieGroup) {
            demandesCategorieGroup.hidden = !isSalle;
            demandesCategorieGroup.style.display = !isSalle ? 'none' : '';
            if (demandesCategorieSelect) {
                demandesCategorieSelect.required = isSalle;
                if (!isSalle) demandesCategorieSelect.value = '';
            }
        }
        if (demandesChoiceStep) demandesChoiceStep.setAttribute('hidden', '');
        if (demandesFormStep) demandesFormStep.removeAttribute('hidden');
        if (demandesBenevoleStep) demandesBenevoleStep.setAttribute('hidden', '');
    }

    function backToDemandesChoice() {
        if (demandesFormStep) demandesFormStep.setAttribute('hidden', '');
        if (demandesBenevoleStep) demandesBenevoleStep.setAttribute('hidden', '');
        if (demandesChoiceStep) demandesChoiceStep.removeAttribute('hidden');
        if (demandesForm) demandesForm.reset();
        if (demandesBenevoleForm) demandesBenevoleForm.reset();
    }

    document.getElementById('demandesAdherentButton')?.addEventListener('click', openDemandesWidget);
    document.getElementById('closeDemandesAdherent')?.addEventListener('click', closeDemandesWidget);
    demandesOverlayEl?.addEventListener('click', function(e) {
        if (e.target === demandesOverlayEl) closeDemandesWidget();
    });

    document.getElementById('demandesOptionSalle')?.addEventListener('click', function() { showDemandesForm('salle'); });
    document.getElementById('demandesOptionRdv')?.addEventListener('click', function() { showDemandesForm('rdv'); });
    document.getElementById('demandesOptionBenevole')?.addEventListener('click', function() { showDemandesForm('benevole'); });
    document.getElementById('demandesAdherentBack')?.addEventListener('click', backToDemandesChoice);
    document.getElementById('demandesBenevoleBack')?.addEventListener('click', backToDemandesChoice);
    document.getElementById('demandesFormCancel')?.addEventListener('click', closeDemandesWidget);
    document.getElementById('demandesBenevoleCancel')?.addEventListener('click', closeDemandesWidget);

    // Champs conditionnels formulaire bénévole
    (function() {
        var cbAide = document.getElementById('demandesBenevoleAideEspace');
        var cbReseau = document.getElementById('demandesBenevoleReseau');
        var cbAutre = document.getElementById('demandesBenevoleAutreIdee');
        var cbProjetAutre = document.getElementById('demandesBenevoleProjetAutre');
        if (cbAide) cbAide.addEventListener('change', function() { document.getElementById('demandesBenevoleAideEspaceText').style.display = this.checked ? 'block' : 'none'; });
        if (cbReseau) cbReseau.addEventListener('change', function() { document.getElementById('demandesBenevoleReseauText').style.display = this.checked ? 'block' : 'none'; });
        if (cbAutre) cbAutre.addEventListener('change', function() { document.getElementById('demandesBenevoleAutreIdeeText').style.display = this.checked ? 'block' : 'none'; });
        if (cbProjetAutre) cbProjetAutre.addEventListener('change', function() { document.getElementById('demandesBenevoleProjetAutreText').style.display = this.checked ? 'block' : 'none'; });
    })();

    if (demandesForm) {
        demandesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const type = (demandesTypeInput?.value || '').trim();
            const dateVal = (demandesDateInput?.value || '').trim();
            const timeVal = (demandesTimeInput?.value || '').trim();
            const motif = (demandesMotifInput?.value || '').trim();
            if (!type || !dateVal || !timeVal || !motif) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }
            if (type === 'rdv') {
                const contact = (demandesContactSelect?.value || '').trim();
                if (!contact) {
                    alert('Veuillez sélectionner le membre de l\'équipe à contacter.');
                    return;
                }
            }
            if (type === 'salle') {
                const categorie = (demandesCategorieSelect?.value || '').trim();
                if (!categorie) {
                    alert('Veuillez sélectionner une catégorie.');
                    return;
                }
            }
            const email = (typeof CONFIG !== 'undefined' && CONFIG.EMAIL_CONTACT) ? CONFIG.EMAIL_CONTACT : 'contact@vill-age-jeunes.fr';
            const typeLabel = type === 'salle' ? 'Réservation de salle' : 'Demande de rendez-vous';
            const subject = encodeURIComponent(`[Adhérent] ${typeLabel} - ${dateVal} ${timeVal}`);
            const memberNumber = profileData.memberNumber || (document.getElementById('profileMemberNumber')?.textContent || '').replace(/^N°\s*/, '').trim() || '—';
            let bodyLines = [
                'Bonjour,',
                '',
                'Demande : ' + typeLabel,
                'Date : ' + dateVal,
                'Heure : ' + timeVal,
                'Numéro adhérent : ' + memberNumber
            ];
            if (type === 'rdv' && demandesContactSelect?.value) {
                bodyLines.push('Bénévole à contacter : ' + demandesContactSelect.value);
            }
            if (type === 'salle' && demandesCategorieSelect?.value) {
                const catName = (typeof activityCategories !== 'undefined' && activityCategories[demandesCategorieSelect.value])
                    ? activityCategories[demandesCategorieSelect.value].name
                    : demandesCategorieSelect.value;
                bodyLines.push('Catégorie : ' + catName);
            }
            bodyLines.push('', 'Motif détaillé :', motif);
            const body = encodeURIComponent(bodyLines.join('\n'));
            window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
            closeDemandesWidget();
            alert('Votre demande a bien été préparée. Ouvrez votre logiciel de messagerie pour l\'envoyer.');
        });
    }

    var benevoleConfirmOverlay = document.getElementById('benevoleConfirmOverlay');
    function openBenevoleConfirm() {
        if (benevoleConfirmOverlay) {
            benevoleConfirmOverlay.classList.add('active');
            benevoleConfirmOverlay.setAttribute('aria-hidden', 'false');
        }
    }
    function closeBenevoleConfirm() {
        if (benevoleConfirmOverlay) {
            benevoleConfirmOverlay.classList.remove('active');
            benevoleConfirmOverlay.setAttribute('aria-hidden', 'true');
        }
    }
    function sendBenevoleCandidature() {
        var form = demandesBenevoleForm;
        if (!form) return;
        var memberNumber = (typeof profileData !== 'undefined' && profileData.memberNumber) ? profileData.memberNumber : (document.getElementById('profileMemberNumber')?.textContent || '').replace(/^N°\s*/, '').trim() || '—';
        var lines = ['Bonjour,', '', 'Candidature bénévole', 'Numéro adhérent : ' + memberNumber, ''];
        function addLine(label, value) {
            if (value !== undefined && value !== null && (value + '').trim() !== '') lines.push(label + ' : ' + (value + '').trim());
        }
        function getCheckboxes(name) {
            var nodes = form.querySelectorAll('input[name="' + name + '"]:checked');
            return Array.prototype.map.call(nodes, function(n) { return n.value; }).join(', ');
        }
        addLine('Ce que j\'aimerais amener', getCheckboxes('amener'));
        addLine('Aide espace', form.querySelector('[name="aideEspace"]')?.value);
        addLine('Réseau particulier', form.querySelector('[name="reseauParticulier"]')?.value);
        addLine('Autre idée', form.querySelector('[name="autreIdee"]')?.value);
        addLine('Types de projets', getCheckboxes('typeProjet'));
        addLine('Type projet autre', form.querySelector('[name="typeProjetAutre"]')?.value);
        addLine('Bénévolat', getCheckboxes('benevolat'));
        addLine('Je sais faire', form.querySelector('[name="saisFaire"]')?.value);
        addLine('J\'aimerais faire', form.querySelector('[name="aimeraisFaire"]')?.value);
        addLine('Je peux transmettre', form.querySelector('[name="peuxTransmettre"]')?.value);
        addLine('J\'aimerais apprendre', form.querySelector('[name="aimeraisApprendre"]')?.value);
        var email = (typeof CONFIG !== 'undefined' && CONFIG.EMAIL_CONTACT) ? CONFIG.EMAIL_CONTACT : 'contact@vill-age-jeunes.fr';
        var subject = encodeURIComponent('[Adhérent] Candidature bénévole');
        var body = encodeURIComponent(lines.join('\n'));
        window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
        closeBenevoleConfirm();
        closeDemandesWidget();
        if (demandesBenevoleForm) demandesBenevoleForm.reset();
        alert('Merci de te rendre à l\'accueil auprès d\'un des membres du staff pour finir de valider ta candidature.');
    }

    if (demandesBenevoleForm) {
        demandesBenevoleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var form = this;

            var amenerChecked = form.querySelectorAll('input[name="amener"]:checked').length;
            if (amenerChecked === 0) {
                alert('Veuillez cocher au moins une option dans « Ce que j\'aimerais amener ».');
                return;
            }

            var typeProjetChecked = form.querySelectorAll('input[name="typeProjet"]:checked').length;
            if (typeProjetChecked === 0) {
                alert('Veuillez cocher au moins un type de projet dans « Type(s) de projets qui m\'intéressent ».');
                return;
            }

            var benevolatCheckboxes = form.querySelectorAll('input[name="benevolat"]');
            var benevolatChecked = Array.prototype.filter.call(benevolatCheckboxes, function(cb) { return cb.checked; }).length;
            if (benevolatChecked !== 3) {
                alert('Veuillez cocher les 3 cases : Je suis Volontaire, Motivé·e et Disponible.');
                return;
            }

            var saisFaire = (form.querySelector('[name="saisFaire"]')?.value || '').trim();
            var aimeraisFaire = (form.querySelector('[name="aimeraisFaire"]')?.value || '').trim();
            var peuxTransmettre = (form.querySelector('[name="peuxTransmettre"]')?.value || '').trim();
            var aimeraisApprendre = (form.querySelector('[name="aimeraisApprendre"]')?.value || '').trim();
            var atLeastOneText = saisFaire !== '' || aimeraisFaire !== '' || peuxTransmettre !== '' || aimeraisApprendre !== '';
            if (!atLeastOneText) {
                alert('Veuillez remplir au moins un des quatre champs : Je sais faire, J\'aimerais faire, Je peux transmettre, J\'aimerais apprendre.');
                return;
            }

            openBenevoleConfirm();
        });
    }
    document.getElementById('benevoleConfirmCancel')?.addEventListener('click', closeBenevoleConfirm);
    document.getElementById('benevoleConfirmSubmit')?.addEventListener('click', sendBenevoleCandidature);
    benevoleConfirmOverlay?.addEventListener('click', function(e) {
        if (e.target === benevoleConfirmOverlay) closeBenevoleConfirm();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const interetOverlay = document.getElementById('interetOverlay');
            const benevoleConfirm = document.getElementById('benevoleConfirmOverlay');
            const profileOverlay = document.getElementById('profileOverlay');
            const activityDetailOverlay = document.getElementById('activityDetailOverlay');
            const scheduleWidget = document.getElementById('scheduleWidget');
            const demandesOverlay = document.getElementById('demandesAdherentOverlay');
            if (interetOverlay?.classList.contains('active')) {
                interetOverlay.classList.remove('active');
            } else if (benevoleConfirm?.classList.contains('active')) {
                closeBenevoleConfirm();
            } else if (demandesOverlay?.classList.contains('active')) {
                closeDemandesWidget();
            } else if (profileOverlay?.classList.contains('active')) {
                closeProfile();
            } else if (activityDetailOverlay?.classList.contains('active')) {
                closeActivityDetail();
            } else if (scheduleWidget?.classList.contains('active')) {
                closeActivityPopup();
            }
        }
    });

    // Gestion du widget de profil adhérent (fiche complète, menus = inscription)
    const profileOverlay = document.getElementById('profileOverlay');
    const profileBackdrop = document.getElementById('profileOverlayBackdrop');
    const closeProfileButton = document.getElementById('closeProfile');
    const profileIcon = document.getElementById('profileIcon');
    
    function closeProfile() {
        if (profileOverlay) { profileOverlay.classList.remove('active'); profileOverlay.hidden = true; }
        if (profileBackdrop) { profileBackdrop.classList.remove('active'); profileBackdrop.hidden = true; profileBackdrop.setAttribute('aria-hidden', 'true'); }
        document.body.classList.remove('profile-overlay-open');
        document.body.style.overflow = '';
    }
    
    const profileData = {
        lastName: 'Martin',
        firstName: 'Jean',
        nickname: 'Jéjé',
        memberNumber: 'VJ-2026-001',
        dateNaissance: '15/03/2008',
        genre: 'M',
        telephone: '87 12 34 56',
        email: 'jean.martin@email.com',
        province: 'Province Sud',
        commune: 'Nouméa',
        quartier: 'Centre-Ville',
        district: '',
        medicalInfo: '',
        estEtudiant: 'Oui',
        typeEtablissement: 'Lycee',
        etablissement: 'Mont-Dore - Lycée polyvalent du Mont-Dore',
        etudesSup: '',
        rechercheEmploi: 'Non',
        activitePayee: '',
        asso: '',
        autreActivite: '',
        mobilite: ['velo', 'bus'],
        permis: ['voiture'],
        autorisationImage: 'Oui',
        autorisationUrgence: 'Oui',
        parentNom: '',
        parentTelephone: '',
        parentEmail: '',
        parentAdresse: ''
    };

    function setProfileValue(id, value) {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.tagName === 'SELECT') el.value = value || '';
        else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.value = value || '';
        else el.textContent = value || '—';
    }

    function getProfileInputValue(id) {
        const el = document.getElementById(id);
        return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') ? (el.value || '').trim() : '';
    }

    function getProfilePermisValues() {
        return Array.from(document.querySelectorAll('input[name="profilePermis"]:checked')).map(cb => cb.value);
    }

    function setProfilePermis(values) {
        document.querySelectorAll('input[name="profilePermis"]').forEach(cb => { cb.checked = values && values.includes(cb.value); });
    }

    function getProfileMobiliteValues() {
        return Array.from(document.querySelectorAll('input[name="profileMobilite"]:checked')).map(cb => cb.value);
    }

    function setProfileMobilite(values) {
        document.querySelectorAll('input[name="profileMobilite"]').forEach(cb => { cb.checked = values && values.includes(cb.value); });
    }

    // Initialiser les menus déroulants (données form-data.js)
    function initProfileSelects() {
        const provinces = ['Province Sud', 'Province Nord', 'Îles Loyauté'];
        const prov = document.getElementById('profileProvince');
        if (prov && typeof communesSud !== 'undefined') {
            prov.innerHTML = '<option value="">Sélectionnez une province</option>' + provinces.map(p => `<option value="${p}">${p}</option>`).join('');
        }
    }

    function loadProfileCommunes(province) {
        const comm = document.getElementById('profileCommune');
        const quartierCont = document.getElementById('profileQuartierContainer');
        const districtCont = document.getElementById('profileDistrictContainer');
        const quartierSel = document.getElementById('profileQuartier');
        const quartierInp = document.getElementById('profileQuartierInput');
        const districtSel = document.getElementById('profileDistrict');
        const districtInp = document.getElementById('profileDistrictInput');
        if (!comm || typeof communesSud === 'undefined') return;
        comm.innerHTML = '<option value="">Sélectionnez une commune</option>';
        quartierCont.style.display = 'none';
        districtCont.style.display = 'none';
        if (quartierSel) quartierSel.style.display = 'none';
        if (quartierInp) quartierInp.style.display = 'none';
        if (districtSel) districtSel.style.display = 'none';
        if (districtInp) districtInp.style.display = 'none';
        if (!province) return;
        let communes = [];
        if (province === 'Province Sud') {
            communes = Object.keys(communesSud).sort((a, b) => (a === 'Nouméa' ? -1 : b === 'Nouméa' ? 1 : a.localeCompare(b)));
            quartierCont.style.display = 'block';
        } else if (province === 'Province Nord') {
            communes = Object.keys(communesNord).sort();
            quartierCont.style.display = 'block';
        } else if (province === 'Îles Loyauté') {
            communes = Object.keys(communesIles);
            quartierCont.style.display = 'none';
            districtCont.style.display = 'block';
        }
        communes.forEach(c => { comm.innerHTML += `<option value="${c}">${c}</option>`; });
    }

    function loadProfileQuartiers(province, commune) {
        const quartierSel = document.getElementById('profileQuartier');
        const quartierInp = document.getElementById('profileQuartierInput');
        const districtSel = document.getElementById('profileDistrict');
        const districtInp = document.getElementById('profileDistrictInput');
        if (!quartierSel || !quartierInp) return;
        quartierSel.innerHTML = '<option value="">Sélectionnez un quartier</option>';
        quartierSel.style.display = 'none';
        quartierInp.style.display = 'none';
        quartierInp.value = '';
        if (province === 'Îles Loyauté' && commune && communesIles[commune]) {
            const districts = communesIles[commune];
            districtSel.innerHTML = '<option value="">Sélectionnez un district</option>';
            districts.forEach(d => { districtSel.innerHTML += `<option value="${d}">${d}</option>`; });
            districtSel.style.display = 'block';
            if (districtInp) districtInp.style.display = 'none';
        } else if ((province === 'Province Sud' && communesSud[commune]) || (province === 'Province Nord' && communesNord[commune])) {
            const data = province === 'Province Sud' ? communesSud : communesNord;
            const quartiers = data[commune];
            if (quartiers && quartiers.length > 0) {
                quartiers.forEach(q => { quartierSel.innerHTML += `<option value="${q}">${q}</option>`; });
                quartierSel.style.display = 'block';
            } else {
                quartierInp.style.display = 'block';
            }
        }
    }

    function loadProfileEtablissements(type) {
        const sel = document.getElementById('profileEtablissement');
        const wrap = document.getElementById('profileEtablissementSelectWrap');
        const etudesWrap = document.getElementById('profileEtudesSupWrap');
        const etudesInp = document.getElementById('profileEtudesSup');
        if (!sel || typeof collegesPublics === 'undefined') return;
        if (type === 'EtudesSup') {
            wrap.style.display = 'none';
            etudesWrap.style.display = 'block';
            if (etudesInp) etudesInp.value = profileData.etudesSup || '';
            return;
        }
        wrap.style.display = 'block';
        etudesWrap.style.display = 'none';
        if (etudesInp) etudesInp.value = '';
        sel.innerHTML = '<option value="">Sélectionnez un établissement</option>';
        let list = [];
        if (type === 'College') list = [...collegesPublics, ...collegesPrives].sort();
        else if (type === 'Lycee') list = [...lyceesPublics, ...lyceesPrives].sort();
        list.forEach(e => { sel.innerHTML += `<option value="${e}">${e}</option>`; });
    }

    function setProfileEditMode(editing) {
        var widget = document.querySelector('#profileOverlay .profile-widget');
        var actionsEl = document.querySelector('.profile-actions');
        var editBtn = document.getElementById('profileEditBtn');
        var editButtons = document.getElementById('profileEditButtons');
        var editables = document.querySelectorAll('#profileOverlay .profile-editable, #profileOverlay .profile-checkbox');
        if (widget) widget.classList.toggle('profile-widget--editing', !!editing);
        if (actionsEl) actionsEl.classList.toggle('profile-actions--editing', !!editing);
        if (editBtn) editBtn.hidden = !!editing;
        if (editButtons) editButtons.hidden = !editing;
        editables.forEach(function (el) {
            var isTextInput = el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'email' || el.type === 'tel');
            if (el.tagName === 'SELECT' || (el.tagName === 'INPUT' && el.type === 'checkbox')) {
                el.disabled = !editing;
            } else if (isTextInput || el.tagName === 'TEXTAREA') {
                el.readOnly = !editing;
            }
        });
    }

    function fillProfileFormFromData() {
        setProfileValue('profileProvince', profileData.province);
        setProfileValue('profileNickname', profileData.nickname);
        setProfileValue('profileMedicalInfo', profileData.medicalInfo);
        setProfileValue('profileEstEtudiant', profileData.estEtudiant);
        setProfileValue('profileTypeEtablissement', profileData.typeEtablissement);
        setProfileValue('profileRechercheEmploi', profileData.rechercheEmploi);
        setProfileValue('profileActivitePayee', profileData.activitePayee);
        setProfileValue('profileAsso', profileData.asso);
        setProfileValue('profileAutreActivite', profileData.autreActivite);
        setProfilePermis(profileData.permis);
        setProfileMobilite(profileData.mobilite);
        var comm = document.getElementById('profileCommune');
        if (comm) comm.value = profileData.commune || '';
        loadProfileQuartiers(profileData.province, profileData.commune);
        loadProfileEtablissements(profileData.typeEtablissement);
        setTimeout(function () {
            var qs = document.getElementById('profileQuartier');
            var qi = document.getElementById('profileQuartierInput');
            var ds = document.getElementById('profileDistrict');
            var di = document.getElementById('profileDistrictInput');
            if (profileData.province === 'Îles Loyauté' && ds) ds.value = profileData.district || '';
            else if (qs && profileData.quartier) { if (qs.options.length) qs.value = profileData.quartier; else if (qi) qi.value = profileData.quartier || ''; }
            if (di && profileData.district) di.value = profileData.district || '';
            if (profileData.typeEtablissement === 'EtudesSup') {
                var ei = document.getElementById('profileEtudesSup');
                if (ei) ei.value = profileData.etudesSup || '';
            } else {
                var es = document.getElementById('profileEtablissement');
                if (es) es.value = profileData.etablissement || '';
            }
        }, 80);
    }

    function showProfile() {
        if (!profileOverlay) return;
        initProfileSelects();
        loadProfileCommunes(profileData.province);
        setTimeout(() => {
            const comm = document.getElementById('profileCommune');
            if (comm) comm.value = profileData.commune;
            loadProfileQuartiers(profileData.province, profileData.commune);
            setTimeout(() => {
                const qs = document.getElementById('profileQuartier');
                const qi = document.getElementById('profileQuartierInput');
                const ds = document.getElementById('profileDistrict');
                const di = document.getElementById('profileDistrictInput');
                if (profileData.province === 'Îles Loyauté' && ds) ds.value = profileData.district || '';
                else if (qs && profileData.quartier) { qs.value = profileData.quartier; qs.style.display = 'block'; }
                else if (qi && profileData.quartier) { qi.value = profileData.quartier; qi.style.display = 'block'; }
            }, 0);
        }, 0);
        loadProfileEtablissements(profileData.typeEtablissement);
        if (profileData.typeEtablissement === 'EtudesSup') {
            const ei = document.getElementById('profileEtudesSup');
            if (ei) ei.value = profileData.etudesSup || '';
        } else {
            const es = document.getElementById('profileEtablissement');
            if (es) es.value = profileData.etablissement || '';
        }
        setProfileValue('profileProvince', profileData.province);
        setProfileValue('profileDisplayName', profileData.lastName + ' ' + profileData.firstName);
        setProfileValue('profileMemberNumber', profileData.memberNumber);
        setProfileValue('profileLastName', profileData.lastName);
        setProfileValue('profileFirstName', profileData.firstName);
        setProfileValue('profileDateNaissance', profileData.dateNaissance);
        setProfileValue('profileNickname', profileData.nickname);
        setProfileValue('profileGenre', profileData.genre);
        setProfileValue('profileTelephone', profileData.telephone);
        setProfileValue('profileEmail', profileData.email);
        setProfileValue('profileMedicalInfo', profileData.medicalInfo);
        setProfileValue('profileEstEtudiant', profileData.estEtudiant);
        setProfileValue('profileTypeEtablissement', profileData.typeEtablissement);
        setProfileValue('profileRechercheEmploi', profileData.rechercheEmploi);
        setProfileValue('profileActivitePayee', profileData.activitePayee);
        setProfileValue('profileAsso', profileData.asso);
        setProfileValue('profileAutreActivite', profileData.autreActivite);
        setProfileValue('profileAutorisationImage', profileData.autorisationImage);
        setProfileValue('profileAutorisationUrgence', profileData.autorisationUrgence);
        setProfileValue('profileParentNom', profileData.parentNom);
        setProfileValue('profileParentTelephone', profileData.parentTelephone);
        setProfileValue('profileParentEmail', profileData.parentEmail);
        setProfileValue('profileParentAdresse', profileData.parentAdresse);
        setProfilePermis(profileData.permis);
        setProfileMobilite(profileData.mobilite);
        const mineurSection = document.getElementById('profileMineurSection');
        if (mineurSection) mineurSection.style.display = profileData.parentNom ? 'block' : 'none';
        setProfileEditMode(false);
        if (profileBackdrop) {
            profileBackdrop.hidden = false;
            profileBackdrop.setAttribute('aria-hidden', 'false');
            profileBackdrop.classList.add('active');
        }
        profileOverlay.hidden = false;
        profileOverlay.classList.add('active');
        document.body.classList.add('profile-overlay-open');
        document.body.style.overflow = 'hidden';
    }

    function saveProfile() {
        profileData.nickname = getProfileInputValue('profileNickname');
        profileData.medicalInfo = getProfileInputValue('profileMedicalInfo');
        profileData.province = getProfileInputValue('profileProvince');
        profileData.commune = getProfileInputValue('profileCommune');
        const qs = document.getElementById('profileQuartier');
        const qi = document.getElementById('profileQuartierInput');
        const ds = document.getElementById('profileDistrict');
        const di = document.getElementById('profileDistrictInput');
        profileData.quartier = (qs && qs.style.display !== 'none' ? qs.value : (qi ? qi.value : '')) || '';
        profileData.district = (ds && ds.style.display !== 'none' ? ds.value : (di ? di.value : '')) || '';
        profileData.estEtudiant = getProfileInputValue('profileEstEtudiant');
        profileData.typeEtablissement = getProfileInputValue('profileTypeEtablissement');
        if (profileData.typeEtablissement === 'EtudesSup') {
            profileData.etablissement = '';
            profileData.etudesSup = getProfileInputValue('profileEtudesSup');
        } else {
            profileData.etablissement = getProfileInputValue('profileEtablissement');
            profileData.etudesSup = '';
        }
        profileData.rechercheEmploi = getProfileInputValue('profileRechercheEmploi');
        profileData.activitePayee = getProfileInputValue('profileActivitePayee');
        profileData.asso = getProfileInputValue('profileAsso');
        profileData.autreActivite = getProfileInputValue('profileAutreActivite');
        profileData.mobilite = getProfileMobiliteValues();
        profileData.permis = getProfilePermisValues();
        console.log('Profil enregistré:', profileData);
        alert('Modifications enregistrées.');
        setProfileEditMode(false);
    }

    document.getElementById('profileEditBtn')?.addEventListener('click', function () { setProfileEditMode(true); });
    document.getElementById('profileCancelBtn')?.addEventListener('click', function () {
        fillProfileFormFromData();
        setProfileEditMode(false);
    });
    document.getElementById('profileValidateBtn')?.addEventListener('click', function () { saveProfile(); });

    document.getElementById('profileProvince')?.addEventListener('change', function() {
        profileData.province = this.value;
        loadProfileCommunes(this.value);
        document.getElementById('profileCommune').value = '';
        document.getElementById('profileQuartier').value = '';
        document.getElementById('profileQuartierInput').value = '';
        document.getElementById('profileDistrict').value = '';
        document.getElementById('profileDistrictInput').value = '';
    });
    document.getElementById('profileCommune')?.addEventListener('change', function() {
        const prov = document.getElementById('profileProvince')?.value;
        loadProfileQuartiers(prov, this.value);
    });
    document.getElementById('profileTypeEtablissement')?.addEventListener('change', function() {
        loadProfileEtablissements(this.value);
    });

    if (profileIcon) profileIcon.addEventListener('click', function(e) { e.stopPropagation(); showProfile(); });
    if (closeProfileButton) closeProfileButton.addEventListener('click', closeProfile);
    if (profileOverlay) profileOverlay.addEventListener('click', function(e) { if (e.target === profileOverlay) closeProfile(); });
    
    // Gestion du widget de messagerie
    const messageOverlay = document.getElementById('messageOverlay');
    const closeMessageButton = document.getElementById('closeMessage');
    const messageIcon = document.getElementById('messageIcon');
    const sendMessageButton = document.getElementById('sendMessage');
    const messageTextarea = document.getElementById('messageText');
    const messageProfilesGrid = document.getElementById('messageProfilesGrid');
    const messageComposeSection = document.getElementById('messageComposeSection');
    const messageSelectedProfile = document.getElementById('messageSelectedProfile');
    
    // Données factices de l'équipe (seront remplacées par des données de la base)
    const teamMembers = [
        { id: 1, name: 'Nom Prénom', firstName: 'Prénom', nickname: 'Surnom', role: 'Rôle' },
        { id: 2, name: 'Nom Prénom', firstName: 'Prénom', nickname: 'Surnom', role: 'Rôle' },
        { id: 3, name: 'Nom Prénom', firstName: 'Prénom', nickname: 'Surnom', role: 'Rôle' },
        { id: 4, name: 'Nom Prénom', firstName: 'Prénom', nickname: 'Surnom', role: 'Rôle' },
        { id: 5, name: 'Nom Prénom', firstName: 'Prénom', nickname: 'Surnom', role: 'Rôle' },
        { id: 6, name: 'Nom Prénom', firstName: 'Prénom', nickname: 'Surnom', role: 'Rôle' },
        { id: 7, name: 'Nom Prénom', firstName: 'Prénom', nickname: 'Surnom', role: 'Rôle' },
        { id: 8, name: 'Nom Prénom', firstName: 'Prénom', nickname: 'Surnom', role: 'Rôle' },
        { id: 9, name: 'Nom Prénom', firstName: 'Prénom', nickname: 'Surnom', role: 'Rôle' },
        { id: 10, name: 'Nom Prénom', firstName: 'Prénom', nickname: 'Surnom', role: 'Rôle' },
        { id: 11, name: 'Nom Prénom', firstName: 'Prénom', nickname: 'Surnom', role: 'Rôle' }
    ];
    
    let selectedRecipient = null;
    
    // Générer la grille de profils
    function renderProfilesGrid() {
        if (!messageProfilesGrid) return;
        
        messageProfilesGrid.innerHTML = '';
        
        teamMembers.forEach(member => {
            const card = document.createElement('div');
            card.className = 'message-profile-card';
            card.dataset.memberId = member.id;
            
            const photo = document.createElement('div');
            photo.className = 'message-profile-photo';
            const photoText = document.createElement('span');
            photoText.className = 'message-profile-photo-text';
            photoText.textContent = 'Photo';
            photo.appendChild(photoText);
            
            const name = document.createElement('div');
            name.className = 'message-profile-name';
            name.textContent = member.name;
            
            const role = document.createElement('div');
            role.className = 'message-profile-role';
            role.textContent = member.role;
            
            card.appendChild(photo);
            card.appendChild(name);
            card.appendChild(role);
            
            card.addEventListener('click', function() {
                selectRecipient(member);
            });
            
            messageProfilesGrid.appendChild(card);
        });
    }
    
    // Sélectionner un destinataire
    function selectRecipient(member) {
        selectedRecipient = member;
        
        // Mettre à jour l'affichage des cartes
        const cards = document.querySelectorAll('.message-profile-card');
        cards.forEach(card => {
            if (card.dataset.memberId == member.id) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
        
        // Afficher la section de composition
        if (messageComposeSection) {
            messageComposeSection.style.display = 'flex';
        }
        
        // Remplir les informations du profil sélectionné
        const profileName = document.getElementById('messageProfileName');
        const profileFirstName = document.getElementById('messageProfileFirstName');
        const profileNickname = document.getElementById('messageProfileNickname');
        const profileRole = document.getElementById('messageProfileRole');
        
        if (profileName) profileName.textContent = member.name || 'Nom';
        if (profileFirstName) profileFirstName.textContent = member.firstName || 'Prénom';
        if (profileNickname) profileNickname.textContent = member.nickname || 'Surnom';
        if (profileRole) profileRole.textContent = member.role || 'Rôle';
        
        // Scroll vers la section de composition
        if (messageComposeSection) {
            setTimeout(() => {
                messageComposeSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    }
    
    function showMessage() {
        if (!messageOverlay) return;
        messageOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderProfilesGrid();
        // Réinitialiser la sélection
        selectedRecipient = null;
        if (messageComposeSection) {
            messageComposeSection.style.display = 'none';
        }
    }
    
    function closeMessage() {
        if (!messageOverlay) return;
        messageOverlay.classList.remove('active');
        document.body.style.overflow = '';
        // Réinitialiser le formulaire
        selectedRecipient = null;
        if (messageTextarea) messageTextarea.value = '';
        if (messageComposeSection) {
            messageComposeSection.style.display = 'none';
        }
        // Réinitialiser les cartes sélectionnées
        const cards = document.querySelectorAll('.message-profile-card');
        cards.forEach(card => {
            card.classList.remove('selected');
        });
    }
    
    function sendMessage() {
        if (!selectedRecipient) {
            alert('Veuillez sélectionner un destinataire');
            return;
        }
        
        const message = messageTextarea ? messageTextarea.value.trim() : '';
        
        if (!message) {
            alert('Veuillez écrire un message');
            return;
        }
        
        // Ici, vous pouvez ajouter l'appel API pour envoyer le message
        console.log('Envoi du message:', {
            recipient: selectedRecipient,
            message: message
        });
        
        // Pour l'instant, on affiche une confirmation
        alert(`Message envoyé à ${selectedRecipient.name} avec succès !`);
        
        // Fermer le widget après l'envoi
        closeMessage();
    }
    
    // Ouvrir le widget au clic sur l'icône de messagerie
    if (messageIcon) {
        messageIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            showMessage();
        });
    }
    
    // Fermer le widget
    if (closeMessageButton) {
        closeMessageButton.addEventListener('click', closeMessage);
    }
    
    // Fermer en cliquant sur l'overlay
    if (messageOverlay) {
        messageOverlay.addEventListener('click', function(e) {
            if (e.target === messageOverlay) {
                closeMessage();
            }
        });
    }
    
    // Envoyer le message
    if (sendMessageButton) {
        sendMessageButton.addEventListener('click', function(e) {
            e.stopPropagation();
            sendMessage();
        });
    }
    
    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (messageOverlay && messageOverlay.classList.contains('active')) {
                closeMessage();
            }
        }
    });
});
