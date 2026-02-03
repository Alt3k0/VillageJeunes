// Gestion du calendrier et des interactions

const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

let currentDate = new Date(2026, 1, 1); // Février 2026 par défaut
let selectedDate = new Date(2026, 1, 25); // Date sélectionnée par défaut (25 février)

// Catégories d'activités avec leurs couleurs
const activityCategories = {
    'sortie': {
        name: 'Sortie',
        color: '#649d50' // Vert
    },
    'aide': {
        name: 'Aide/Assistance',
        color: '#1f658e' // Bleu
    },
    'formation': {
        name: 'Formation/Atelier',
        color: '#f08d35' // Orange
    }
};

// Génération de 4-5 activités avec plusieurs dates et horaires
function generateYearActivities(year) {
    const activities = {};
    
    // Définir 5 activités avec leurs dates et horaires multiples
    const predefinedActivities = [
        {
            title: 'Sortie Nature',
            category: 'sortie',
            categoryName: 'Sortie',
            categoryColor: '#649d50',
            location: 'Parc municipal',
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
            category: 'aide',
            categoryName: 'Aide/Assistance',
            categoryColor: '#1f658e',
            location: 'Salle d\'étude',
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
            category: 'formation',
            categoryName: 'Formation/Atelier',
            categoryColor: '#f08d35',
            location: 'Salle principale',
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
            category: 'formation',
            categoryName: 'Formation/Atelier',
            categoryColor: '#f08d35',
            location: 'Salle informatique',
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
            category: 'sortie',
            categoryName: 'Sortie',
            categoryColor: '#649d50',
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
            activities[dateKey] = {
                title: activity.title,
                time: dateInfo.time,
                location: activity.location,
                description: activity.description,
                category: activity.category,
                categoryName: activity.categoryName,
                categoryColor: activity.categoryColor
            };
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
    // Générer les activités pour toute l'année
    const year = currentDate.getFullYear();
    activitiesData = generateYearActivities(year);
    
    renderCalendar();
    setupEventListeners();
});

// Rendu du calendrier
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Mise à jour des textes mois/année
    document.getElementById('monthText').textContent = months[month];
    document.getElementById('yearText').textContent = year;
    
    // Calcul du premier jour du mois et nombre de jours
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Dimanche
    
    const calendarDates = document.getElementById('calendarDates');
    calendarDates.innerHTML = '';
    
    // Créer les semaines
    let currentDay = 1;
    let currentWeek = 0;
    
    // Première semaine
    const firstWeek = document.createElement('div');
    firstWeek.className = 'calendar-week';
    
    // Jours du mois précédent
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const dateCell = createDateCell(prevMonthLastDay - i, true, year, month - 1);
        firstWeek.appendChild(dateCell);
    }
    
    // Jours du mois actuel
    const remainingDaysFirstWeek = 7 - startingDayOfWeek;
    for (let i = 0; i < remainingDaysFirstWeek && currentDay <= daysInMonth; i++) {
        const dateCell = createDateCell(currentDay, false, year, month);
        firstWeek.appendChild(dateCell);
        currentDay++;
    }
    
    calendarDates.appendChild(firstWeek);
    
    // Semaines suivantes
    while (currentDay <= daysInMonth) {
        const week = document.createElement('div');
        week.className = 'calendar-week';
        
        for (let i = 0; i < 7 && currentDay <= daysInMonth; i++) {
            const dateCell = createDateCell(currentDay, false, year, month);
            week.appendChild(dateCell);
            currentDay++;
        }
        
        // Jours du mois suivant pour compléter la semaine
        if (currentDay > daysInMonth) {
            let nextMonthDay = 1;
            while (week.children.length < 7) {
                const dateCell = createDateCell(nextMonthDay, true, year, month + 1);
                week.appendChild(dateCell);
                nextMonthDay++;
            }
        }
        
        calendarDates.appendChild(week);
    }
}

// Créer une cellule de date
function createDateCell(day, isOtherMonth, year, month) {
    const dateCell = document.createElement('button');
    dateCell.className = 'calendar-date';
    
    // Créer le contenu avec le numéro et potentiellement un indicateur d'activité
    const dateContent = document.createElement('div');
    dateContent.style.cssText = 'display: flex; flex-direction: column; align-items: center; gap: 2px; width: 100%;';
    
    const dateNumber = document.createElement('span');
    dateNumber.className = 'calendar-date-text';
    dateNumber.textContent = day;
    dateContent.appendChild(dateNumber);
    
    // Vérifier s'il y a une activité pour cette date
    if (!isOtherMonth) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const activity = activitiesData[dateKey];
        
        if (activity) {
            const activityDot = document.createElement('div');
            activityDot.className = 'activity-dot';
            activityDot.style.cssText = `width: 6px; height: 6px; border-radius: 50%; background-color: ${activity.categoryColor}; flex-shrink: 0;`;
            dateContent.appendChild(activityDot);
        }
    }
    
    dateCell.appendChild(dateContent);
    
    if (isOtherMonth) {
        dateCell.classList.add('other-month');
    }
    
    // Vérifier si c'est la date sélectionnée
    const cellDate = new Date(year, month, day);
    if (!isOtherMonth && 
        cellDate.getDate() === selectedDate.getDate() &&
        cellDate.getMonth() === selectedDate.getMonth() &&
        cellDate.getFullYear() === selectedDate.getFullYear()) {
        dateCell.classList.add('selected');
    }
    
    // Ajouter l'événement de clic
    dateCell.addEventListener('click', function() {
        selectDate(cellDate);
    });
    
    return dateCell;
}

