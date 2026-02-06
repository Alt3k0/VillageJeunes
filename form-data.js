// Données des provinces, communes et quartiers pour le formulaire d'inscription
// Toutes les données sont corrigées pour les problèmes d'encodage

// ============================================
// PROVINCE SUD - Communes et Quartiers
// ============================================
const communesSud = {
    "Boulouparis": [
        "Boulouparis (chef-lieu)",
        "Bouraké",
        "Gilles (Boulouparis)",
        "Kouerga",
        "Nassirah",
        "Nété",
        "Ouamén",
        "Ouinané",
        "Ouitchambo",
        "Tomo"
    ],
    "Bourail": [
        "Azareu",
        "Bouirou",
        "Gouaro",
        "Nandaï",
        "Néméa",
        "Nessadiou",
        "Ny (Bourail)",
        "Roche Percée (Bourail)",
        "Oua-Oué",
        "Poté",
        "Poé"
    ],
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
    "Farino": [
        "Fonwhary",
        "Farino (chef-lieu)"
    ],
    "La Foa": [
        "Coindé",
        "La Foa (chef-lieu)",
        "Forêt Noire (La Foa)",
        "Oua-Tom",
        "Oui-Poin",
        "Pocquereux Kouma"
    ],
    "Île des Pins": [
        "Comagna",
        "Gadji",
        "Koutoumo",
        "Ouatchia",
        "Touété",
        "Vao",
        "Wapan",
        "Wapwangé",
        "Youati"
    ],
    "Moindou": [
        "Kéré",
        "Momé",
        "Moindou (chef-lieu)",
        "Téremba"
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
        "Ouémo",
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
        "Tindu",
        "Quartiers de Nouméa"
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
    "Sarraméa": [
        "Sarraméa (chef-lieu)",
        "Petit Couli",
        "Grand Couli"
    ],
    "Thio": [
        "Grand Borendy",
        "Petit Borendy",
        "Ouindo",
        "Les Pétroglyphes",
        "Saint-Jean-Baptiste (Thio)",
        "Saint-Joseph (Thio)",
        "Saint-Michel (Thio)",
        "Saint-Paul (Thio)",
        "Saint-Pierre (Thio)",
        "Saint-Roch (Thio)",
        "Saint-Philippo 1",
        "Saint-Philippo 2",
        "Thio (chef-lieu)"
    ],
    "Yaté": [
        "Goro (Yaté)",
        "Touaourou",
        "Unia (Yaté)",
        "Waho",
        "Yaté (chef-lieu)"
    ],
    "Poya (partie sud)": []
};

// ============================================
// PROVINCE NORD - Communes et Quartiers
// ============================================
const communesNord = {
    "Poya (partie nord)": [],
    "Pouembout": [],
    "Koné": [],
    "Voh": [],
    "Kaala-Gomen": [],
    "Koumac": [],
    "Poum": [],
    "Îles Belep": [],
    "Ouégoa": [],
    "Pouébo": [],
    "Hienghène": [],
    "Touho": [],
    "Poindimié": [],
    "Ponérihouen": [],
    "Houaïlou": [],
    "Kouaoua": [],
    "Canala": []
};

// ============================================
// ÎLES LOYAUTÉ - Communes et Districts coutumiers
// ============================================
const communesIles = {
    "Ouvéa": [
        "Fayaoué",
        "Mouli",
        "Imone",
        "Saint Joseph",
        "Takedji"
    ],
    "Lifou": [
        "Wetr",
        "Gaica",
        "Lösi"
    ],
    "Maré": [
        "Guahma",
        "Pénélo",
        "La Roche",
        "Tadine",
        "Tawainèdre",
        "Eni",
        "Medu",
        "Wabao"
    ]
};

// ============================================
// ÉTABLISSEMENTS SCOLAIRES
// ============================================

// Collèges publics
const collegesPublics = [
    "Bourail - Collège Louis-Léopold DJIET - SEG",
    "Canala - Collège de Canala et GOD de Kouaoua",
    "Dumbéa - Collège Apogo",
    "Dumbéa - Collège d'Auteuil - Edmée VARIN",
    "Dumbéa - Collège de Dumbéa-sur-mer",
    "Dumbéa - Collège de Katiramona Jean Fayard",
    "Dumbéa - Collège de Koutio Francis Carco - SEG",
    "Hienghène - Collège Pai-Kaleo",
    "Houaïlou - Collège de Wani - SEG",
    "Koné - Collège de Koné - SEG",
    "Koné - Collège de Païamboué",
    "Koumac - Collège de Koumac - SEGPA et AL",
    "La Foa - Collège Théodore Kawa Braïno",
    "Lifou - Collège Laura Boula - SEGPA et GOD de Mo",
    "Maré - Collège de La Roche - SEG",
    "Maré - Collège de Tadine",
    "Mont-Dore - Collège de Boulari et SEGPA",
    "Mont-Dore - Collège de Plum",
    "Nouméa - Collège de Kaméré",
    "Nouméa - Collège de Normandie et SEG",
    "Nouméa - Collège de Tuband",
    "Nouméa - Collège François Ollivaud (Portes de Fer) et SEG",
    "Nouméa - Collège Georges Baudoux",
    "Nouméa - Collège Jean Lèques (Magenta) et SEG",
    "Nouméa - Collège Jean Mariot",
    "Ouégoa - Collège de Ouégoa",
    "Ouvéa - Collège Shéa Tiaou",
    "Païta - Collège Gabriel Païta (Païta Nord)",
    "Païta - Collège Louise Michel",
    "Poindimié - Collège Raymond Vauthier et SEG",
    "Poya - Collège Essau Voudjo",
    "Thio - Collège La colline",
    "Yaté - Collège de Yaté"
];

// Collèges privés
const collegesPrives = [
    "Bourail - Collège Sacré-Cœur (DDEC)",
    "Île des Pins - Collège Saint-Joseph (DDEC)",
    "Kaala Gomen - Collège Baganda (EPKNC)",
    "La Foa - Collège Saint-Dominique Savio (DDEC)",
    "Lifou - Collège de Hnaizianu (EPKNC)",
    "Lifou - Collège de Hnathalo (DDEC)",
    "Lifou - Collège de Havila (EPKNC)",
    "Maré - Collège Taremen (EPKNC)",
    "Mont-Dore - Collège de La Conception (DDEC)",
    "Nouméa - Collège Champagnat (DDEC)",
    "Nouméa - Collège St Joseph de Cluny (DDEC)",
    "Ouvéa - Collège Eben-Eza (EPKNC)",
    "Ouvéa - Collège Guillaume Douarre (DDEC)",
    "Païta - Collège Sainte-Marie et SEGPA (DDEC)",
    "Poindimié - Collège Jean-Baptiste Vigouroux (DDEC)",
    "Ponérihouen - Collège de Mou (FELP)",
    "Ponérihouen - Collège Yves-Marie Hily (DDEC)",
    "Pouébo - Collège Hippolyte Bonou et SEGPA (DDEC)",
    "Poum - Collège Raymond Boaouva Kaleba (EPKNC)",
    "Thio - Collège Francis Rougé (DDEC)",
    "Voh - Collège de Tiéta (FELP)"
];

// Lycées publics
const lyceesPublics = [
    "Dumbéa - Lycée Dick Ukeiwé",
    "Lifou - Lycée polyvalent Williama Haudra",
    "Mont-Dore - Lycée polyvalent du Mont-Dore",
    "Nouméa - Lycée polyvalent Jules Garnier",
    "Nouméa - Lycée professionnel commercial et hôtelier A. Escoffier",
    "Nouméa - Lycée professionnel Péro Attiti",
    "Nouméa - Lycée Lapérouse",
    "Poindimié - Lycée Antoine Kela",
    "Pouembout - Lycée polyvalent Michel Rocard",
    "Touho - Lycée professionnel Augustin Ty"
];

// Lycées privés
const lyceesPrives = [
    "Bourail - Lycée professionnel François d'Assise (DDEC)",
    "Bourail - Lycée professionnel Père Guéneau (DDEC)",
    "Houaïlou - Lycée agricole Do Néva (EPKNC)",
    "Mont-Dore - Lycée professionnel Saint Pierre Chanel (DDEC)",
    "Nouméa - Lycée Blaise Pascal (DDEC)",
    "Nouméa - Lycée polyvalent Do Kamo (EPKNC)",
    "Nouméa - Lycée professionnel Saint Joseph de Cluny (DDEC)",
    "Païta - Lycée Apollinaire Anova (DDEC)",
    "Païta - Lycée professionnel Jean XXIII (DDEC)",
    "Païta - Lycée professionnel Marcellin Champagnat (DDEC)",
    "Pouébo - Lycée professionnel Gabriel Rivat (DDEC)"
];

// ============================================
// FONCTIONS POUR LES MENUS DÉROULANTS
// ============================================

// Fonction pour charger les provinces dans le select
function loadProvinces() {
    const selectProvince = document.getElementById('province-select');
    if (selectProvince) {
        selectProvince.innerHTML = '<option value="">Sélectionnez une province</option>';
        const provinces = ['Province Sud', 'Province Nord', 'Îles Loyauté'];
        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province;
            option.textContent = province;
            selectProvince.appendChild(option);
        });
    }
}

