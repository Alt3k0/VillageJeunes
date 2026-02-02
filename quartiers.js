// Données des quartiers organisées par ville
const quartiersParVille = {
    "Dumbéa": [
        "Auteuil",
        "Cœur de ville",
        "Dumbéa (chef-lieu)",
        "Dumbéa-sur-mer",
        "Katiramona Sud",
        "Koghis",
        "Koutio",
        "La Couvelée",
        "Nakutakoin",
        "Nondoué",
        "Plaine de Koé"
    ],
    "Mont-Dore": [
        "Boulari (chef-lieu)",
        "Grand Sud",
        "Île Ouen",
        "La Conception",
        "La Coulée",
        "Lembi-Mouirange",
        "Mont-Dore Sud",
        "Plum",
        "Pont-des-Français",
        "Prony",
        "Robinson",
        "Saint-Louis",
        "Saint-Michel",
        "Vallon-Dore",
        "Yahoué"
    ],
    "Païta": [
        "Bangou",
        "Col de la pirogue",
        "Katiranoma",
        "Kokorét",
        "Makou",
        "Mont Mou",
        "Naniouni",
        "N'dé",
        "Ondémi",
        "Onghoué",
        "Païta centre (chef-lieu)",
        "Plaine aux cailloux",
        "Port Laguerre",
        "Sanatorium (Païta)",
        "Saint-Laurent (Païta)",
        "Savannah",
        "Scheffleras",
        "Tamoa",
        "Timbia",
        "Tongouin",
        "Tontouta"
    ],
    "Nouméa": [
        "Centre-Ville",
        "Nouville",
        "Quartier latin",
        "Vallée du Général",
        "Artillerie",
        "Montravel",
        "Montagne coupée",
        "Vallée du Tir",
        "Doniambo",
        "Orphelinat",
        "Baie des Citrons",
        "Anse Vata",
        "Val Plaisance",
        "N'Géa",
        "Receiving",
        "Motor Pool",
        "Trianon",
        "Vallée des Colons",
        "Faubourg Blanchot",
        "Haut-Magenta",
        "Magenta",
        "Ouémé",
        "Aérodrome",
        "Portes de fer",
        "4e Kilomètre",
        "Rivière Salée",
        "6e Kilomètre",
        "7e Kilomètre",
        "Normandie",
        "Tina",
        "Golf de Tina",
        "Ducos",
        "Ducos industriel",
        "Kaméré",
        "Koumourou",
        "Logicoop",
        "Numbo",
        "Tindu"
    ]
};

// Fonction pour charger les villes dans le select ville
function loadVilles() {
    const selectVille = document.querySelector('[name="ville"]');
    if (selectVille) {
        // Vider le select (enlever l'option par défaut)
        selectVille.innerHTML = '';
        
        // Réorganiser les villes : Nouméa en premier, puis les autres par ordre alphabétique
        const villes = Object.keys(quartiersParVille);
        const villesTriees = [];
        
        // Mettre Nouméa en premier si elle existe
        if (villes.includes("Nouméa")) {
            villesTriees.push("Nouméa");
        }
        
        // Ajouter les autres villes par ordre alphabétique (sauf Nouméa déjà ajoutée)
        villes.filter(ville => ville !== "Nouméa").sort().forEach(ville => {
            villesTriees.push(ville);
        });
        
        // Ajouter les villes dans l'ordre
        villesTriees.forEach(ville => {
            const option = document.createElement('option');
            option.value = ville;
            option.textContent = ville;
            selectVille.appendChild(option);
        });
        
        // Ajouter "Autres" en dernier
        const autresOption = document.createElement('option');
        autresOption.value = "";
        autresOption.textContent = "Autres";
        selectVille.appendChild(autresOption);
    }
}

// Fonction pour basculer entre input text et select selon la ville
function toggleQuartierField(ville) {
    const inputQuartier = document.getElementById('quartier-input');
    const selectQuartier = document.getElementById('quartier-select');
    
    if (!inputQuartier || !selectQuartier) return;
    
    // Si "Autres" est sélectionné (valeur vide), afficher l'input text
    if (!ville || ville === "") {
        inputQuartier.style.display = 'block';
        inputQuartier.required = true;
        inputQuartier.setAttribute('required', 'required');
        selectQuartier.style.display = 'none';
        selectQuartier.removeAttribute('required');
        selectQuartier.name = 'quartier-select'; // Garder un name différent pour éviter les conflits
        inputQuartier.name = 'quartier'; // Le name principal pour la soumission
        selectQuartier.value = ''; // Réinitialiser la valeur
    } else {
        // Sinon, afficher le select avec les quartiers de la ville
        inputQuartier.style.display = 'none';
        inputQuartier.removeAttribute('required');
        inputQuartier.name = 'quartier-input'; // Changer le name pour éviter les conflits
        selectQuartier.style.display = 'block';
        selectQuartier.required = true;
        selectQuartier.setAttribute('required', 'required');
        selectQuartier.name = 'quartier'; // Le name principal pour la soumission
        loadQuartiers(ville, selectQuartier);
    }
}

// Fonction pour charger les quartiers selon la ville sélectionnée
function loadQuartiers(ville, selectElement) {
    if (!selectElement) {
        selectElement = document.getElementById('quartier-select');
    }
    
    if (selectElement && ville && quartiersParVille[ville]) {
        // Vider le select
        selectElement.innerHTML = '<option value="">Sélectionnez un quartier</option>';
        
        // Charger les quartiers de la ville
        quartiersParVille[ville].forEach(quartier => {
            const option = document.createElement('option');
            option.value = quartier;
            option.textContent = quartier;
            selectElement.appendChild(option);
        });
        // Activer le select quartier
        selectElement.disabled = false;
    } else if (selectElement) {
        // Désactiver le select quartier si aucune ville valide n'est sélectionnée
        selectElement.disabled = true;
    }
}

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    loadVilles();
    
    // Afficher l'input text par défaut (car "Autres" est sélectionné)
    toggleQuartierField("");
    
    // Écouter les changements sur le select ville
    const selectVille = document.querySelector('[name="ville"]');
    if (selectVille) {
        selectVille.addEventListener('change', function() {
            toggleQuartierField(this.value);
        });
    }
});