// Sélectionner une date
function selectDate(date) {
    selectedDate = new Date(date);
    
    // Si la date sélectionnée est dans un autre mois, changer de mois
    if (date.getMonth() !== currentDate.getMonth() || date.getFullYear() !== currentDate.getFullYear()) {
        currentDate = new Date(date);
        renderCalendar();
    } else {
        // Mettre à jour visuellement la sélection
        document.querySelectorAll('.calendar-date').forEach(cell => {
            cell.classList.remove('selected');
        });
        
        // Trouver et sélectionner la bonne cellule
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        
        document.querySelectorAll('.calendar-date').forEach(cell => {
            if (!cell.classList.contains('other-month')) {
                const dateText = cell.querySelector('.calendar-date-text');
                if (dateText && parseInt(dateText.textContent) === day) {
                    // Vérifier que c'est le bon mois en vérifiant la position dans la grille
                    const cellIndex = Array.from(cell.parentElement.children).indexOf(cell);
                    const firstDay = new Date(year, month, 1).getDay();
                    const weekIndex = Array.from(cell.parentElement.parentElement.children).indexOf(cell.parentElement);
                    
                    if (weekIndex === 0 && cellIndex >= firstDay) {
                        cell.classList.add('selected');
                    } else if (weekIndex > 0) {
                        cell.classList.add('selected');
                    }
                }
            }
        });
    }
    
    // Afficher la pop-up d'activité si disponible
    showActivityPopup(date);
}

// Afficher le widget d'emploi du temps
function showActivityPopup(date) {
    const dateKey = formatDateKey(date);
    const activities = getActivitiesForDate(date);
    
    const widget = document.getElementById('scheduleWidget');
    const dateText = document.getElementById('scheduleDateText');
    const timeline = document.getElementById('scheduleTimeline');
    
    // Mettre à jour la date affichée
    dateText.textContent = formatDateShort(date);
    
    // Nettoyer les activités existantes (sauf les marqueurs d'heure et l'indicateur de temps)
    const existingActivities = timeline.querySelectorAll('.schedule-activity');
    existingActivities.forEach(activity => activity.remove());
    
    // Ajouter les activités au timeline
    activities.forEach(activity => {
        const activityBlock = createActivityBlock(activity);
        if (activityBlock) { // Vérifier que le bloc a été créé (pas null)
            timeline.appendChild(activityBlock);
        }
    });
    
    // Mettre à jour l'heure actuelle
    updateCurrentTimeIndicator();
    
    widget.classList.add('active');
}