// Fonction pour charger les communes selon la province sélectionnée
function loadCommunes(province) {
    const selectCommune = document.getElementById('commune-select');
    const inputVilleVillageTribu = document.getElementById('ville-village-tribu-input');
    const containerQuartier = document.getElementById('quartier-container');
    const containerDistrict = document.getElementById('district-container');
    const labelCommune = document.getElementById('commune-label');
    const labelQuartier = document.getElementById('quartier-label');
    
    if (!selectCommune) return;
    
    // Réinitialiser les champs
    selectCommune.innerHTML = '<option value="">Sélectionnez une commune</option>';
    selectCommune.style.display = 'none';
    selectCommune.disabled = true;
    selectCommune.removeAttribute('required');
    
    if (inputVilleVillageTribu) {
        inputVilleVillageTribu.style.display = 'none';
        inputVilleVillageTribu.value = '';
        inputVilleVillageTribu.removeAttribute('required');
    }
    
    if (containerQuartier) {
        containerQuartier.style.display = 'none';
    }
    
    if (containerDistrict) {
        containerDistrict.style.display = 'none';
    }
    
    if (!province) {
        if (labelCommune) labelCommune.textContent = 'Commune:';
        if (labelQuartier) labelQuartier.textContent = 'Quartier:';
        return;
    }
    
    if (province === 'Province Sud') {
        // Afficher le select commune et charger les communes de la Province Sud
        selectCommune.style.display = 'block';
        selectCommune.disabled = false;
        selectCommune.setAttribute('required', 'required');
        
        if (labelCommune) labelCommune.textContent = 'Commune:';
        if (labelQuartier) {
            labelQuartier.textContent = 'Quartier:';
            labelQuartier.style.display = 'block';
        }
        
        // Réorganiser : Nouméa en premier, puis les autres par ordre alphabétique
        const communes = Object.keys(communesSud);
        const communesTriees = [];
        
        if (communes.includes("Nouméa")) {
            communesTriees.push("Nouméa");
        }
        
        communes.filter(c => c !== "Nouméa").sort().forEach(commune => {
            communesTriees.push(commune);
        });
        
        communesTriees.forEach(commune => {
            const option = document.createElement('option');
            option.value = commune;
            option.textContent = commune;
            selectCommune.appendChild(option);
        });
        
        // Afficher le container quartier
        if (containerQuartier) {
            containerQuartier.style.display = 'block';
        }
        
    } else if (province === 'Province Nord') {
        // Afficher le select commune et charger les communes de la Province Nord
        selectCommune.style.display = 'block';
        selectCommune.disabled = false;
        selectCommune.setAttribute('required', 'required');
        
        // Cacher le champ texte Ville/Village/Tribu
        if (inputVilleVillageTribu) {
            inputVilleVillageTribu.style.display = 'none';
            inputVilleVillageTribu.removeAttribute('required');
        }
        
        if (labelCommune) labelCommune.textContent = 'Commune:';
        if (labelQuartier) {
            labelQuartier.textContent = 'Quartier:';
            labelQuartier.style.display = 'block';
        }
        
        // Charger les communes de la Province Nord
        const communes = Object.keys(communesNord);
        communes.sort().forEach(commune => {
            const option = document.createElement('option');
            option.value = commune;
            option.textContent = commune;
            selectCommune.appendChild(option);
        });
        
        // Afficher le container quartier
        if (containerQuartier) {
            containerQuartier.style.display = 'block';
        }
        
        // Cacher le container district
        if (containerDistrict) {
            containerDistrict.style.display = 'none';
        }
        
    } else if (province === 'Îles Loyauté') {
        // Pour les Îles : afficher le select avec les communes et le container district
        selectCommune.style.display = 'block';
        selectCommune.disabled = false;
        selectCommune.setAttribute('required', 'required');
        
        if (labelCommune) labelCommune.textContent = 'Commune:';
        if (labelQuartier) {
            labelQuartier.textContent = 'District coutumier:';
            labelQuartier.style.display = 'block';
        }
        
        const communes = Object.keys(communesIles);
        communes.forEach(commune => {
            const option = document.createElement('option');
            option.value = commune;
            option.textContent = commune;
            selectCommune.appendChild(option);
        });
        
        // Afficher le container district
        if (containerDistrict) {
            containerDistrict.style.display = 'block';
        }
    }
}

