let currentStep = 1;
const totalSteps = 8;

// Dépendance : validation.js doit être chargé avant script.js (constantes et helpers de validation)

// Fonction pour remplir un sélecteur de jours
function fillDays(selectElement) {
    if (selectElement) {
        for (let i = 1; i <= 31; i++) {
            const option = document.createElement('option');
            option.value = i.toString().padStart(2, '0');
            option.textContent = i;
            selectElement.appendChild(option);
        }
    }
}

// Fonction pour remplir un sélecteur de mois
function fillMonths(selectElement) {
    const mois = [
        { value: '01', nom: 'Janvier' },
        { value: '02', nom: 'Février' },
        { value: '03', nom: 'Mars' },
        { value: '04', nom: 'Avril' },
        { value: '05', nom: 'Mai' },
        { value: '06', nom: 'Juin' },
        { value: '07', nom: 'Juillet' },
        { value: '08', nom: 'Août' },
        { value: '09', nom: 'Septembre' },
        { value: '10', nom: 'Octobre' },
        { value: '11', nom: 'Novembre' },
        { value: '12', nom: 'Décembre' }
    ];
    
    if (selectElement) {
        mois.forEach(m => {
            const option = document.createElement('option');
            option.value = m.value;
            option.textContent = m.nom;
            selectElement.appendChild(option);
        });
    }
}

// Fonction pour remplir un sélecteur d'années (de l'année actuelle à X ans en arrière)
function fillYears(selectElement, yearsBack = 100) {
    if (selectElement) {
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= currentYear - yearsBack; i--) {
            const option = document.createElement('option');
            option.value = i.toString();
            option.textContent = i;
            selectElement.appendChild(option);
        }
    }
}

// Fonction pour initialiser les sélecteurs de date
function initializeDateSelector() {
    // Date de naissance
    const jourSelect = document.getElementById('jourNaissance');
    const moisSelect = document.getElementById('moisNaissance');
    const anneeSelect = document.getElementById('anneeNaissance');
    
    fillDays(jourSelect);
    fillMonths(moisSelect);
    fillYears(anneeSelect);
    
    // Écouter les changements pour mettre à jour le champ caché et vérifier l'âge
    [jourSelect, moisSelect, anneeSelect].forEach(select => {
        if (select) {
            select.addEventListener('change', function() {
                updateDateNaissance();
                checkAgeAndUpdateStep8();
            });
        }
    });
    
    // Date de signature - affichage automatique
    displayCurrentDate('dateSignatureDisplay', 'dateSignature');
    
    // Date parent - affichage automatique
    displayCurrentDate('parentDateDisplay', 'parentDate');
}

// Fonction pour mettre à jour le champ dateNaissance caché
function updateDateNaissance() {
    const jour = document.getElementById('jourNaissance')?.value;
    const mois = document.getElementById('moisNaissance')?.value;
    const annee = document.getElementById('anneeNaissance')?.value;
    
    const dateNaissanceInput = document.getElementById('dateNaissance');
    
    if (jour && mois && annee && dateNaissanceInput) {
        // Format: YYYY-MM-DD
        const dateComplete = `${annee}-${mois}-${jour}`;
        dateNaissanceInput.value = dateComplete;
    } else if (dateNaissanceInput) {
        dateNaissanceInput.value = '';
    }
}

// Fonction pour formater la date en français
function formatDateFrench(date) {
    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    
    const jourSemaine = jours[date.getDay()];
    const jour = date.getDate();
    const moisNom = mois[date.getMonth()];
    const annee = date.getFullYear();
    
    return `${jourSemaine} ${jour} ${moisNom} ${annee}`;
}

// Fonction pour afficher la date actuelle et mettre à jour le champ caché
function displayCurrentDate(displayElementId, hiddenInputId) {
    const today = new Date();
    const displayElement = document.getElementById(displayElementId);
    const hiddenInput = document.getElementById(hiddenInputId);
    
    if (displayElement) {
        // Afficher la date formatée en français
        displayElement.textContent = formatDateFrench(today);
    }
    
    if (hiddenInput) {
        // Format: YYYY-MM-DD pour le champ caché
        const jour = today.getDate().toString().padStart(2, '0');
        const mois = (today.getMonth() + 1).toString().padStart(2, '0');
        const annee = today.getFullYear().toString();
        hiddenInput.value = `${annee}-${mois}-${jour}`;
    }
}