// Obtenir toutes les activités pour une date donnée
function getActivitiesForDate(date) {
    const dateKey = formatDateKey(date);
    const activity = activitiesData[dateKey];
    
    if (!activity) {
        return [];
    }
    
    // Retourner l'activité avec toutes les propriétés nécessaires
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

// Créer un bloc d'activité pour le timeline
function createActivityBlock(activity) {
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
                text.textContent = `${activity.title} : ${formatDuration(durationHours)}`;
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
                text.textContent = `${activity.title} : ${formatDuration(durationHours)}`;
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
    
    // Ajouter l'événement de clic pour afficher le widget de détail d'activité
    block.addEventListener('click', function(e) {
        e.stopPropagation();
        const activity = {
            title: block.dataset.activityTitle,
            time: block.dataset.activityTime,
            location: block.dataset.activityLocation,
            description: block.dataset.activityDescription,
            category: block.dataset.activityCategory,
            color: block.dataset.activityColor
        };
        
        // Obtenir toutes les activités de la date pour la navigation
        const activities = getActivitiesForDate(selectedDate);
        showActivityDetail(activity, 'schedule', activities);
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

// Formater la date courte
function formatDateShort(date) {
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

// Mettre à jour l'indicateur de l'heure actuelle
function updateCurrentTimeIndicator() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Positionner l'indicateur (chaque heure = 20px avec padding de 10px)
    const paddingTop = 10;
    const pixelsPerHour = 20;
    const topPosition = paddingTop + (currentHour - 6) * pixelsPerHour + (currentMinute / 60) * pixelsPerHour;
    
    const indicator = document.getElementById('currentTimeIndicator');
    const timeText = document.getElementById('currentTimeText');
    
    if (currentHour >= 6 && currentHour <= 20) {
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

// Configuration des événements
function setupEventListeners() {
    // Navigation mois précédent/suivant
    document.getElementById('prevMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    // Dropdown mois
    document.getElementById('monthDropdown').addEventListener('click', function() {
        // Pour l'instant, on peut juste changer le mois avec les flèches
        // Plus tard, on pourra ajouter un vrai dropdown
    });
    
    // Dropdown année
    document.getElementById('yearDropdown').addEventListener('click', function() {
        // Pour l'instant, on peut juste changer l'année avec les flèches
        // Plus tard, on pourra ajouter un vrai dropdown
    });
    
    // Fermer le widget
    document.getElementById('closeScheduleWidget').addEventListener('click', closeActivityPopup);
    document.getElementById('scheduleWidget').addEventListener('click', function(e) {
        if (e.target === this) {
            closeActivityPopup();
        }
    });
    
    // Navigation jour précédent/suivant
    document.getElementById('prevDay').addEventListener('click', function() {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        selectDate(newDate);
    });
    
    document.getElementById('nextDay').addEventListener('click', function() {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        selectDate(newDate);
    });
    
    // Menu déroulant de recherche
    const activitySelect = document.getElementById('activitySelect');
    const activitiesListGroup = document.getElementById('activitiesList');
    
    // Remplir la liste des activités dans le menu déroulant
    function populateActivitySelect() {
        if (!activitiesListGroup || !allActivitiesList) return;
        
        // Vider la liste existante (sauf les catégories)
        activitiesListGroup.innerHTML = '';
        
        // Ajouter toutes les activités disponibles
        allActivitiesList.forEach(activity => {
            const option = document.createElement('option');
            option.value = `activity:${activity.title}`;
            option.textContent = activity.title;
            activitiesListGroup.appendChild(option);
        });
    }
    
    // Remplir la liste au chargement
    populateActivitySelect();
    
    // Obtenir toutes les activités d'une catégorie
    function getAllActivitiesByCategory(category) {
        if (!allActivitiesList) return [];
        
        const categoryActivities = [];
        allActivitiesList.forEach(activity => {
            if (activity.category === category) {
                // Ajouter toutes les dates de cette activité
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
                        dateKey: dateInfo.dateKey
                    });
                });
            }
        });
        
        return categoryActivities;
    }
    
    // Gérer la sélection dans le menu déroulant
    if (activitySelect) {
        activitySelect.addEventListener('change', function(e) {
            const value = e.target.value;
            const cardsContainer = document.getElementById('activityCardsContainer');
            
            // Cacher les cards si aucune sélection
            if (!value) {
                if (cardsContainer) {
                    cardsContainer.classList.remove('active');
                    cardsContainer.innerHTML = '';
                }
                return;
            }
            
            if (value.startsWith('category:')) {
                // Catégorie sélectionnée - afficher toutes les activités de la catégorie
                const category = value.split(':')[1];
                const categoryActivities = getAllActivitiesByCategory(category);
                
                if (categoryActivities.length > 0 && cardsContainer) {
                    displayActivityCards(categoryActivities);
                }
            } else if (value.startsWith('activity:')) {
                // Activité spécifique sélectionnée - afficher toutes les dates de cette activité
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
    
    // Afficher la date et l'heure
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

// Fermer le widget de détail d'activité
function closeActivityDetail() {
    const overlay = document.getElementById('activityDetailOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
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
    const registerButton = document.getElementById('registerActivityButton');
    
    if (closeButton) {
        closeButton.addEventListener('click', closeActivityDetail);
    }
    
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeActivityDetail();
            }
        });
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', function(e) {
            e.stopPropagation();
            navigateToPreviousActivity();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function(e) {
            e.stopPropagation();
            navigateToNextActivity();
        });
    }
    
    if (registerButton) {
        registerButton.addEventListener('click', function() {
            // Action d'inscription (à implémenter)
            console.log('Inscription à l\'activité');
            alert('Inscription à l\'activité (fonctionnalité à implémenter)');
        });
    }
    
    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeActivityDetail();
            closeProfile();
        }
    });

    // Gestion du widget de profil
    const profileOverlay = document.getElementById('profileOverlay');
    const closeProfileButton = document.getElementById('closeProfile');
    const profileIcon = document.getElementById('profileIcon');
    
    // Données factices du profil (seront remplacées par des données de la base)
    const profileData = {
        name: 'Martin',
        firstName: 'Jean',
        nickname: 'Jéjé',
        memberNumber: 'VJ-2026-001',
        email: 'jean.martin@email.com',
        medicalInfo: ''
    };

    function updateMedicalTextarea() {
        const medicalTextarea = document.getElementById('profileMedicalInfo');
        const validateBtn = document.getElementById('validateMedicalInfo');
        if (!medicalTextarea) return;
        
        if (profileData.medicalInfo && profileData.medicalInfo.trim() !== '') {
            medicalTextarea.value = profileData.medicalInfo;
            medicalTextarea.classList.remove('empty');
            medicalTextarea.style.color = '#0a0a0a';
            medicalTextarea.style.fontStyle = 'normal';
            if (validateBtn) validateBtn.style.display = 'block';
        } else {
            medicalTextarea.value = '';
            medicalTextarea.classList.remove('empty');
            medicalTextarea.style.color = '#0a0a0a';
            medicalTextarea.style.fontStyle = 'normal';
            medicalTextarea.setAttribute('placeholder', 'Avez-vous un problème de santé ?');
            if (validateBtn) validateBtn.style.display = 'none';
        }
        
        // Ajuster la hauteur automatiquement
        medicalTextarea.style.height = 'auto';
        medicalTextarea.style.height = Math.max(100, medicalTextarea.scrollHeight) + 'px';
    }

    function toggleValidateButton() {
        const medicalTextarea = document.getElementById('profileMedicalInfo');
        const validateBtn = document.getElementById('validateMedicalInfo');
        if (!medicalTextarea || !validateBtn) return;
        
        const hasText = medicalTextarea.value.trim() !== '';
        validateBtn.style.display = hasText ? 'block' : 'none';
        
        // Ajuster la hauteur automatiquement
        autoResizeTextarea(medicalTextarea);
    }

    function validateMedicalInfo() {
        const medicalTextarea = document.getElementById('profileMedicalInfo');
        if (!medicalTextarea) return;
        
        const medicalInfo = medicalTextarea.value.trim();
        profileData.medicalInfo = medicalInfo;
        
        // Ici vous pouvez ajouter l'appel à l'API pour sauvegarder les données
        // Par exemple : saveMedicalInfoToDatabase(medicalInfo);
        
        // Mettre à jour l'affichage
        updateMedicalTextarea();
        
        // Masquer le bouton après validation
        const validateBtn = document.getElementById('validateMedicalInfo');
        if (validateBtn) validateBtn.style.display = 'none';
        
        // Optionnel : afficher un message de confirmation
        console.log('Informations médicales enregistrées:', medicalInfo);
    }
    
    // Ajuster la hauteur du textarea lors du chargement et si le contenu change
    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.max(100, textarea.scrollHeight) + 'px';
    }

    function showProfile() {
        if (!profileOverlay) return;
        
        // Mettre à jour les informations du profil
        document.getElementById('profileName').textContent = profileData.name;
        document.getElementById('profileFirstName').textContent = profileData.firstName;
        document.getElementById('profileNickname').textContent = profileData.nickname || '';
        document.getElementById('profileMemberNumber').textContent = profileData.memberNumber || '';
        document.getElementById('profileEmail').textContent = profileData.email;
        
        // Gérer les informations médicales
        updateMedicalTextarea();
        
        profileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Ajuster la taille du textarea après l'affichage
        setTimeout(() => {
            const medicalTextarea = document.getElementById('profileMedicalInfo');
            if (medicalTextarea) {
                autoResizeTextarea(medicalTextarea);
            }
        }, 100);
    }

    function closeProfile() {
        if (!profileOverlay) return;
        profileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Ouvrir le profil au clic sur l'icône
    if (profileIcon) {
        profileIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            showProfile();
        });
    }

    // Fermer le profil
    if (closeProfileButton) {
        closeProfileButton.addEventListener('click', closeProfile);
    }

    // Fermer en cliquant sur l'overlay
    if (profileOverlay) {
        profileOverlay.addEventListener('click', function(e) {
            if (e.target === profileOverlay) {
                closeProfile();
            }
        });
    }
    
    // Gérer le champ médical éditable
    const medicalTextarea = document.getElementById('profileMedicalInfo');
    const validateBtn = document.getElementById('validateMedicalInfo');
    
    if (medicalTextarea) {
        // Ajuster au chargement
        setTimeout(() => {
            autoResizeTextarea(medicalTextarea);
            toggleValidateButton();
        }, 100);
        
        // Ajuster si le contenu change et afficher/masquer le bouton
        medicalTextarea.addEventListener('input', function() {
            autoResizeTextarea(this);
            toggleValidateButton();
        });
    }
    
    // Gérer le clic sur le bouton Valider
    if (validateBtn) {
        validateBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            validateMedicalInfo();
        });
    }
});