// Fonction pour charger les quartiers selon la commune sélectionnée (Province Sud et Province Nord)
function loadQuartiers(commune) {
    const selectQuartier = document.getElementById('quartier-select');
    const inputQuartier = document.getElementById('quartier-input');
    const provinceSelect = document.getElementById('province-select');
    const province = provinceSelect ? provinceSelect.value : '';
    
    if (!selectQuartier || !inputQuartier) return;
    
    // Déterminer quelle structure de données utiliser selon la province
    let communesData = null;
    if (province === 'Province Sud') {
        communesData = communesSud;
    } else if (province === 'Province Nord') {
        communesData = communesNord;
    }
    
    if (!commune || !communesData || !communesData[commune]) {
        // Si pas de quartiers pour cette commune, afficher l'input texte
        inputQuartier.style.display = 'block';
        inputQuartier.setAttribute('required', 'required');
        inputQuartier.name = 'quartier';
        selectQuartier.style.display = 'none';
        selectQuartier.removeAttribute('required');
        selectQuartier.name = 'quartier-select';
        selectQuartier.value = '';
        return;
    }
    
    const quartiers = communesData[commune];
    
    if (quartiers.length === 0) {
        // Si pas de quartiers, afficher l'input texte
        inputQuartier.style.display = 'block';
        inputQuartier.setAttribute('required', 'required');
        inputQuartier.name = 'quartier';
        selectQuartier.style.display = 'none';
        selectQuartier.removeAttribute('required');
        selectQuartier.name = 'quartier-select';
        selectQuartier.value = '';
    } else {
        // Afficher le select avec les quartiers
        selectQuartier.innerHTML = '<option value="">Sélectionnez un quartier</option>';
        quartiers.forEach(quartier => {
            const option = document.createElement('option');
            option.value = quartier;
            option.textContent = quartier;
            selectQuartier.appendChild(option);
        });
        selectQuartier.style.display = 'block';
        selectQuartier.setAttribute('required', 'required');
        selectQuartier.name = 'quartier';
        inputQuartier.style.display = 'none';
        inputQuartier.removeAttribute('required');
        inputQuartier.name = 'quartier-input';
    }
}

