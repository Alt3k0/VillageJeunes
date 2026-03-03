// Accueil Partenaire : Salles occupées + Faire une demande (Réserver une salle - mise à disposition des espaces)

const weekdays = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

let currentDateSalles = new Date(2026, 1, 25);
let selectedDate = new Date(2026, 1, 25);

const salles = ['Salle du Vent', 'Salle du Feu', "Salle de l'Eau", 'Salle de la Terre + patio', 'Salle de formation', 'Accueil'];
const salleToColor = {
    "Salle de l'Eau": '#1f658e',
    'Salle de la Terre + patio': '#649d50',
    'Salle du Feu': '#f08d35',
    'Salle du Vent': '#9b59b6',
    'Salle de formation': '#6e6f75',
    'Accueil': '#e6b800'
};

const activityCategories = {
    'numerique': { name: 'Numérique', color: '#1f658e' },
    'arts-vivants': { name: 'Arts vivants', color: '#f08d35' },
    'projet-pro': { name: 'Projet pro', color: '#9b59b6' },
    'solidarite': { name: 'Solidarité', color: '#649d50' }
};

let activitiesData = {};

function generateYearActivities(year) {
    const activities = {};
    const predefinedActivities = [
        { title: 'Sortie Nature', category: 'solidarite', categoryName: 'Solidarité', categoryColor: '#649d50', location: 'Salle de la Terre + patio', description: 'Balade découverte.', dates: [{ month: 1, day: 5, time: '10h00 - 12h00' }, { month: 2, day: 15, time: '14h00 - 16h00' }] },
        { title: 'Aide aux Devoirs', category: 'solidarite', categoryName: 'Solidarité', categoryColor: '#649d50', location: 'Salle du Feu', description: 'Soutien scolaire.', dates: [{ month: 1, day: 3, time: '16h00 - 18h00' }, { month: 2, day: 14, time: '16h00 - 18h00' }] },
        { title: 'Atelier Créatif', category: 'arts-vivants', categoryName: 'Arts vivants', categoryColor: '#f08d35', location: "Salle de l'Eau", description: 'Techniques créatives.', dates: [{ month: 1, day: 8, time: '14h00 - 16h00' }, { month: 2, day: 12, time: '14h00 - 16h00' }] },
        { title: 'Formation Numérique', category: 'numerique', categoryName: 'Numérique', categoryColor: '#1f658e', location: 'Salle du Vent', description: 'Initiation numérique.', dates: [{ month: 1, day: 6, time: '10h00 - 12h00' }, { month: 2, day: 13, time: '10h00 - 12h00' }] },
        { title: 'Visite Culturelle', category: 'arts-vivants', categoryName: 'Arts vivants', categoryColor: '#f08d35', location: 'Accueil', description: 'Patrimoine local.', dates: [{ month: 1, day: 11, time: '14h00 - 17h00' }, { month: 2, day: 22, time: '14h00 - 17h00' }] }
    ];
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
                categoryColor: activity.categoryColor
            };
            if (activities[dateKey]) {
                activities[dateKey] = Array.isArray(activities[dateKey]) ? [...activities[dateKey], act] : [activities[dateKey], act];
            } else {
                activities[dateKey] = act;
            }
        });
    });
    return activities;
}

function formatDateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function formatDateShort(date) {
    return date.getDate() + ' ' + monthsFull[date.getMonth()] + ' ' + date.getFullYear();
}

function getActivitiesForDate(date) {
    const dateKey = formatDateKey(date);
    const activity = activitiesData[dateKey];
    if (!activity) return [];
    return Array.isArray(activity) ? activity : [activity];
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

function formatDuration(hours) {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 0) return wholeHours + 'h';
    if (wholeHours === 0) return minutes + 'min';
    return wholeHours + 'h' + String(minutes).padStart(2, '0');
}

