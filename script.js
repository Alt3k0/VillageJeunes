let currentStep = 1;
const totalSteps = 11;

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
                checkAgeAndUpdateStep11();
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

    // Gérer l'affichage de l'étape 11 : elle ne doit être visible que si elle est active ET si l'utilisateur a moins de 18 ans
    const step11Element = document.getElementById('step11');
    if (step11Element) {
        if (step === 11 && isUnder18()) {
            step11Element.style.display = 'flex';
        } else {
            step11Element.style.display = 'none';
        }
    }

    // Mettre à jour le bouton de l'étape 10 selon l'âge
    if (step === 10) {
        const btnStep10Next = document.getElementById('btn-step10-next');
        if (btnStep10Next) {
            if (!isUnder18()) {
                btnStep10Next.textContent = 'Je valide mes informations';
                btnStep10Next.className = 'btn-submit';
                btnStep10Next.onclick = function() { submitForm(); };
            } else {
                btnStep10Next.textContent = 'Suivant';
                btnStep10Next.className = 'btn-next';
                btnStep10Next.onclick = function() { nextStep(); };
            }
        }
    }

    // Mettre à jour les points de pagination
    for (let i = 1; i <= totalSteps; i++) {
        const dot = document.getElementById(`dot${i}`);
        if (dot) {
            // Masquer le point de l'étape 11 si l'utilisateur a 18 ans ou plus
            if (i === 11 && !isUnder18()) {
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
    const reglement = document.querySelector('[name="reglement"]');
    const donneesPersonnelles = document.querySelector('[name="donneesPersonnelles"]');
    const medecin = document.querySelector('[name="medecin"]');
    const autorisationUrgence = document.querySelector('[name="autorisationUrgence"]');
    const droitImage = document.querySelector('[name="droitImage"]:checked');

    if (!reglement || !reglement.checked) {
        alert('Veuillez accepter le règlement intérieur pour continuer.');
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
    const formData = {
        // Étape 1
        genre: Array.from(document.querySelectorAll('[name="genre"]:checked')).map(cb => cb.value),
        dateNaissance: document.getElementById('dateNaissance')?.value || '',
        jourNaissance: document.getElementById('jourNaissance')?.value || '',
        moisNaissance: document.getElementById('moisNaissance')?.value || '',
        anneeNaissance: document.getElementById('anneeNaissance')?.value || '',
        nom: document.querySelector('[name="nom"]')?.value || '',
        prenom: document.querySelector('[name="prenom"]')?.value || '',
        surnom: document.querySelector('[name="surnom"]')?.value || '',
        preferenceNom: Array.from(document.querySelectorAll('[name="preferenceNom"]:checked')).map(cb => cb.value),
        
        // Étape 2
        ville: document.querySelector('[name="ville"]')?.value || '',
        quartier: document.querySelector('[name="quartier"]')?.value || '',
        email: document.querySelector('[name="email"]')?.value || '',
        telephone: document.querySelector('[name="telephone"]')?.value || '',
        whatsapp: document.querySelector('[name="whatsapp"]')?.checked || false,
        
        // Étape 3
        decouverte: Array.from(document.querySelectorAll('[name="decouverte"]:checked')).map(cb => cb.value),
        
        // Étape 4
        activite: Array.from(document.querySelectorAll('[name="activite"]:checked')).map(cb => cb.value),
        nomEtablissement: document.querySelector('[name="nomEtablissement"]')?.value || '',
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
        
        // Étape 10
        reglement: reglement?.checked || false,
        donneesPersonnelles: donneesPersonnelles?.checked || false,
        medecin: medecin?.checked || false,
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
    console.log('Données du formulaire:', formData);
    
    // Ici, vous pouvez ajouter l'envoi des données au serveur
    // fetch('/api/submit', { method: 'POST', body: JSON.stringify(formData) })
    
    // Rediriger vers la page de confirmation
    window.location.href = 'confirmation.html';
}

// Gérer les champs conditionnels
function setupConditionalFields() {
    // École
    const ecoleCheck = document.getElementById('ecole-check');
    const ecoleFields = document.getElementById('ecole-fields');
    if (ecoleCheck && ecoleFields) {
        ecoleCheck.addEventListener('change', function() {
            ecoleFields.style.display = this.checked ? 'block' : 'none';
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
function checkAgeAndUpdateStep11() {
    const step11Element = document.getElementById('step11');
    const dot11 = document.getElementById('dot11');
    const btnStep10Next = document.getElementById('btn-step10-next');
    
    if (step11Element) {
        if (!isUnder18()) {
            step11Element.style.display = 'none';
            // Si on est actuellement sur l'étape 11 et qu'on a 18 ans ou plus, revenir à l'étape 10
            if (currentStep === 11) {
                currentStep = 10;
                showStep(10);
            }
        } else {
            step11Element.style.display = 'flex';
        }
    }
    
    if (dot11) {
        dot11.style.display = isUnder18() ? 'inline-block' : 'none';
    }
    
    // Mettre à jour le texte du bouton de l'étape 10
    if (btnStep10Next) {
        if (!isUnder18()) {
            btnStep10Next.textContent = 'Je valide mes informations';
            btnStep10Next.className = 'btn-submit';
            btnStep10Next.onclick = function() { submitForm(); };
        } else {
            btnStep10Next.textContent = 'Suivant';
            btnStep10Next.className = 'btn-next';
            btnStep10Next.onclick = function() { nextStep(); };
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
    
    // Vérifier l'âge au chargement initial
    checkAgeAndUpdateStep11();
});