// Fonction pour charger les districts coutumiers (Îles Loyauté)
function loadDistrictsCoutumiers(commune) {
    const selectDistrict = document.getElementById('district-select');
    const inputDistrict = document.getElementById('district-input');
    
    if (!selectDistrict || !inputDistrict) return;
    
    if (!commune || !communesIles[commune]) {
        selectDistrict.style.display = 'none';
        inputDistrict.style.display = 'block';
        inputDistrict.setAttribute('required', 'required');
        inputDistrict.name = 'district';
        selectDistrict.removeAttribute('required');
        selectDistrict.name = 'district-select';
        selectDistrict.value = '';
        return;
    }
    
    const districts = communesIles[commune];
    
    if (districts.length === 0) {
        inputDistrict.style.display = 'block';
        inputDistrict.setAttribute('required', 'required');
        inputDistrict.name = 'district';
        selectDistrict.style.display = 'none';
        selectDistrict.removeAttribute('required');
        selectDistrict.name = 'district-select';
        selectDistrict.value = '';
    } else {
        selectDistrict.innerHTML = '<option value="">Sélectionnez un district coutumier</option>';
        districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            selectDistrict.appendChild(option);
        });
        selectDistrict.style.display = 'block';
        selectDistrict.setAttribute('required', 'required');
        selectDistrict.name = 'district';
        inputDistrict.style.display = 'none';
        inputDistrict.removeAttribute('required');
        inputDistrict.name = 'district-input';
    }
}

