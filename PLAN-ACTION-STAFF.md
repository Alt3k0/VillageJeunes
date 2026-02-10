# 🎯 Plan d'Action - Partie Staff

## 📋 Vue d'ensemble

Ce document présente le plan d'action pour compléter la partie **Staff** du frontend. L'objectif est de finaliser toutes les fonctionnalités staff avant de passer à d'autres parties du projet.

---

## ✅ État Actuel - Pages Complétées

### 1. **Accueil Staff** (`accueil-staff.html`) ✅
- ✅ Calendrier des activités (vue mensuelle)
- ✅ Calendrier des salles occupées (vue mensuelle)
- ✅ Switch entre activités et salles
- ✅ Widget d'emploi du temps (affichage des activités d'une journée)
- ✅ Widget d'ajout d'activité (formulaire complet)
- ✅ Suppression d'activités individuelles
- ✅ Recherche d'activités avec menu déroulant
- ✅ Affichage des activités par catégorie

**Variables à intégrer :**
- `{activity_*}` (voir README-BACKEND-VARIABLES.md)
- `{salle_*}` (voir README-BACKEND-VARIABLES.md)

---

### 2. **Informations Adhérent** (`informations-adherent.html`) ✅
- ✅ Liste des adhérents, bénévoles et partenaires
- ✅ Switch entre les 3 catégories
- ✅ Recherche par nom/numéro
- ✅ Cards avec photo, nom, rôle, numéro
- ✅ Boutons de suppression sur toutes les catégories

**Variables à intégrer :**
- `{member_*}` (voir README-BACKEND-VARIABLES.md)

---

### 3. **Validation Inscription** (`validation-inscription.html`) ✅
- ✅ Liste des adhérents, bénévoles et partenaires
- ✅ Switch entre les 3 catégories
- ✅ Recherche par nom/numéro
- ✅ Cards avec photo, nom, rôle, numéro
- ✅ Pas de boutons de suppression (validation uniquement)

**Variables à intégrer :**
- `{member_*}` (voir README-BACKEND-VARIABLES.md)
- `{inscription_status}` (à définir avec le backend)

---

### 4. **Gestion de l'Équipe** (`gestion-equipe.html`) ✅
- ✅ Liste des bénévoles uniquement
- ✅ Recherche par nom/numéro
- ✅ Cards avec photo, nom, rôle, numéro
- ✅ Boutons de suppression

**Variables à intégrer :**
- `{member_*}` (voir README-BACKEND-VARIABLES.md)

---

## 🚧 Pages à Créer

### 5. **Statistiques** (`statistiques.html`) 🔲
**Priorité :** Moyenne