function updateCalendarSalles() {
    const grid = document.getElementById('calendarGridSalles');
    if (!grid) return;
    grid.innerHTML = '';
    const year = currentDateSalles.getFullYear();
    const month = currentDateSalles.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const prevDay = daysInPrevMonth - i;
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day other-month';
        dayEl.textContent = prevDay;
        dayEl.style.cursor = 'pointer';
        const d = new Date(year, month - 1, prevDay);
        dayEl.addEventListener('click', function() { currentDateSalles.setFullYear(year); currentDateSalles.setMonth(month - 1); updateCalendarSalles(); updateSelectorsSalles(); selectDateSalles(d); });
        grid.appendChild(dayEl);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = day;
        dayEl.style.cursor = 'pointer';
        const d = new Date(year, month, day);
        const dateKey = formatDateKey(d);
        const act = activitiesData[dateKey];
        if (act) {
            const acts = Array.isArray(act) ? act : [act];
            const cats = [...new Set(acts.map(a => a.category))];
            if (cats.length >= 2) dayEl.classList.add('multiple-activities');
            else if (cats.length === 1) dayEl.classList.add('activity-' + cats[0]);
        }
        if (selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year) {
            dayEl.classList.add('selected');
        }
        dayEl.addEventListener('click', function() { selectDateSalles(d); });
        grid.appendChild(dayEl);
    }
    const total = grid.children.length;
    for (let day = 1; day <= 42 - total; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day other-month';
        dayEl.textContent = day;
        dayEl.style.cursor = 'pointer';
        const d = new Date(year, month + 1, day);
        dayEl.addEventListener('click', function() { currentDateSalles.setFullYear(year); currentDateSalles.setMonth(month + 1); updateCalendarSalles(); updateSelectorsSalles(); selectDateSalles(d); });
        grid.appendChild(dayEl);
    }
}

function updateSelectorsSalles() {
    const ms = document.getElementById('monthSelectSalles');
    const ys = document.getElementById('yearSelectSalles');
    if (ms) ms.value = currentDateSalles.getMonth();
    if (ys) ys.value = currentDateSalles.getFullYear();
}

function selectDateSalles(date) {
    if (!date || isNaN(date.getTime())) return;
    selectedDate = new Date(date);
    updateCalendarSalles();
    showScheduleForDate(date);
}

function showScheduleForDate(date) {
    const widget = document.getElementById('scheduleWidget');
    const dateText = document.getElementById('scheduleDateText');
    const timeline = document.getElementById('scheduleTimeline');
    if (!widget || !dateText || !timeline) return;
    dateText.textContent = formatDateShort(date);
    // Ne retirer que les blocs d'activités (garder les barres horaires .schedule-time-marker)
    timeline.querySelectorAll('.schedule-activity').forEach(function (el) { el.remove(); });
    const activities = getActivitiesForDate(date);
    if (activities.length === 0) {
        const noMsg = document.createElement('div');
        noMsg.className = 'schedule-activity no-activity-message';
        noMsg.style.cssText = 'position:relative;top:50%;left:50%;transform:translate(-50%,-50%);color:#6e6f75;';
        noMsg.textContent = 'Aucune salle occupée cette date';
        timeline.appendChild(noMsg);
    } else {
        activities.forEach(act => {
            const timeParts = (act.time || '').split(' - ');
            if (timeParts.length === 2) {
                const startMatch = timeParts[0].match(/(\d+)h(\d+)?/);
                const endMatch = timeParts[1].match(/(\d+)h(\d+)?/);
                if (startMatch && endMatch) {
                    const startHour = parseInt(startMatch[1]);
                    const startMin = startMatch[2] ? parseInt(startMatch[2]) : 0;
                    const endHour = parseInt(endMatch[1]);
                    const endMin = endMatch[2] ? parseInt(endMatch[2]) : 0;
                    const durationHours = (endHour * 60 + endMin - startHour * 60 - startMin) / 60;
                    const block = document.createElement('div');
                    block.className = 'schedule-activity';
                    const pixelsPerHour = 20;
                    const paddingTop = 10;
                    const height = durationHours * pixelsPerHour;
                    block.style.top = (paddingTop + (startHour - 6) * pixelsPerHour + (startMin / 60) * pixelsPerHour) + 'px';
                    block.style.height = height + 'px';
                    const rgb = hexToRgb(act.categoryColor || '#649d50');
                    if (rgb) block.style.backgroundColor = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.5)';
                    const text = document.createElement('span');
                    text.className = 'schedule-activity-text';
                    // Hauteur insuffisante (ex. ≤ 40px) : n'afficher que le nom, pas la durée ni la salle
                    text.textContent = height >= 40 ? (act.title + ' – ' + (act.location || '') + ' : ' + formatDuration(durationHours)) : act.title;
                    block.appendChild(text);
                    timeline.appendChild(block);
                }
            }
        });
    }
    widget.classList.add('active');
}