// Fonction pour charger les établissements selon le type sélectionné (Collège, Lycée ou Etudes sup)
function loadEtablissements(type) {
    console.log('loadEtablissements appelée avec type:', type);
    const selectEtablissement = document.getElementById('etablissement-select');
    const etudesSupFields = document.getElementById('etudes-sup-fields');
    
    if (!selectEtablissement) {
        console.error('selectEtablissement non trouvé');
        return;
    }
    
    // Si "Etudes sup" est sélectionné, afficher le champ texte et masquer le select
    if (type === 'EtudesSup') {
        if (etudesSupFields) {
            etudesSupFields.style.display = 'block';
        }
        selectEtablissement.style.display = 'none';
        selectEtablissement.disabled = true;
        selectEtablissement.value = '';
        return;
    }
    
    // Sinon, masquer le champ texte et afficher le select
    if (etudesSupFields) {
        etudesSupFields.style.display = 'none';
        const inputEtudesSup = etudesSupFields.querySelector('input[name="etudesSup"]');
        if (inputEtudesSup) inputEtudesSup.value = '';
    }
    selectEtablissement.style.display = 'block';
    
    selectEtablissement.innerHTML = '<option value="">Sélectionnez un établissement</option>';
    selectEtablissement.disabled = true;
    
    if (!type) {
        console.log('Aucun type sélectionné');
        return;
    }
    
    let etablissements = [];
    
    if (type === 'College') {
        // Mélanger les collèges publics et privés
        etablissements = [...collegesPublics, ...collegesPrives];
        // Trier par ordre alphabétique
        etablissements.sort();
        console.log('Collèges chargés:', etablissements.length);
    } else if (type === 'Lycee') {
        // Mélanger les lycées publics et privés
        etablissements = [...lyceesPublics, ...lyceesPrives];
        // Trier par ordre alphabétique
        etablissements.sort();
        console.log('Lycées chargés:', etablissements.length);
    } else {
        console.log('Type non reconnu:', type);
        return;
    }
    
    etablissements.forEach(etablissement => {
        const option = document.createElement('option');
        option.value = etablissement;
        option.textContent = etablissement;
        selectEtablissement.appendChild(option);
    });
    
    selectEtablissement.disabled = false;
    console.log('Menu établissement activé');
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    loadProvinces();
    
    // Écouter les changements sur le select province
    const selectProvince = document.getElementById('province-select');
    if (selectProvince) {
        selectProvince.addEventListener('change', function() {
            // Charger les communes pour la province sélectionnée
            loadCommunes(this.value);
            
            // Réinitialiser le select commune
            const selectCommune = document.getElementById('commune-select');
            if (selectCommune) {
                selectCommune.value = '';
            }
            // Réinitialiser les quartiers/districts
            const selectQuartier = document.getElementById('quartier-select');
            const inputQuartier = document.getElementById('quartier-input');
            const selectDistrict = document.getElementById('district-select');
            const inputDistrict = document.getElementById('district-input');
            if (selectQuartier) selectQuartier.value = '';
            if (inputQuartier) inputQuartier.value = '';
            if (selectDistrict) selectDistrict.value = '';
            if (inputDistrict) inputDistrict.value = '';
        });
    }
    
    // Écouter les changements sur le select commune
    const selectCommune = document.getElementById('commune-select');
    if (selectCommune) {
        selectCommune.addEventListener('change', function() {
            const province = document.getElementById('province-select')?.value;
            if (province === 'Province Sud') {
                loadQuartiers(this.value);
            } else if (province === 'Îles Loyauté') {
                loadDistrictsCoutumiers(this.value);
            }
        });
    }
    
    // Écouter les changements sur le select type d'établissement
    // Utiliser une délégation d'événements pour gérer les éléments créés dynamiquement
    // Cela fonctionne même si le champ est masqué au départ
    document.addEventListener('change', function(e) {
        if (e.target && e.target.id === 'type-etablissement-select') {
            console.log('Changement détecté sur type-etablissement-select:', e.target.value);
            loadEtablissements(e.target.value);
        }
    });
});
