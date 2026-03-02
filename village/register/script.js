let currentStep = 1;
const totalSteps = 8;

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
            select.addEventListener('change', function () {
                updateDateNaissance();
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

// Fonction pour obtenir le numéro d'étape réel (en sautant l'étape 11 si >= 18 ans)
function getRealStepNumber(step) {
    if (step <= 10) {
        return step;
    }
}

// Fonction pour obtenir l'étape suivante réelle
function getNextRealStep(currentStep) {
    if (currentStep < 10) {
        return currentStep + 1;
    }
    return currentStep + 1;
}

// Fonction pour obtenir l'étape précédente réelle
function getPreviousRealStep(currentStep) {
    if (currentStep <= 1) {
        return 1;
    } else if (currentStep === 11) {
        return 10;
    }
    return currentStep - 1;
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
    // Mettre à jour le bouton de l'étape 7 selon l'âge
    if (step === 7) {
        const btnStep7Next = document.getElementById('btn-step7-next');
        if (btnStep7Next) {
                btnStep7Next.textContent = 'Je valide mes informations';
                btnStep7Next.className = 'btn-submit';
                btnStep7Next.onclick = function () { submitForm(); };

        }
    }

    // Mettre à jour les points de pagination
    for (let i = 1; i <= totalSteps; i++) {
        const dot = document.getElementById(`dot${i}`);
        if (dot) {
            // Masquer le point de l'étape 8 si l'utilisateur a 18 ans ou plus
            if (i === 8 ) {
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

function reportFieldError(field, message) {
    if (!field) {
        alert(message);
        return;
    }

    field.setCustomValidity(message);
    field.reportValidity();
    field.setCustomValidity('');
    field.focus();
}

function validateCurrentStep(step) {
    const stepElement = document.getElementById(`step${step}`);
    if (!stepElement) return true;

    // Helpers ---------------------------------------------------
    const isVisible = (el) => !!el && el.offsetParent !== null;
    const hasValue = (el) => !!el && String(el.value ?? "").trim().length > 0;

    const focusAndError = (el, msg) => {
        reportFieldError(el, msg);
        try { el?.focus?.(); } catch (_) { }
    };

    // ===========================================================
    // Étape 1 (tes validations spécifiques, corrigées)
    // ===========================================================
    if (step === 1) {
        const genreSelection = stepElement.querySelector('[name="genre"]:checked');
        const nomInput = stepElement.querySelector('[name="nom"]');
        const prenomInput = stepElement.querySelector('[name="prenom"]');
        const surnomInput = stepElement.querySelector('[name="surnom"]');
        const preferenceNomSelection = stepElement.querySelector('[name="preferenceNom"]:checked');
        const jourNaissance = stepElement.querySelector('[name="jourNaissance"]');
        const moisNaissance = stepElement.querySelector('[name="moisNaissance"]');
        const anneeNaissance = stepElement.querySelector('[name="anneeNaissance"]');

        if (!genreSelection) {
            focusAndError(stepElement.querySelector('[name="genre"]'), "Veuillez choisir votre genre.");
            return false;
        }

        if (!hasValue(nomInput)) {
            focusAndError(nomInput, "Veuillez renseigner votre nom.");
            return false;
        }

        if (!hasValue(prenomInput)) {
            focusAndError(prenomInput, "Veuillez renseigner votre prénom.");
            return false;
        }

        if (!hasValue(jourNaissance) || !hasValue(moisNaissance) || !hasValue(anneeNaissance)) {
            focusAndError(jourNaissance || moisNaissance || anneeNaissance, "Veuillez renseigner votre date de naissance complète.");
            return false;
        }

        // préférence affichage nom : soit "prenom" soit "surnom"
        if (!preferenceNomSelection) {
            focusAndError(
                stepElement.querySelector('[name="preferenceNom"]'),
                "Veuillez choisir une préférence (prénom ou surnom)."
            );
            return false;
        }

        // si l'utilisateur choisit "surnom", alors surnom obligatoire
        if (preferenceNomSelection.value === "surnom" && !hasValue(surnomInput)) {
            focusAndError(surnomInput, "Veuillez renseigner votre surnom.");
            return false;
        }
    }
     if (step === 3) {
        const decouverte = Array.from(stepElement.querySelectorAll('input[name="decouverte"]'));
        const checked = decouverte.filter((c) => c.checked);

        // Toujours nettoyer l'erreur custom dès qu'on revalide
        for (const cb of decouverte) cb.setCustomValidity("");

        if (checked.length === 0) {
            const first = decouverte[0];
            if (first) {
                // Message natif visible
                first.setCustomValidity("Veuillez sélectionner au moins une case pour continuer.");
                first.reportValidity();
                first.focus();
            } else {
                alert("Veuillez sélectionner au moins une case pour continuer.");
            }
            return false;
        }
     }

    // ===========================================================
    // Étape 4 : au moins un choix "activite" doit être coché
    // + validation des champs conditionnels visibles
    // ===========================================================
    if (step === 4) {
        const activites = Array.from(stepElement.querySelectorAll('input[name="activite"]'));
        const checked = activites.filter((c) => c.checked);

        // Toujours nettoyer l'erreur custom dès qu'on revalide
        for (const cb of activites) cb.setCustomValidity("");

        if (checked.length === 0) {
            const first = activites[0];
            if (first) {
                // Message natif visible
                first.setCustomValidity("Veuillez sélectionner au moins une activité pour continuer.");
                first.reportValidity();
                first.focus();
            } else {
                alert("Veuillez sélectionner au moins une activité pour continuer.");
            }
            return false;
        }

        // --- règles conditionnelles (uniquement si le bloc est visible ET l'option est cochée)

        // Étudiant
        const etudiantChecked = !!stepElement.querySelector('#etudiant-check:checked');
        const etudiantFields = stepElement.querySelector('#etudiant-fields');

        if (etudiantChecked && isVisible(etudiantFields)) {
            const typeEtab = stepElement.querySelector('[name="typeEtablissement"]');
            if (!hasValue(typeEtab)) {
                focusAndError(typeEtab, "Veuillez sélectionner un type d’établissement.");
                return false;
            }

            // Si Études sup => input texte obligatoire
            if (typeEtab.value === "EtudesSup") {
                const etudesSup = stepElement.querySelector('[name="etudesSup"]');
                if (!hasValue(etudesSup)) {
                    focusAndError(etudesSup, "Veuillez indiquer votre établissement d’études supérieures.");
                    return false;
                }
            } else {
                // Sinon => select établissement obligatoire (si visible)
                const etablissementSelect = stepElement.querySelector('[name="etablissement"]');
                if (isVisible(etablissementSelect) && !hasValue(etablissementSelect)) {
                    focusAndError(etablissementSelect, "Veuillez sélectionner votre établissement.");
                    return false;
                }
            }
        }

        // Recherche emploi
        const emploiChecked = !!stepElement.querySelector('#emploi-check:checked');
        const emploiFields = stepElement.querySelector('#emploi-fields');
        if (emploiChecked && isVisible(emploiFields)) {
            const secteurRecherche = stepElement.querySelector('[name="secteurRecherche"]');
            if (!hasValue(secteurRecherche)) {
                focusAndError(secteurRecherche, "Veuillez indiquer le secteur recherché.");
                return false;
            }
        }

        // Activité payée
        const payeeChecked = !!stepElement.querySelector('#payee-check:checked');
        const payeeFields = stepElement.querySelector('#payee-fields');
        if (payeeChecked && isVisible(payeeFields)) {
            const typesPayee = Array.from(stepElement.querySelectorAll('input[name="typeActivitePayee"]'));
            const oneTypeChecked = typesPayee.some((c) => c.checked);

            if (!oneTypeChecked) {
                focusAndError(typesPayee[0] || payeeFields, "Veuillez sélectionner au moins un type d’activité professionnelle.");
                return false;
            }

            const secteurActivite = stepElement.querySelector('[name="secteurActivite"]');
            if (!hasValue(secteurActivite)) {
                focusAndError(secteurActivite, "Veuillez indiquer le secteur d’activité.");
                return false;
            }
        }

        // Autre
        const autreChecked = !!stepElement.querySelector('#autre-check:checked');
        const autreFields = stepElement.querySelector('#autre-fields');
        if (autreChecked && isVisible(autreFields)) {
            const autreActivite = stepElement.querySelector('[name="autreActivite"]');
            if (!hasValue(autreActivite)) {
                focusAndError(autreActivite, "Veuillez préciser l’activité.");
                return false;
            }
        }

        // Asso
        const assoChecked = !!stepElement.querySelector('#asso-check:checked');
        const assoFields = stepElement.querySelector('#asso-fields');
        if (assoChecked && isVisible(assoFields)) {
            const nomAsso = stepElement.querySelector('[name="nomAsso"]');
            const sujetAsso = stepElement.querySelector('[name="sujetAsso"]');

            if (!hasValue(nomAsso)) {
                focusAndError(nomAsso, "Veuillez indiquer le nom de l’association / collectif.");
                return false;
            }
            if (!hasValue(sujetAsso)) {
                focusAndError(sujetAsso, "Veuillez indiquer le sujet.");
                return false;
            }
        }
    }
    if (step === 5) {
        const mobilites = Array.from(stepElement.querySelectorAll('input[name="mobilite"]'));
        const permis = Array.from(stepElement.querySelectorAll('input[name="permis"]'));
        const checked_mobilites = mobilites.filter((c) => c.checked);
        const checked_permis = permis.filter((c) => c.checked);

        // Toujours nettoyer l'erreur custom dès qu'on revalide
        for (const cb of mobilites) cb.setCustomValidity("");

        if (checked_mobilites.length === 0) {
            const first = mobilites[0];
            if (first) {
                // Message natif visible
                first.setCustomValidity("Veuillez sélectionner au moins un moyen de déplacement pour continuer.");
                first.reportValidity();
                first.focus();
            } else {
                alert("Veuillez sélectionner au moins un moyen de déplacement pour continuer.");
            }
            return false;
        }
        if (checked_permis.length === 0) {
            const first = permis[0];
            if (first) {
                // Message natif visible
                first.setCustomValidity("Veuillez sélectionner au moins un moyen de déplacement pour continuer.");
                first.reportValidity();
                first.focus();
            } else {
                alert("Veuillez sélectionner au moins un moyen de déplacement pour continuer.");
            }
            return false;
        }
    }

    // ===========================================================
    // Validation HTML5 des champs required (visibles)
    // ===========================================================
    const requiredFields = stepElement.querySelectorAll(
        "input[required], select[required], textarea[required]"
    );

    for (const field of requiredFields) {
        const hidden = field.type === "hidden" || field.offsetParent === null;
        if (field.disabled || hidden) continue;

        if (!field.checkValidity()) {
            field.reportValidity();
            field.focus();
            return false;
        }
    }

    return true;
}

function nextStep() {
    if (!validateCurrentStep(currentStep)) {
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
    const genreSelection = document.querySelector('[name="genre"]:checked');
    const preferenceNomSelection = document.querySelector('[name="preferenceNom"]:checked');

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

    // Récupérer toutes les données du formulaire
    if (!genreSelection) {
        alert('Veuillez choisir un genre (Homme, Femme ou Autre).');
        return;
    }

    if (!preferenceNomSelection) {
        alert('Veuillez choisir si vous preferez le prenom ou le surnom.');
        return;
    }

    const formData = {
        // Étape 1
        genre: genreSelection?.value || '',
        dateNaissance: document.getElementById('dateNaissance')?.value || '',
        jourNaissance: document.getElementById('jourNaissance')?.value || '',
        moisNaissance: document.getElementById('moisNaissance')?.value || '',
        anneeNaissance: document.getElementById('anneeNaissance')?.value || '',
        nom: document.querySelector('[name="nom"]')?.value || '',
        prenom: document.querySelector('[name="prenom"]')?.value || '',
        surnom: document.querySelector('[name="surnom"]')?.value || '',
        preferenceNom: preferenceNomSelection?.value || '',

        // Étape 2
        province: document.querySelector('[name="province"]')?.value || '',
        commune: document.querySelector('[name="commune"]')?.value
            || '',
        quartier: document.getElementById('quartier-select')?.value
            || document.getElementById('quartier-input')?.value
            || '',
        // district coutumier (îles) : idem select ou input
        districtCoutumier:
            document.getElementById('district-select')?.value
            || document.getElementById('district-input')?.value
            || document.querySelector('[name="district"]')?.value
            || '',
        email: document.querySelector('[name="email"]')?.value || '',
        telephone: document.querySelector('[name="telephone"]')?.value || '',
        whatsapp: document.querySelector('[name="whatsapp"]')?.checked || false,

        // Étape 3
        decouverte: Array.from(document.querySelectorAll('[name="decouverte"]:checked')).map(cb => cb.value),

        // Étape 4
        activite: Array.from(document.querySelectorAll('[name="activite"]:checked')).map(cb => cb.value),
        typeEtablissement: document.getElementById('type-etablissement-select')?.value || '',

        // si EtudesSup -> input texte `etudesSup`, sinon -> select `etablissement-select`
        typeEtablissement: document.querySelector('[name="typeEtablissement"]')?.value || '',
        etablissement: document.querySelector('[name="etablissement"]')?.value || '',
        clicMouv: document.querySelector('[name="clicMouv"]')?.checked || false,
        secteurRecherche: document.querySelector('[name="secteurRecherche"]')?.value || '',
        typeActivitePayee: Array.from(document.querySelectorAll('[name="typeActivitePayee"]:checked')).map(cb => cb.value),
        secteurActivite: document.querySelector('[name="secteurActivite"]')?.value || '',
        nomAsso: document.querySelector('[name="nomAsso"]')?.value || '',
        sujetAsso: document.querySelector('[name="sujetAsso"]')?.value || '',
        autreActivite: document.querySelector('[name="autreActivite"]')?.value || '',

        // Étape 5
        mobilite: Array.from(document.querySelectorAll('[name="mobilite"]:checked')).map(cb => cb.value),
        permis: Array.from(document.querySelectorAll('[name="permis"]:checked')).map(cb => cb.value),

        // Étape 6
        objectif: Array.from(document.querySelectorAll('[name="objectif"]:checked')).map(cb => cb.value),
        objectifAutre: document.querySelector('[name="objectifAutre"]')?.value || '',
        amener: Array.from(document.querySelectorAll('[name="amener"]:checked')).map(cb => cb.value),
        aideEspace: document.querySelector('[name="aideEspace"]')?.value || '',
        reseauParticulier: document.querySelector('[name="reseauParticulier"]')?.value || '',
        autreIdee: document.querySelector('[name="autreIdee"]')?.value || '',

        // Étape 7
        typeProjet: Array.from(document.querySelectorAll('[name="typeProjet"]:checked')).map(cb => cb.value),
        typeProjetAutre: document.querySelector('[name="typeProjetAutre"]')?.value || '',
        benevolat: Array.from(document.querySelectorAll('[name="benevolat"]:checked')).map(cb => cb.value),

        // Étape 8
        saisFaire: document.querySelector('[name="saisFaire"]')?.value || '',
        aimeraisFaire: document.querySelector('[name="aimeraisFaire"]')?.value || '',
        peuxTransmettre: document.querySelector('[name="peuxTransmettre"]')?.value || '',
        aimeraisApprendre: document.querySelector('[name="aimeraisApprendre"]')?.value || '',

        // Étape 9
        droitImage: droitImage?.value || '',

        // Étape 7
        reglementAccepte: document.getElementById('reglement-accepte')?.value === 'true' || false,
        donneesPersonnelles: donneesPersonnelles?.checked || false,
        autorisationMedicale: medecin?.checked || false,
        problemeSante: document.querySelector('[name="problemeSante"]')?.value || '',
        autorisationUrgence: autorisationUrgence?.checked || false,
        dateSignature: document.querySelector('[name="dateSignature"]')?.value || '',
        signature: document.querySelector('[name="signature"]')?.value || '',

        // Étape 11
        parentReglement: document.querySelector('[name="parentReglement"]')?.checked || false,
        parentInfosExactes: document.querySelector('[name="parentInfosExactes"]')?.checked || false,
        parentAutorisationSante: document.querySelector('[name="parentAutorisationSante"]')?.checked || false,
        parentNom: document.querySelector('[name="parentNom"]')?.value || '',
        parentTelephone: document.querySelector('[name="parentTelephone"]')?.value || '',
        parentEmail: document.querySelector('[name="parentEmail"]')?.value || '',
        parentAdresse: document.querySelector('[name="parentAdresse"]')?.value || '',
        parentDate: document.querySelector('[name="parentDate"]')?.value || '',
        parentSignature: document.querySelector('[name="parentSignature"]')?.value || '',

    };

    // Afficher les données (à remplacer par l'envoi au serveur)
    console.log("submitForm() from script.js ✅");
    console.log('Données du formulaire:', formData);
    // ✅ Envoi au serveur (et redirection seulement si OK)
    fetch("/api/inscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData }),
    })
        .then(async (res) => {
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
            return data;
        })
        .then((data) => {
            window.location.href = '/village/register/confirmation.html';
        })
        .catch((err) => {
            console.error(err);
            alert(err.message || "Erreur lors de l'inscription.");
        });
}

// Gérer les champs conditionnels
function setupConditionalFields() {
    // École
    const etudiantCheck = document.getElementById('etudiant-check');
    const etudiantFields = document.getElementById('etudiant-fields');
    if (etudiantCheck && etudiantFields) {
        etudiantCheck.addEventListener('change', function () {
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
        emploiCheck.addEventListener('change', function () {
            emploiFields.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Activité payée
    const payeeCheck = document.getElementById('payee-check');
    const payeeFields = document.getElementById('payee-fields');
    if (payeeCheck && payeeFields) {
        payeeCheck.addEventListener('change', function () {
            payeeFields.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Problème de santé
    const problemeSanteCheck = document.getElementById('probleme-sante-check');
    const problemeSanteFields = document.getElementById('probleme-sante-fields');
    if (problemeSanteCheck && problemeSanteFields) {
        problemeSanteCheck.addEventListener('change', function () {
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
        assoCheck.addEventListener('change', function () {
            assoFields.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Autre activité
    const autreCheck = document.getElementById('autre-check');
    const autreFields = document.getElementById('autre-fields');
    if (autreCheck && autreFields) {
        autreCheck.addEventListener('change', function () {
            autreFields.style.display = this.checked ? 'block' : 'none';
        });
    }


    // Objectif autre
    const objectifAutreCheck = document.getElementById('objectif-autre-check');
    const objectifAutreFields = document.getElementById('objectif-autre-fields');
    if (objectifAutreCheck && objectifAutreFields) {
        objectifAutreCheck.addEventListener('change', function () {
            objectifAutreFields.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Aide espace
    const aideEspaceCheck = document.getElementById('aide-espace-check');
    const aideEspaceFields = document.getElementById('aide-espace-fields');
    if (aideEspaceCheck && aideEspaceFields) {
        aideEspaceCheck.addEventListener('change', function () {
            aideEspaceFields.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Réseau
    const reseauCheck = document.getElementById('reseau-check');
    const reseauFields = document.getElementById('reseau-fields');
    if (reseauCheck && reseauFields) {
        reseauCheck.addEventListener('change', function () {
            reseauFields.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Autre idée
    const autreIdeeCheck = document.getElementById('autre-idee-check');
    const autreIdeeFields = document.getElementById('autre-idee-fields');
    if (autreIdeeCheck && autreIdeeFields) {
        autreIdeeCheck.addEventListener('change', function () {
            autreIdeeFields.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Projet autre
    const projetAutreCheck = document.getElementById('projet-autre-check');
    const projetAutreFields = document.getElementById('projet-autre-fields');
    if (projetAutreCheck && projetAutreFields) {
        projetAutreCheck.addEventListener('change', function () {
            projetAutreFields.style.display = this.checked ? 'block' : 'none';
        });
    }
}

// Initialiser l'affichage au chargement de la page
document.addEventListener('DOMContentLoaded', function () {
    showStep(1);
    setupConditionalFields();
    initializeDateSelector();

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