function closeScheduleWidget() {
    const w = document.getElementById('scheduleWidget');
    if (w) w.classList.remove('active');
}

// --- Widget Réserver une salle (signature + formulaire) ---
let reserverSalleCanvas = null;
let reserverSalleCtx = null;
let reserverSalleDrawing = false;
let reserverSalleLastX = 0, reserverSalleLastY = 0;

function setupReserverSalleSignature() {
    reserverSalleCanvas = document.getElementById('reserverSalleSignatureCanvas');
    const placeholder = document.getElementById('reserverSalleSignaturePlaceholder');
    const clearBtn = document.getElementById('reserverSalleSignatureClear');
    if (!reserverSalleCanvas) return;
    reserverSalleCtx = reserverSalleCanvas.getContext('2d');

    function resize() {
        const rect = reserverSalleCanvas.getBoundingClientRect();
        reserverSalleCanvas.width = rect.width;
        reserverSalleCanvas.height = rect.height;
        reserverSalleCtx.strokeStyle = '#1e1e1d';
        reserverSalleCtx.lineWidth = 2.5;
        reserverSalleCtx.lineCap = 'round';
        reserverSalleCtx.lineJoin = 'round';
    }
    resize();
    window.addEventListener('resize', resize);

    function getCoords(e) {
        const rect = reserverSalleCanvas.getBoundingClientRect();
        if (e.touches && e.touches.length) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function start(e) { e.preventDefault(); reserverSalleDrawing = true; const c = getCoords(e); reserverSalleLastX = c.x; reserverSalleLastY = c.y; if (placeholder) placeholder.classList.add('hidden'); }
    function draw(e) {
        if (!reserverSalleDrawing || !reserverSalleCtx) return;
        e.preventDefault();
        const c = getCoords(e);
        reserverSalleCtx.beginPath();
        reserverSalleCtx.moveTo(reserverSalleLastX, reserverSalleLastY);
        reserverSalleCtx.lineTo(c.x, c.y);
        reserverSalleCtx.stroke();
        reserverSalleLastX = c.x; reserverSalleLastY = c.y;
    }
    function stop() { reserverSalleDrawing = false; }

    reserverSalleCanvas.addEventListener('mousedown', start);
    reserverSalleCanvas.addEventListener('mousemove', draw);
    reserverSalleCanvas.addEventListener('mouseup', stop);
    reserverSalleCanvas.addEventListener('mouseleave', stop);
    reserverSalleCanvas.addEventListener('touchstart', start, { passive: false });
    reserverSalleCanvas.addEventListener('touchmove', draw, { passive: false });
    reserverSalleCanvas.addEventListener('touchend', stop);
    if (clearBtn) clearBtn.addEventListener('click', clearReserverSalleSignature);
}

function clearReserverSalleSignature() {
    if (!reserverSalleCanvas || !reserverSalleCtx) return;
    reserverSalleCtx.clearRect(0, 0, reserverSalleCanvas.width, reserverSalleCanvas.height);
    const p = document.getElementById('reserverSalleSignaturePlaceholder');
    if (p) p.classList.remove('hidden');
}

function hasReserverSalleSignature() {
    if (!reserverSalleCanvas || !reserverSalleCtx) return false;
    const id = reserverSalleCtx.getImageData(0, 0, reserverSalleCanvas.width, reserverSalleCanvas.height);
    const d = id.data;
    for (let i = 3; i < d.length; i += 4) { if (d[i] !== 0) return true; }
    return false;
}

const demandesPartenaireBenevoles = [
    'Animateur 1', 'Animateur 2', 'Animateur 3', 'Animateur 4', 'Animateur 5',
    'Animateur 6', 'Animateur 7', 'Animateur 8', 'Animateur 9', 'Animateur 10'
];

function setupDemandesPartenaireWidget() {
    const openBtn = document.getElementById('demandesPartenaireButton');
    const overlay = document.getElementById('demandesPartenaireOverlay');
    const closeBtn = document.getElementById('closeDemandesPartenaire');
    const choiceStep = document.getElementById('demandesPartenaireChoiceStep');
    const formStep = document.getElementById('demandesPartenaireFormStep');
    const reserverSalleStep = document.getElementById('demandesPartenaireReserverSalleStep');
    const rdvForm = document.getElementById('demandesPartenaireForm');
    const reserverSalleForm = document.getElementById('reserverSalleForm');
    const contactSelect = document.getElementById('demandesPartenaireContact');
    const backBtn = document.getElementById('demandesPartenaireBack');
    const reserverSalleBackBtn = document.getElementById('demandesPartenaireReserverSalleBack');
    const formCancelBtn = document.getElementById('demandesPartenaireFormCancel');
    const reserverSalleCancelBtn = document.getElementById('reserverSalleCancel');

    if (contactSelect) {
        demandesPartenaireBenevoles.forEach(function(name) {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            contactSelect.appendChild(opt);
        });
    }

    function openOverlay() {
        if (!overlay) return;
        if (choiceStep) choiceStep.removeAttribute('hidden');
        if (formStep) formStep.setAttribute('hidden', '');
        if (reserverSalleStep) reserverSalleStep.setAttribute('hidden', '');
        overlay.classList.add('active');
        document.documentElement.classList.add('demandes-overlay-open');
        document.body.classList.add('demandes-overlay-open');
    }

    function closeOverlay() {
        if (!overlay) return;
        overlay.classList.remove('active');
        document.documentElement.classList.remove('demandes-overlay-open');
        document.body.classList.remove('demandes-overlay-open');
        if (choiceStep) choiceStep.removeAttribute('hidden');
        if (formStep) formStep.setAttribute('hidden', '');
        if (reserverSalleStep) reserverSalleStep.setAttribute('hidden', '');
        if (rdvForm) rdvForm.reset();
        if (reserverSalleForm) reserverSalleForm.reset();
        clearReserverSalleSignature();
    }

    function showChoice() {
        if (choiceStep) choiceStep.removeAttribute('hidden');
        if (formStep) formStep.setAttribute('hidden', '');
        if (reserverSalleStep) reserverSalleStep.setAttribute('hidden', '');
        if (rdvForm) rdvForm.reset();
        if (reserverSalleForm) reserverSalleForm.reset();
        clearReserverSalleSignature();
    }

    function showRdvForm() {
        if (choiceStep) choiceStep.setAttribute('hidden', '');
        if (formStep) formStep.removeAttribute('hidden');
        if (reserverSalleStep) reserverSalleStep.setAttribute('hidden', '');
    }

    function showReserverSalleForm() {
        if (choiceStep) choiceStep.setAttribute('hidden', '');
        if (formStep) formStep.setAttribute('hidden', '');
        if (reserverSalleStep) reserverSalleStep.removeAttribute('hidden');
        clearReserverSalleSignature();
        setTimeout(function() {
            if (reserverSalleCanvas && reserverSalleCtx) {
                const r = reserverSalleCanvas.getBoundingClientRect();
                reserverSalleCanvas.width = r.width;
                reserverSalleCanvas.height = r.height;
                reserverSalleCtx.strokeStyle = '#1e1e1d';
                reserverSalleCtx.lineWidth = 2.5;
            }
        }, 100);
    }

    if (openBtn && overlay) openBtn.addEventListener('click', openOverlay);
    if (closeBtn) closeBtn.addEventListener('click', closeOverlay);
    if (overlay) overlay.addEventListener('click', function(e) { if (e.target === overlay) closeOverlay(); });

    document.getElementById('demandesPartenaireOptionRdv')?.addEventListener('click', showRdvForm);
    document.getElementById('demandesPartenaireOptionSalle')?.addEventListener('click', showReserverSalleForm);
    if (backBtn) backBtn.addEventListener('click', showChoice);
    if (reserverSalleBackBtn) reserverSalleBackBtn.addEventListener('click', showChoice);
    if (formCancelBtn) formCancelBtn.addEventListener('click', closeOverlay);
    if (reserverSalleCancelBtn) reserverSalleCancelBtn.addEventListener('click', closeOverlay);

    if (rdvForm) {
        rdvForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const dateVal = (document.getElementById('demandesPartenaireDate')?.value || '').trim();
            const timeVal = (document.getElementById('demandesPartenaireTime')?.value || '').trim();
            const motif = (document.getElementById('demandesPartenaireMotif')?.value || '').trim();
            const contact = (contactSelect?.value || '').trim();
            if (!dateVal || !timeVal || !motif || !contact) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }
            const email = (typeof CONFIG !== 'undefined' && CONFIG.EMAIL_CONTACT) ? CONFIG.EMAIL_CONTACT : 'contact@vill-age-jeunes.fr';
            const subject = encodeURIComponent('[Partenaire] Demande de rendez-vous - ' + dateVal + ' ' + timeVal);
            const bodyLines = [
                'Bonjour,',
                '',
                'Demande : Demande de rendez-vous',
                'Date : ' + dateVal,
                'Heure : ' + timeVal,
                'Bénévole à contacter : ' + contact,
                '',
                'Motif détaillé :',
                motif
            ];
            window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + encodeURIComponent(bodyLines.join('\n'));
            closeOverlay();
            alert('Votre demande a bien été préparée. Ouvrez votre logiciel de messagerie pour l\'envoyer.');
        });
    }

    if (reserverSalleForm) {
        reserverSalleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const espaces = reserverSalleForm.querySelectorAll('input[name="espace"]:checked');
            if (espaces.length === 0) {
                alert('Veuillez sélectionner au moins un espace partagé.');
                return;
            }
            const attestation = document.getElementById('reserverSalleAttestationAccept');
            if (!attestation || !attestation.checked) {
                alert('Veuillez accepter l\'attestation sur l\'honneur.');
                return;
            }
            if (!hasReserverSalleSignature()) {
                alert('Veuillez signer le formulaire.');
                return;
            }
            const data = {
                espaces: Array.from(espaces).map(function(el) { return el.value; }),
                dateDuree: (reserverSalleForm.dateDuree && reserverSalleForm.dateDuree.value) || '',
                horaires: (reserverSalleForm.horaires && reserverSalleForm.horaires.value) || '',
                activite: (reserverSalleForm.activite && reserverSalleForm.activite.value) || '',
                effectif: (reserverSalleForm.effectif && reserverSalleForm.effectif.value) ? parseInt(reserverSalleForm.effectif.value, 10) : null,
                faitA: (reserverSalleForm.faitA && reserverSalleForm.faitA.value) || '',
                le: (reserverSalleForm.le && reserverSalleForm.le.value) || '',
                signature: reserverSalleCanvas ? reserverSalleCanvas.toDataURL('image/png') : null
            };
            console.log('Demande mise à disposition espaces:', data);
            alert('Votre demande de mise à disposition des espaces a été envoyée. L\'équipe vous recontactera.');
            closeOverlay();
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const year = currentDateSalles.getFullYear();
    activitiesData = generateYearActivities(year);

    updateCalendarSalles();
    updateSelectorsSalles();
    /* Ne pas ouvrir le widget au chargement : header/footer restent visibles ; le widget s'ouvre au clic sur une date */
    /* showScheduleForDate(selectedDate); */

    const prevMonthSalles = document.getElementById('prevMonthSalles');
    const nextMonthSalles = document.getElementById('nextMonthSalles');
    const monthSelectSalles = document.getElementById('monthSelectSalles');
    const yearSelectSalles = document.getElementById('yearSelectSalles');
    if (prevMonthSalles) prevMonthSalles.addEventListener('click', function() { currentDateSalles.setMonth(currentDateSalles.getMonth() - 1); updateCalendarSalles(); updateSelectorsSalles(); });
    if (nextMonthSalles) nextMonthSalles.addEventListener('click', function() { currentDateSalles.setMonth(currentDateSalles.getMonth() + 1); updateCalendarSalles(); updateSelectorsSalles(); });
    if (monthSelectSalles) monthSelectSalles.addEventListener('change', function(e) { currentDateSalles.setMonth(parseInt(e.target.value)); updateCalendarSalles(); });
    if (yearSelectSalles) yearSelectSalles.addEventListener('change', function(e) { currentDateSalles.setFullYear(parseInt(e.target.value)); updateCalendarSalles(); });

    const closeScheduleBtn = document.getElementById('closeScheduleWidget');
    const scheduleWidget = document.getElementById('scheduleWidget');
    if (closeScheduleBtn) closeScheduleBtn.addEventListener('click', closeScheduleWidget);
    if (scheduleWidget) scheduleWidget.addEventListener('click', function(e) { if (e.target === scheduleWidget) closeScheduleWidget(); });

    const prevDay = document.getElementById('prevDay');
    const nextDay = document.getElementById('nextDay');
    if (prevDay) prevDay.addEventListener('click', function() { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); selectDateSalles(d); });
    if (nextDay) nextDay.addEventListener('click', function() { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); selectDateSalles(d); });

    setupReserverSalleSignature();
    setupDemandesPartenaireWidget();
    setupProfilePartenaire();
});