// Fonction pour calculer l'âge à partir de la date de naissance
function calculateAge(dateNaissance) {
    if (!dateNaissance) return null;
    
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    
    // Vérifier si la date est valide
    if (isNaN(birthDate.getTime())) return null;
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

// Fonction pour vérifier si l'utilisateur a moins de 18 ans
function isUnder18() {
    const dateNaissance = document.getElementById('dateNaissance')?.value;
    if (!dateNaissance) return false;
    
    const age = calculateAge(dateNaissance);
    return age !== null && age < 18;
}

// Fonction pour obtenir le numéro d'étape réel (en sautant l'étape 11 si >= 18 ans)
function getRealStepNumber(step) {
    if (step <= 10) {
        return step;
    } else if (step === 11) {
        // Si l'utilisateur a 18 ans ou plus, l'étape 11 n'existe pas
        return isUnder18() ? 11 : null;
    }
    return step;
}

// Fonction pour obtenir l'étape suivante réelle
function getNextRealStep(currentStep) {
    if (currentStep < 10) {
        return currentStep + 1;
    } else if (currentStep === 10) {
        // Après l'étape 10, vérifier si on doit aller à l'étape 11 ou finir
        return isUnder18() ? 11 : null; // null signifie qu'on est à la fin
    } else if (currentStep === 11) {
        return null; // Fin du formulaire
    }
    return currentStep + 1;
}

// Fonction pour obtenir l'étape précédente réelle
function getPreviousRealStep(currentStep) {
    if (currentStep <= 1) {
        return 1;
    } else if (currentStep === 11) {
        return 10;
    } else if (currentStep === 10 && !isUnder18()) {
        // Si on est à l'étape 10 et qu'on a 18 ans ou plus, l'étape précédente est 10
        return 9;
    }
    return currentStep - 1;
}

// Noms des étapes pour les messages d'erreur
var stepTitles = {
    1: 'Informations personnelles',
    2: 'Coordonnées',
    3: 'Comment j\'ai connu le Vill\'Âge',
    4: 'Ce que je fais dans la vie',
    5: 'Mobilité et Permis',
    6: 'Droit à l\'image',
    7: 'Le fonctionnement d\'Ici',
    8: 'Moins de 18 ans (responsable légal)'
};

// Retourne la liste des champs manquants pour une étape (libellés affichés à l'utilisateur)
function getStepMissingFields(step) {
    var val = function (sel) { return (typeof getFormValue === 'function' ? getFormValue(sel) : (document.querySelector(sel) && document.querySelector(sel).value) || '').trim(); };
    var el = function (id) { return document.getElementById(id); };
    var missing = [];

    switch (step) {
        case 1:
            if (document.querySelectorAll('[name="genre"]:checked').length < 1) missing.push('Genre');
            if (!val('[name="nom"]')) missing.push('Nom');
            if (!val('[name="prenom"]')) missing.push('Prénom');
            if (document.querySelectorAll('[name="preferenceNom"]:checked').length < 1) missing.push('Préférence (prénom ou surnom)');
            if (!(el('jourNaissance') && el('jourNaissance').value)) missing.push('Jour de naissance');
            if (!(el('moisNaissance') && el('moisNaissance').value)) missing.push('Mois de naissance');
            if (!(el('anneeNaissance') && el('anneeNaissance').value)) missing.push('Année de naissance');
            break;
        case 2:
            if (!val('#province-select')) missing.push('Province');
            else {
                var communeSelect = el('commune-select');
                var commune = communeSelect && communeSelect.style.display !== 'none' ? (communeSelect.value || '').trim() : '';
                var villeInput = el('ville-village-tribu-input');
                var ville = villeInput && villeInput.style.display !== 'none' ? (villeInput.value || '').trim() : '';
                if (!commune && !ville) missing.push('Commune ou Ville/Village/Tribu');
            }
            if (!val('[name="email"]')) missing.push('Email');
            if (!val('[name="telephone"]')) missing.push('Téléphone');
            break;
        case 3:
            if (document.querySelectorAll('[name="decouverte"]:checked').length < 1) missing.push('Au moins une option (comment j\'ai connu le Vill\'Âge)');
            break;
        case 4:
            if (document.querySelectorAll('[name="activite"]:checked').length < 1) missing.push('Au moins une activité');
            else {
                var etudiantCheck = document.getElementById('etudiant-check');
                if (etudiantCheck && etudiantCheck.checked) {
                    var typeEtab = val('[name="typeEtablissement"]');
                    if (!typeEtab) missing.push('Type d\'établissement');
                    else if (typeEtab === 'EtudesSup') {
                        if (!val('[name="etudesSup"]')) missing.push('Établissement (études sup)');
                    } else {
                        var etabSelect = el('etablissement-select');
                        if (!etabSelect || !(etabSelect.value || '').trim()) missing.push('Établissement');
                    }
                }
                var payeeCheck = document.getElementById('payee-check');
                if (payeeCheck && payeeCheck.checked && document.querySelectorAll('[name="typeActivitePayee"]:checked').length < 1) missing.push('Type d\'activité payée');
            }
            break;
        case 5:
            if (document.querySelectorAll('[name="mobilite"]:checked').length < 1) missing.push('Mobilité');
            if (document.querySelectorAll('[name="permis"]:checked').length < 1) missing.push('Permis');
            break;
        case 6:
            if (!document.querySelector('[name="droitImage"]:checked')) missing.push('Choix (droit à l\'image)');
            break;
        case 7:
            if (!(el('reglement-accepte') && el('reglement-accepte').value === 'true')) missing.push('Règlement intérieur (lire et approuver)');
            if (!document.querySelector('[name="donneesPersonnelles"]:checked')) missing.push('Acceptation utilisation des données personnelles');
            if (!document.querySelector('[name="medecin"]:checked')) missing.push('Engagement avis médecin');
            if (!document.querySelector('[name="autorisationUrgence"]:checked')) missing.push('Autorisation urgence / soins');
            break;
        case 8:
            if (!document.querySelector('[name="parentReglement"]:checked')) missing.push('Règlement intérieur (parent)');
            if (!document.querySelector('[name="parentInfosExactes"]:checked')) missing.push('Exactitude des infos (parent)');
            if (!document.querySelector('[name="parentAutorisationSante"]:checked')) missing.push('Autorisation santé (parent)');
            if (!val('[name="parentNom"]')) missing.push('Nom du responsable');
            if (!val('[name="parentTelephone"]')) missing.push('Téléphone du responsable');
            if (!val('[name="parentEmail"]')) missing.push('Email du responsable');
            break;
    }
    return missing;
}

// Valide toutes les étapes actuellement visibles ; retourne { valid: boolean, errors: [{ step, title, missing }] }
function getVisibleStepsValidation() {
    var errors = [];
    for (var s = 1; s <= totalSteps; s++) {
        var stepEl = document.getElementById('step' + s);
        if (!stepEl || !stepEl.classList.contains('active')) continue;
        if (s === 8 && !isUnder18()) continue;
        var missing = getStepMissingFields(s);
        if (missing.length > 0) {
            errors.push({ step: s, title: stepTitles[s] || ('Étape ' + s), missing: missing });
        }
    }
    return { valid: errors.length === 0, errors: errors };
}

// Affiche le message listant les sections et champs manquants, puis retourne false pour bloquer l'avancement
function showValidationErrors(validation) {
    var msg = 'Toutes les sections visibles doivent être remplies.\n\nVeuillez compléter :\n\n';
    validation.errors.forEach(function (e) {
        msg += '• ' + e.title + ' : ' + e.missing.join(', ') + '\n';
    });
    alert(msg);
    return false;
}

function showStep(step) {
    // Masquer toutes les étapes
    for (let i = 1; i <= totalSteps; i++) {
        const stepElement = document.getElementById(`step${i}`);
        if (stepElement) {
            stepElement.classList.remove('active');
        }
    }

    // Afficher l'étape actuelle
    const currentStepElement = document.getElementById(`step${step}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }

    // Gérer l'affichage de l'étape 8 : elle ne doit être visible que si elle est active ET si l'utilisateur a moins de 18 ans
    const step8Element = document.getElementById('step8');
    if (step8Element) {
        if (step === 8 && isUnder18()) {
            step8Element.style.display = 'flex';
        } else {
            step8Element.style.display = 'none';
        }
    }

    // Mettre à jour le bouton de l'étape 7 selon l'âge
    if (step === 7) {
        const btnStep7Next = document.getElementById('btn-step7-next');
        if (btnStep7Next) {
            if (!isUnder18()) {
                btnStep7Next.textContent = 'Je valide mes informations';
                btnStep7Next.className = 'btn-submit';
                btnStep7Next.onclick = function() { submitForm(); };
            } else {
                btnStep7Next.textContent = 'Suivant';
                btnStep7Next.className = 'btn-next';
                btnStep7Next.onclick = function() { nextStep(); };
            }
        }
    }

    // Mettre à jour les points de pagination
    for (let i = 1; i <= totalSteps; i++) {
        const dot = document.getElementById(`dot${i}`);
        if (dot) {
            // Masquer le point de l'étape 8 si l'utilisateur a 18 ans ou plus
            if (i === 8 && !isUnder18()) {
                dot.style.display = 'none';
            } else {
                dot.style.display = 'inline-block';
                if (i === step) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            }
        }
    }
}

function nextStep() {
    var validation = getVisibleStepsValidation();
    if (!validation.valid) {
        showValidationErrors(validation);
        return;
    }
    const nextStepNum = getNextRealStep(currentStep);
    
    if (nextStepNum !== null) {
        currentStep = nextStepNum;
        showStep(currentStep);
        
        // Scroll vers le haut du formulaire
        document.querySelector('.form-container').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    } else {
        // Si nextStepNum est null, on est à la fin, soumettre le formulaire
        submitForm();
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep = getPreviousRealStep(currentStep);
        showStep(currentStep);
        
        // Scroll vers le haut du formulaire
        document.querySelector('.form-container').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function submitForm() {
    // Validation des champs obligatoires
    const reglementAccepte = document.getElementById('reglement-accepte');
    const donneesPersonnelles = document.querySelector('[name="donneesPersonnelles"]');
    const medecin = document.querySelector('[name="medecin"]');
    const autorisationUrgence = document.querySelector('[name="autorisationUrgence"]');
    const droitImage = document.querySelector('[name="droitImage"]:checked');

    if (!reglementAccepte || reglementAccepte.value !== 'true') {
        alert('Veuillez lire et approuver le règlement intérieur avant de valider votre inscription.');
        // Ouvrir le widget du règlement si le bouton existe
        const btnReglement = document.getElementById('btn-reglement-interieur');
        if (btnReglement) {
            btnReglement.click();
        }
        return;
    }

    if (!donneesPersonnelles || !donneesPersonnelles.checked) {
        alert('Veuillez accepter l\'utilisation de vos données personnelles pour continuer.');
        return;
    }

    if (!medecin || !medecin.checked) {
        alert('Veuillez accepter de demander l\'avis d\'un médecin si nécessaire pour continuer.');
        return;
    }

    if (!autorisationUrgence || !autorisationUrgence.checked) {
        alert('Veuillez autoriser l\'équipe à agir en cas d\'urgence pour continuer.');
        return;
    }

    if (!droitImage) {
        alert('Veuillez choisir une option concernant votre droit à l\'image.');
        return;
    }

    let formData;
    try {
        if (typeof getTotalFormTextLength === 'function' && typeof VALIDATION !== 'undefined' && VALIDATION.MAX_TOTAL_FORM_CHARS) {
            const totalChars = getTotalFormTextLength('.page-inscription .form-container');
            if (totalChars > VALIDATION.MAX_TOTAL_FORM_CHARS) {
                throw new Error('Le formulaire contient trop de données (limite ' + VALIDATION.MAX_TOTAL_FORM_CHARS + ' caractères au total). Réduisez le texte dans certains champs.');
            }
        }
        const genreEls = document.querySelectorAll('[name="genre"]:checked');
        const preferenceNomEls = document.querySelectorAll('[name="preferenceNom"]:checked');
        const decouverteEls = document.querySelectorAll('[name="decouverte"]:checked');
        const activiteEls = document.querySelectorAll('[name="activite"]:checked');
        const typeActivitePayeeEls = document.querySelectorAll('[name="typeActivitePayee"]:checked');
        const mobiliteEls = document.querySelectorAll('[name="mobilite"]:checked');
        const permisEls = document.querySelectorAll('[name="permis"]:checked');
        const objectifEls = document.querySelectorAll('[name="objectif"]:checked');
        const amenerEls = document.querySelectorAll('[name="amener"]:checked');
        const typeProjetEls = document.querySelectorAll('[name="typeProjet"]:checked');
        const benevolatEls = document.querySelectorAll('[name="benevolat"]:checked');

        const genre = validateStringArray(genreEls, 'Genre');
        const dateNaissance = validateDateString(document.getElementById('dateNaissance')?.value, 'Date de naissance', true);
        const jourNaissance = getFormValue('#jourNaissance') || document.getElementById('jourNaissance')?.value || '';
        const moisNaissance = getFormValue('#moisNaissance') || document.getElementById('moisNaissance')?.value || '';
        const anneeNaissance = getFormValue('#anneeNaissance') || document.getElementById('anneeNaissance')?.value || '';
        const nom = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="nom"]'), 'Nom', VALIDATION.MAX_LENGTH_SHORT, true) : validateString(getFormValue('[name="nom"]'), 'Nom', VALIDATION.MAX_LENGTH_SHORT, true);
        const prenom = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="prenom"]'), 'Prénom', VALIDATION.MAX_LENGTH_SHORT, true) : validateString(getFormValue('[name="prenom"]'), 'Prénom', VALIDATION.MAX_LENGTH_SHORT, true);
        const surnom = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="surnom"]'), 'Surnom', VALIDATION.MAX_LENGTH_SHORT, false) : validateOptionalString(getFormValue('[name="surnom"]'));
        const preferenceNom = validateStringArray(preferenceNomEls, 'Préférence nom');

        const ville = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="ville"]'), 'Ville', VALIDATION.MAX_LENGTH_SHORT, false) : validateOptionalString(getFormValue('[name="ville"]'));
        const quartier = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="quartier"]'), 'Quartier', VALIDATION.MAX_LENGTH_SHORT, false) : validateOptionalString(getFormValue('[name="quartier"]'));
        const email = validateEmail(getFormValue('[name="email"]'), true);
        const telephone = typeof validateTelephone === 'function' ? validateTelephone(getFormValue('[name="telephone"]'), 'Téléphone', false) : validateOptionalString(getFormValue('[name="telephone"]'));
        const whatsapp = document.querySelector('[name="whatsapp"]')?.checked === true;

        const decouverte = validateStringArray(decouverteEls, 'Découverte');
        const activite = validateStringArray(activiteEls, 'Activité');
        const nomEtablissement = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="nomEtablissement"]'), 'Établissement', VALIDATION.MAX_LENGTH_SHORT, false) : validateOptionalString(getFormValue('[name="nomEtablissement"]'));
        const clicMouv = document.querySelector('[name="clicMouv"]')?.checked === true;
        const secteurRecherche = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="secteurRecherche"]'), 'Secteur recherche', VALIDATION.MAX_LENGTH_SHORT, false) : validateOptionalString(getFormValue('[name="secteurRecherche"]'));
        const typeActivitePayee = validateStringArray(typeActivitePayeeEls, 'Type activité payée');
        const secteurActivite = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="secteurActivite"]'), 'Secteur activité', VALIDATION.MAX_LENGTH_SHORT, false) : validateOptionalString(getFormValue('[name="secteurActivite"]'));
        const nomAsso = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="nomAsso"]'), 'Nom asso', VALIDATION.MAX_LENGTH_SHORT, false) : validateOptionalString(getFormValue('[name="nomAsso"]'));
        const sujetAsso = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="sujetAsso"]'), 'Sujet asso', VALIDATION.MAX_LENGTH_SHORT, false) : validateOptionalString(getFormValue('[name="sujetAsso"]'));
        const autreActivite = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="autreActivite"]'), 'Autre activité', VALIDATION.MAX_LENGTH_TEXT, false, { allowMultiline: true }) : validateOptionalString(getFormValue('[name="autreActivite"]'), VALIDATION.MAX_LENGTH_TEXT);

        const mobilite = validateStringArray(mobiliteEls, 'Mobilité');
        const permis = validateStringArray(permisEls, 'Permis');
        const objectif = validateStringArray(objectifEls, 'Objectif');
        const objectifAutre = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="objectifAutre"]'), 'Objectif autre', VALIDATION.MAX_LENGTH_SHORT, false) : validateOptionalString(getFormValue('[name="objectifAutre"]'));
        const amener = validateStringArray(amenerEls, 'Amener');
        const aideEspace = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="aideEspace"]'), 'Aide espace', VALIDATION.MAX_LENGTH_TEXT, false, { allowMultiline: true }) : validateOptionalString(getFormValue('[name="aideEspace"]'), VALIDATION.MAX_LENGTH_TEXT);
        const reseauParticulier = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="reseauParticulier"]'), 'Réseau', VALIDATION.MAX_LENGTH_SHORT, false) : validateOptionalString(getFormValue('[name="reseauParticulier"]'));
        const autreIdee = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="autreIdee"]'), 'Autre idée', VALIDATION.MAX_LENGTH_TEXT, false, { allowMultiline: true }) : validateOptionalString(getFormValue('[name="autreIdee"]'), VALIDATION.MAX_LENGTH_TEXT);

        const typeProjet = validateStringArray(typeProjetEls, 'Type de projet');
        const typeProjetAutre = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="typeProjetAutre"]'), 'Type projet autre', VALIDATION.MAX_LENGTH_SHORT, false) : validateOptionalString(getFormValue('[name="typeProjetAutre"]'));
        const benevolat = validateStringArray(benevolatEls, 'Bénévolat');
        const saisFaire = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="saisFaire"]'), 'Savoir-faire', VALIDATION.MAX_LENGTH_TEXT, false, { allowMultiline: true }) : validateOptionalString(getFormValue('[name="saisFaire"]'), VALIDATION.MAX_LENGTH_TEXT);
        const aimeraisFaire = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="aimeraisFaire"]'), 'Aimerais faire', VALIDATION.MAX_LENGTH_TEXT, false, { allowMultiline: true }) : validateOptionalString(getFormValue('[name="aimeraisFaire"]'), VALIDATION.MAX_LENGTH_TEXT);
        const peuxTransmettre = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="peuxTransmettre"]'), 'Peux transmettre', VALIDATION.MAX_LENGTH_TEXT, false, { allowMultiline: true }) : validateOptionalString(getFormValue('[name="peuxTransmettre"]'), VALIDATION.MAX_LENGTH_TEXT);
        const aimeraisApprendre = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="aimeraisApprendre"]'), 'Aimerais apprendre', VALIDATION.MAX_LENGTH_TEXT, false, { allowMultiline: true }) : validateOptionalString(getFormValue('[name="aimeraisApprendre"]'), VALIDATION.MAX_LENGTH_TEXT);

        const problemeSante = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="problemeSante"]'), 'Problème santé', VALIDATION.MAX_LENGTH_TEXT, false, { allowMultiline: true }) : validateOptionalString(getFormValue('[name="problemeSante"]'), VALIDATION.MAX_LENGTH_TEXT);
        const dateSignature = validateDateString(getFormValue('[name="dateSignature"]'), 'Date de signature');
        const signature = validateSignature(getFormValue('[name="signature"]'), true);
        if (typeof validateSafeText === 'function' && signature) validateSafeText(signature, 'Signature', VALIDATION.MAX_LENGTH_SIGNATURE, false);

        const parentNom = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="parentNom"]'), 'Nom responsable', VALIDATION.MAX_LENGTH_SHORT, false) : validateOptionalString(getFormValue('[name="parentNom"]'));
        const parentTelephone = typeof validateTelephone === 'function' ? validateTelephone(getFormValue('[name="parentTelephone"]'), 'Téléphone responsable', false) : validateOptionalString(getFormValue('[name="parentTelephone"]'));
        const parentEmailRaw = getFormValue('[name="parentEmail"]');
        const parentEmail = parentEmailRaw ? (typeof validateEmail === 'function' ? validateEmail(parentEmailRaw, false) : parentEmailRaw) : '';
        const parentAdresse = typeof validateSafeText === 'function' ? validateSafeText(getFormValue('[name="parentAdresse"]'), 'Adresse responsable', VALIDATION.MAX_LENGTH_ADDRESS, false, { allowMultiline: true }) : validateOptionalString(getFormValue('[name="parentAdresse"]'), VALIDATION.MAX_LENGTH_TEXT);
        const parentDate = validateDateString(getFormValue('[name="parentDate"]'), 'Date représentant légal');
        const parentSignature = validateSignature(getFormValue('[name="parentSignature"]'));
        if (parentSignature && typeof validateSafeText === 'function') validateSafeText(parentSignature, 'Signature parent', VALIDATION.MAX_LENGTH_SIGNATURE, false);

        formData = {
            genre,
            dateNaissance,
            jourNaissance,
            moisNaissance,
            anneeNaissance,
            nom,
            prenom,
            surnom,
            preferenceNom,
            ville,
            quartier,
            email,
            telephone,
            whatsapp,
            decouverte,
            activite,
            nomEtablissement,
            clicMouv,
            secteurRecherche,
            typeActivitePayee,
            secteurActivite,
            nomAsso,
            sujetAsso,
            autreActivite,
            mobilite,
            permis,
            objectif,
            objectifAutre,
            amener,
            aideEspace,
            reseauParticulier,
            autreIdee,
            typeProjet,
            typeProjetAutre,
            benevolat,
            saisFaire,
            aimeraisFaire,
            peuxTransmettre,
            aimeraisApprendre,
            droitImage: droitImage?.value || '',
            reglementAccepte: true,
            donneesPersonnelles: donneesPersonnelles?.checked === true,
            medecin: medecin?.checked === true,
            problemeSante,
            autorisationUrgence: autorisationUrgence?.checked === true,
            dateSignature,
            signature,
            parentReglement: document.querySelector('[name="parentReglement"]')?.checked === true,
            parentInfosExactes: document.querySelector('[name="parentInfosExactes"]')?.checked === true,
            parentAutorisationSante: document.querySelector('[name="parentAutorisationSante"]')?.checked === true,
            parentNom,
            parentTelephone,
            parentEmail,
            parentAdresse,
            parentDate,
            parentSignature,
        };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Une erreur est survenue lors de la validation des données.';
        alert(message);
        return;
    }

    // Afficher les données (à remplacer par l'envoi au serveur)
    console.log('Données du formulaire:', formData);

    // Ici, vous pouvez ajouter l'envoi des données au serveur
    // fetch('/api/submit', { method: 'POST', body: JSON.stringify(formData) })

    // Rediriger vers la page de confirmation
    window.location.href = 'confirmation.html';
}

// Gérer les champs conditionnels
function setupConditionalFields() {
    // École
    const etudiantCheck = document.getElementById('etudiant-check');
    const etudiantFields = document.getElementById('etudiant-fields');
    if (etudiantCheck && etudiantFields) {
        etudiantCheck.addEventListener('change', function() {
            etudiantFields.style.display = this.checked ? 'block' : 'none';
            if (!this.checked) {
                // Réinitialiser les champs si la case est décochée
                const typeSelect = document.getElementById('type-etablissement-select');
                const etablissementSelect = document.getElementById('etablissement-select');
                if (typeSelect) typeSelect.value = '';
                if (etablissementSelect) {
                    etablissementSelect.value = '';
                    etablissementSelect.disabled = true;
                }
            }
        });
    }

    // Emploi
    const emploiCheck = document.getElementById('emploi-check');
    const emploiFields = document.getElementById('emploi-fields');
    if (emploiCheck && emploiFields) {
        emploiCheck.addEventListener('change', function() {
            emploiFields.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Activité payée
    const payeeCheck = document.getElementById('payee-check');
    const payeeFields = document.getElementById('payee-fields');
    if (payeeCheck && payeeFields) {
        payeeCheck.addEventListener('change', function() {
            payeeFields.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Problème de santé
    const problemeSanteCheck = document.getElementById('probleme-sante-check');
    const problemeSanteFields = document.getElementById('probleme-sante-fields');
    if (problemeSanteCheck && problemeSanteFields) {
        problemeSanteCheck.addEventListener('change', function() {
            problemeSanteFields.style.display = this.checked ? 'block' : 'none';
            if (!this.checked) {
                const textarea = problemeSanteFields.querySelector('textarea[name="problemeSante"]');
                if (textarea) textarea.value = '';
            }
        });
    }

    // Asso
    const assoCheck = document.getElementById('asso-check');
    const assoFields = document.getElementById('asso-fields');
    if (assoCheck && assoFields) {
        assoCheck.addEventListener('change', function() {
            assoFields.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Autre activité
    const autreCheck = document.getElementById('autre-check');
    const autreFields = document.getElementById('autre-fields');
    if (autreCheck && autreFields) {
        autreCheck.addEventListener('change', function() {
            autreFields.style.display = this.checked ? 'block' : 'none';
        });
    }


    // Objectif autre
    const objectifAutreCheck = document.getElementById('objectif-autre-check');
    const objectifAutreFields = document.getElementById('objectif-autre-fields');
    if (objectifAutreCheck && objectifAutreFields) {
        objectifAutreCheck.addEventListener('change', function() {
            objectifAutreFields.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Aide espace
    const aideEspaceCheck = document.getElementById('aide-espace-check');
    const aideEspaceFields = document.getElementById('aide-espace-fields');
    if (aideEspaceCheck && aideEspaceFields) {
        aideEspaceCheck.addEventListener('change', function() {
            aideEspaceFields.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Réseau
    const reseauCheck = document.getElementById('reseau-check');
    const reseauFields = document.getElementById('reseau-fields');
    if (reseauCheck && reseauFields) {
        reseauCheck.addEventListener('change', function() {
            reseauFields.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Autre idée
    const autreIdeeCheck = document.getElementById('autre-idee-check');
    const autreIdeeFields = document.getElementById('autre-idee-fields');
    if (autreIdeeCheck && autreIdeeFields) {
        autreIdeeCheck.addEventListener('change', function() {
            autreIdeeFields.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Projet autre
    const projetAutreCheck = document.getElementById('projet-autre-check');
    const projetAutreFields = document.getElementById('projet-autre-fields');
    if (projetAutreCheck && projetAutreFields) {
        projetAutreCheck.addEventListener('change', function() {
            projetAutreFields.style.display = this.checked ? 'block' : 'none';
        });
    }
}

// Fonction pour vérifier l'âge et mettre à jour l'affichage de l'étape 11
function checkAgeAndUpdateStep8() {
    const step8Element = document.getElementById('step8');
    const dot8 = document.getElementById('dot8');
    const btnStep7Next = document.getElementById('btn-step7-next');
    
    if (step8Element) {
        if (!isUnder18()) {
            step8Element.style.display = 'none';
            // Si on est actuellement sur l'étape 8 et qu'on a 18 ans ou plus, revenir à l'étape 7
            if (currentStep === 8) {
                currentStep = 7;
                showStep(7);
            }
        } else {
            step8Element.style.display = 'flex';
        }
    }
    
    if (dot8) {
        dot8.style.display = isUnder18() ? 'inline-block' : 'none';
    }
    
    // Mettre à jour le texte du bouton de l'étape 7
    if (btnStep7Next) {
        if (!isUnder18()) {
            btnStep7Next.textContent = 'Je valide mes informations';
            btnStep7Next.className = 'btn-submit';
            btnStep7Next.onclick = function() { submitForm(); };
        } else {
            btnStep7Next.textContent = 'Suivant';
            btnStep7Next.className = 'btn-next';
            btnStep7Next.onclick = function() { nextStep(); };
        }
    }
    
    // Mettre à jour l'affichage
    showStep(currentStep);
}

// Initialiser l'affichage au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    showStep(1);
    setupConditionalFields();
    initializeDateSelector();

    // Limite de caractères (maxlength) et compteurs (prévention surcharge / injection)
    document.querySelectorAll('.page-inscription [data-max-length]').forEach(function (el) {
        var max = parseInt(el.getAttribute('data-max-length'), 10);
        if (!isNaN(max) && max > 0) {
            el.setAttribute('maxlength', max);
            if (typeof attachCharCounter === 'function') attachCharCounter(el, max);
        }
    });
    if (typeof setInputHint === 'function') {
        setInputHint('[name="telephone"]', 'Chiffres et espaces uniquement.');
        setInputHint('[name="parentTelephone"]', 'Chiffres et espaces uniquement.');
    }

    // Vérifier l'âge au chargement initial
    checkAgeAndUpdateStep8();
    
    // Configuration du widget Règlement intérieur
    setupReglementWidget();
});

// Configuration du widget Règlement intérieur
function setupReglementWidget() {
    const btnReglement = document.getElementById('btn-reglement-interieur');
    const overlay = document.getElementById('reglementOverlay');
    const closeBtn = document.getElementById('closeReglement');
    const validerBtn = document.getElementById('btn-reglement-valider');
    const reglementAccepte = document.getElementById('reglement-accepte');
    const reglementLu = document.getElementById('reglement-lu');
    
    if (!btnReglement || !overlay) {
        console.warn('Éléments du widget règlement intérieur non trouvés');
        return;
    }
    
    // Stocker l'étape actuelle avant d'ouvrir le widget
    let stepBeforeReglement = null;
    
    // Ouvrir le widget
    btnReglement.addEventListener('click', () => {
        stepBeforeReglement = currentStep; // Sauvegarder l'étape actuelle
        overlay.classList.add('active');
        
        // Forcer le scroll vers le haut après un court délai pour s'assurer que le contenu est rendu
        setTimeout(() => {
            const content = overlay.querySelector('.reglement-content');
            if (content) {
                content.scrollTop = 0;
            }
            overlay.scrollTop = 0;
        }, 100);
    });
    
    // Fermer le widget
    function closeWidget() {
        overlay.classList.remove('active');
        // Retourner à l'étape où on était avant d'ouvrir le widget
        if (stepBeforeReglement !== null) {
            showStep(stepBeforeReglement);
            stepBeforeReglement = null;
        }
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeWidget);
    }
    
    // Fermer en cliquant sur l'overlay
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeWidget();
        }
    });
    
    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeWidget();
        }
    });
    
    // Valider le règlement
    if (validerBtn) {
        validerBtn.addEventListener('click', () => {
            if (reglementAccepte) {
                reglementAccepte.value = 'true';
            }
            if (reglementLu) {
                reglementLu.value = 'true';
            }
            closeWidget();
        });
    }
}