**Fonctionnalités prévues :**
- Graphiques et statistiques sur les adhérents
- Statistiques sur les activités (fréquentation, participation)
- Statistiques sur les bénévoles
- Statistiques sur les salles (taux d'occupation)
- Périodes sélectionnables (mois, trimestre, année)

**Variables nécessaires :**
- `{stats_adherents_total}`
- `{stats_adherents_nouveaux}`
- `{stats_activites_total}`
- `{stats_activites_participants}`
- `{stats_salles_occupation}`
- `{stats_benevoles_total}`

**Design :** À définir (peut s'inspirer du design existant)

---

### 6. **Profil Staff** (`profil-staff.html`) 🔲
**Priorité :** Faible

**Fonctionnalités prévues :**
- Affichage des informations du staff connecté
- Modification du profil
- Changement de mot de passe
- Paramètres de compte

**Variables nécessaires :**
- `{staff_id}`
- `{staff_nom}`
- `{staff_prenom}`
- `{staff_email}`
- `{staff_role}`
- `{staff_photo}`

**Design :** À définir (peut s'inspirer du design existant)

---

## 🔧 Fonctionnalités à Ajouter/Améliorer

### **Widgets et Modals**

#### A. **Modal Détails Membre** 🔲
**Pages concernées :** `informations-adherent.html`, `validation-inscription.html`, `gestion-equipe.html`

**Fonctionnalités :**
- Clic sur une card → ouverture d'un modal avec détails complets
- Affichage de toutes les informations du membre
- Historique des activités/inscriptions
- Actions possibles (modifier, supprimer, etc.)

**Variables nécessaires :**
- `{member_*}` (toutes les variables membres)
- `{member_historique_activites}`
- `{member_date_inscription}`

---

#### B. **Widget Validation Inscription** 🔲
**Page concernée :** `validation-inscription.html`

**Fonctionnalités :**
- Clic sur une card → ouverture d'un widget de validation
- Affichage du formulaire d'inscription complet
- Boutons "Valider" et "Refuser"
- Génération automatique d'ID et mot de passe (si nécessaire)

**Variables nécessaires :**
- `{inscription_data}` (toutes les données du formulaire)
- `{inscription_id}`
- `{validation_status}`

---

#### C. **Widget Ajout Bénévole** 🔲
**Page concernée :** `gestion-equipe.html`

**Fonctionnalités :**
- Bouton "Ajouter un bénévole"
- Formulaire d'ajout
- Champs : nom, prénom, email, téléphone, etc.

**Variables nécessaires :**
- `{benevole_*}` (variables membres)

---

### **Améliorations UX**

#### A. **Pagination** 🔲
**Pages concernées :** Toutes les pages avec listes

**Fonctionnalités :**
- Pagination si plus de X résultats (à définir)
- Navigation page précédente/suivante

---

#### B. **Filtres Avancés** 🔲
**Pages concernées :** `informations-adherent.html`, `validation-inscription.html`

**Fonctionnalités :**
- Filtres par date d'inscription
- Filtres par statut
- Filtres par catégorie (pour validation inscription)

---

#### C. **Export de Données** 🔲
**Pages concernées :** Toutes les pages avec listes

**Fonctionnalités :**
- Export CSV/Excel des listes
- Export PDF (optionnel)

---

## 📊 Priorisation

### **Phase 1 - Intégration Backend** 🔴 **PRIORITÉ HAUTE**
1. Remplacer tous les placeholders `{nom_variable}` par les vraies variables backend
2. Connecter les endpoints API
3. Tester toutes les fonctionnalités CRUD
4. Gérer les erreurs API

**Pages concernées :** Toutes les pages existantes

---

### **Phase 2 - Widgets Essentiels** 🟡 **PRIORITÉ MOYENNE**
1. Modal détails membre
2. Widget validation inscription
3. Widget ajout bénévole

**Pages concernées :** `informations-adherent.html`, `validation-inscription.html`, `gestion-equipe.html`

---

### **Phase 3 - Pages Manquantes** 🟢 **PRIORITÉ MOYENNE**
1. Page Statistiques
2. Page Profil Staff

---

### **Phase 4 - Améliorations UX** 🔵 **PRIORITÉ BASSE**
1. Pagination
2. Filtres avancés
3. Export de données

---

## 📝 Notes Techniques

### **Format des Variables**
- Utiliser le format `{nom_variable}` pour tous les placeholders
- Documenter chaque nouvelle variable dans `README-BACKEND-VARIABLES.md`
- S'assurer de la cohérence avec les choix du backend

### **Structure des Données**
- Respecter les formats JSON définis dans le README
- Adapter si le backend propose une structure différente (priorité au backend)

### **Gestion des Erreurs**
- Prévoir des messages d'erreur clairs
- Gérer les cas où les données sont vides/null
- Prévoir des états de chargement

---

## ✅ Checklist Finale

Avant de considérer la partie Staff comme complète :

- [ ] Toutes les pages existantes fonctionnent avec les vraies données backend
- [ ] Tous les placeholders sont remplacés
- [ ] Tous les endpoints API sont connectés
- [ ] Les widgets essentiels sont implémentés
- [ ] Les pages manquantes sont créées
- [ ] Les tests fonctionnels sont passés
- [ ] La documentation est à jour
- [ ] Le code est propre et commenté

---

**Dernière mise à jour :** Février 2026  
**Version :** 1.0