function getPartenaireProfileData() {
    try {
        const saved = localStorage.getItem('partenaireProfile');
        if (saved) {
            const data = JSON.parse(saved);
            if (data && (data.nomStructure || data.responsable)) return data;
        }
    } catch (e) {}
    return {
        typeStructure: 'Association',
        nomStructure: 'Ma structure',
        numeroRidet: 12345,
        adresse: '1 rue Example',
        bp: 123,
        codePostal: 98800,
        commune: 'Nouméa',
        telephoneStructure: '00 00 00 00',
        emailStructure: 'structure@example.nc',
        responsable: {
            nom: 'Dupont',
            prenom: 'Marie',
            qualite: 'Présidente',
            telephone: '00 00 00 01',
            email: 'marie.dupont@example.nc'
        }
    };
}

function setupProfilePartenaire() {
    const profileOverlay = document.getElementById('profilePartenaireOverlay');
    const profileBackdrop = document.getElementById('profilePartenaireBackdrop');
    const profileIcon = document.getElementById('profileIcon');
    const closeBtn = document.getElementById('closeProfilePartenaire');

    function setVal(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value !== undefined && value !== null && value !== '' ? String(value) : '—';
    }

    function openProfile() {
        const data = getPartenaireProfileData();
        const resp = data.responsable || {};
        setVal('profilePartenaireDisplayName', data.nomStructure || '—');
        setVal('profilePartenaireStructureType', data.typeStructure || '—');
        setVal('profilePartenaireTypeStructure', data.typeStructure);
        setVal('profilePartenaireNomStructure', data.nomStructure);
        setVal('profilePartenaireNumeroRidet', data.numeroRidet);
        setVal('profilePartenaireAdresse', data.adresse);
        setVal('profilePartenaireBp', data.bp);
        setVal('profilePartenaireCodePostal', data.codePostal);
        setVal('profilePartenaireCommune', data.commune);
        setVal('profilePartenaireTelephoneStructure', data.telephoneStructure);
        setVal('profilePartenaireEmailStructure', data.emailStructure);
        setVal('profilePartenaireResponsableNom', resp.nom);
        setVal('profilePartenaireResponsablePrenom', resp.prenom);
        setVal('profilePartenaireResponsableQualite', resp.qualite);
        setVal('profilePartenaireResponsableTelephone', resp.telephone);
        setVal('profilePartenaireResponsableEmail', resp.email);
        if (profileBackdrop) {
            profileBackdrop.hidden = false;
            profileBackdrop.setAttribute('aria-hidden', 'false');
            profileBackdrop.classList.add('active');
        }
        if (profileOverlay) {
            profileOverlay.classList.add('active');
            document.body.classList.add('profile-overlay-open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeProfile() {
        if (profileOverlay) profileOverlay.classList.remove('active');
        if (profileBackdrop) {
            profileBackdrop.classList.remove('active');
            profileBackdrop.hidden = true;
            profileBackdrop.setAttribute('aria-hidden', 'true');
        }
        document.body.classList.remove('profile-overlay-open');
        document.body.style.overflow = '';
    }

    if (profileIcon) profileIcon.addEventListener('click', function(e) { e.stopPropagation(); openProfile(); });
    if (closeBtn) closeBtn.addEventListener('click', closeProfile);
    if (profileOverlay) profileOverlay.addEventListener('click', function(e) { if (e.target === profileOverlay) closeProfile(); });
}
