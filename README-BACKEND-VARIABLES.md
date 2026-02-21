# 📋 Documentation des Variables Backend - Partie Staff

## 📌 Introduction

Ce document répertorie **uniquement les variables nécessaires et suffisantes** pour la partie **Staff** du frontend. Les variables sont représentées par des placeholders au format `{nom_variable}` qui devront être remplacés par les vraies variables du backend.

**Format des placeholders :** `{nom_variable}` (exemple: `{member_id}`, `{activity_title}`)

**Principe :** Simple, clair, sécurisé, conforme aux bonnes pratiques modernes.

---

## 🔐 Authentification

**Note :** La gestion de l'authentification et de la sécurité est entièrement gérée par le backend (cookies, sessions, tokens, etc.). Le frontend n'a pas besoin de variables spécifiques pour la sécurité.

---

## 👤 Variables Membres/Utilisateurs

Ces variables sont utilisées dans les pages `informations-adherent.html`, `validation-inscription.html` et `gestion-equipe.html`.

| Placeholder | Type | Description | Utilisation |
|------------|------|-------------|-------------|
| `{member_id}` | String/Number | Identifiant unique du membre | Identifiant pour les opérations CRUD |
| `{member_nom}` | String | Nom de famille du membre | Affichage dans la card et recherche |
| `{member_prenom}` | String | Prénom du membre | Affichage dans la card et recherche |
| `{member_numero}` | String | Numéro d'adhérent/bénévole/partenaire | Affichage et recherche (format: "0001", "0002", etc.) |
| `{member_role}` | String | Rôle du membre | Valeurs: "Adhérent", "Bénévole", "Partenaire" |
| `{member_photo}` | String (URL) | URL de la photo de profil | Affichage de l'avatar (optionnel, peut être null) |

**Structure JSON attendue :**
```json
{
  "id": "{member_id}",
  "nom": "{member_nom}",
  "prenom": "{member_prenom}",
  "numero": "{member_numero}",
  "role": "{member_role}",
  "photo": "{member_photo}"
}
```

**Note :** La recherche fonctionne sur `nom`, `prenom` et `numero`. Elle est effectuée côté frontend mais peut être optimisée côté backend avec un endpoint de recherche.

---

## 🎯 Variables Activités

Ces variables sont utilisées dans `accueil-staff.html` pour le calendrier des activités et l'emploi du temps.

| Placeholder | Type | Description | Utilisation |
|------------|------|-------------|-------------|
| `{activity_id}` | String/Number | Identifiant unique de l'activité | Identifiant pour suppression/modification |
| `{activity_title}` | String | Nom de l'activité | Affichage dans le calendrier et les cards |
| `{activity_category}` | String | Catégorie de l'activité | Valeurs: "numerique", "arts-vivants", "projet-pro", "solidarite" |
| `{activity_category_name}` | String | Nom affiché de la catégorie | Valeurs: "Numérique", "Arts vivants", "Projet pro", "Solidarité" |
| `{activity_category_color}` | String (Hex) | Couleur associée à la catégorie | Couleurs: "#1f658e", "#f08d35", "#9b59b6", "#649d50" |
| `{activity_date}` | String | Date de l'activité | Format: "YYYY-MM-DD" (ex: "2026-02-15") |
| `{activity_time}` | String | Heure affichée | Format: "09h00 - 11h00" |
| `{activity_time_start}` | String | Heure de début | Format: "HH:mm" (ex: "09:00") - pour création/modification |
| `{activity_time_end}` | String | Heure de fin | Format: "HH:mm" (ex: "11:00") - pour création/modification |
| `{activity_location}` | String | Salle où se déroule l'activité | Valeurs: "Salle du Vent", "Salle du Feu", "Salle de l'Eau", "Salle de la Terre + patio", "Salle de formation", "Accueil" |
| `{activity_description}` | String | Description détaillée | Texte long affiché dans les widgets (optionnel) |
| `{activity_responsible}` | String | Nom du bénévole/animateur responsable | Affichage du nom du responsable |
| `{activity_max_participants}` | Number | Nombre maximum de participants | Limite d'inscriptions (optionnel) |
| `{activity_current_participants}` | Number | Nombre actuel de participants | Compteur d'inscriptions (optionnel) |
| `{activity_is_complete}` | Boolean | Statut de complétude | true si complet, false si disponible (optionnel) |

**Structure JSON attendue :**
```json
{
  "id": "{activity_id}",
  "title": "{activity_title}",
  "category": "{activity_category}",
  "categoryName": "{activity_category_name}",
  "categoryColor": "{activity_category_color}",
  "date": "{activity_date}",
  "time": "{activity_time}",
  "timeStart": "{activity_time_start}",
  "timeEnd": "{activity_time_end}",
  "location": "{activity_location}",
  "description": "{activity_description}",
  "responsible": "{activity_responsible}",
  "maxParticipants": {activity_max_participants},
  "currentParticipants": {activity_current_participants},
  "isComplete": {activity_is_complete}
}
```

**Note :** Les salles sont dérivées des activités via `activity_location`. Pas besoin de structure séparée pour les salles.

**Interaction staff :** Le staff peut modifier la salle (`location`) d'une activité depuis le détail d'activité. Cette modification doit être envoyée au backend via PATCH (voir section Endpoints).

---

## ✅ Variables Validation Inscription

Ces variables sont spécifiques à la page `validation-inscription.html`.

| Placeholder | Type | Description | Utilisation |
|------------|------|-------------|-------------|
| `{inscription_id}` | String/Number | Identifiant unique de l'inscription | Identifiant pour validation/refus |
| `{inscription_status}` | String | Statut de l'inscription | Valeurs: "pending", "approved", "rejected" |
| `{inscription_date_submitted}` | String | Date de soumission | Format: "YYYY-MM-DD" ou timestamp |
| `{inscription_member_data}` | Object | Données complètes du formulaire d'inscription | Toutes les données soumises par l'utilisateur |

**Structure JSON attendue :**
```json
{
  "id": "{inscription_id}",
  "status": "{inscription_status}",
  "dateSubmitted": "{inscription_date_submitted}",
  "member": {
    // Structure identique à {member_*} ci-dessus
  },
  // Autres données du formulaire d'inscription
}
```

---

## 🔄 Endpoints API Attendus

### **Authentification**

#### POST `/api/auth/login`
Authentification du staff

**Body attendu :**
```json
{
  "username": "{username}",
  "password": "{password}"
}
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Connexion réussie"
}
```

**Note :** La gestion de la session et de la sécurité est entièrement gérée par le backend (cookies, tokens, etc.).

---

### **Membres**

#### GET `/api/staff/members?type={type}`
Récupère la liste des membres

**Query params :**
- `type` (optionnel) : "adherents", "benevoles", "partenaires"

**Réponse attendue :**
```json
{
  "adherents": [
    {
      "id": "{member_id}",
      "nom": "{member_nom}",
      "prenom": "{member_prenom}",
      "numero": "{member_numero}",
      "role": "Adhérent",
      "photo": "{member_photo}"
    }
  ],
  "benevoles": [...],
  "partenaires": [...]
}
```

#### DELETE `/api/staff/members/{member_id}`
Supprime un membre

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Membre supprimé avec succès"
}
```

---

### **Activités**

#### GET `/api/staff/activities?date={date}&month={month}&year={year}`
Récupère les activités

**Query params :**
- `date` (optionnel) : "YYYY-MM-DD" pour une date spécifique
- `month` (optionnel) : mois (1-12)
- `year` (optionnel) : année

**Réponse attendue :**
```json
[
  {
    "id": "{activity_id}",
    "title": "{activity_title}",
    "category": "{activity_category}",
    "categoryName": "{activity_category_name}",
    "categoryColor": "{activity_category_color}",
    "date": "{activity_date}",
    "time": "{activity_time}",
    "location": "{activity_location}",
    "description": "{activity_description}",
    "responsible": "{activity_responsible}",
    "maxParticipants": {activity_max_participants},
    "currentParticipants": {activity_current_participants},
    "isComplete": {activity_is_complete}
  }
]
```

#### POST `/api/staff/activities`
Crée une nouvelle activité

**Body attendu :**
```json
{
  "title": "{activity_title}",
  "category": "{activity_category}",
  "date": "{activity_date}",
  "timeStart": "{activity_time_start}",
  "timeEnd": "{activity_time_end}",
  "location": "{activity_location}",
  "description": "{activity_description}",
  "responsible": "{activity_responsible}"
}
```

**Réponse attendue :**
```json
{
  "success": true,
  "activity": {
    // Structure complète de l'activité créée
  }
}
```

#### PATCH `/api/staff/activities/{activity_id}`
Met à jour une activité (ex. changement de salle par le staff)

**Body attendu (champs partiels possibles) :**
```json
{
  "location": "{activity_location}",
  "responsible": "{activity_responsible}"
}
```

**Cas d'usage :** Le staff peut modifier la salle d'une activité depuis le détail d'activité (select). Cette modification doit être persistée côté backend.

**Réponse attendue :**
```json
{
  "success": true,
  "activity": {
    // Structure complète de l'activité mise à jour
  }
}
```

#### DELETE `/api/staff/activities/{activity_id}`
Supprime une activité

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Activité supprimée avec succès"
}
```

---

### **Appel (Présence)**

Ces endpoints sont utilisés par le widget « Faire l'appel » dans `accueil-staff.html`.

| Placeholder | Type | Description | Utilisation |
|------------|------|-------------|-------------|
| `{appel_activity_id}` | String/Number | Identifiant de l'activité | Référence à l'activité concernée |
| `{appel_animateur}` | String | Nom du bénévole/animateur effectuant l'appel | Peut différer de `activity_responsible` initial |
| `{appel_adherent_id}` | String/Number | Identifiant de l'adhérent | Pour chaque participant |
| `{appel_present}` | Boolean | Présent ou absent | true = présent, false = absent |

**Structure JSON pour l'appel :**
```json
{
  "activity": {
    "id": "{activity_id}",
    "title": "{activity_title}",
    "date": "{activity_date}",
    "time": "{activity_time}",
    "location": "{activity_location}",
    "responsible": "{appel_animateur}"
  },
  "animateur": "{appel_animateur}",
  "adherentsPresents": [
    {
      "id": "{appel_adherent_id}",
      "nom": "{member_nom}",
      "numero": "{member_numero}"
    }
  ]
}
```

#### POST `/api/staff/activities/{activity_id}/appel`
Enregistre l'appel (présence) pour une activité

**Body attendu :**
```json
{
  "animateur": "{appel_animateur}",
  "adherentsPresents": [
    {
      "id": "{member_id}",
      "nom": "{member_nom}",
      "numero": "{member_numero}"
    }
  ]
}
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Appel enregistré",
  "presentsCount": 5,
  "totalCount": 6
}
```

#### GET `/api/staff/activities/{activity_id}/appel`
Récupère les participants inscrits et leur statut de présence pour une activité (optionnel, pour pré-remplir le widget)

**Réponse attendue :**
```json
{
  "participants": [
    {
      "id": "{member_id}",
      "nom": "{member_nom}",
      "numero": "{member_numero}",
      "present": true
    }
  ],
  "animateur": "{activity_responsible}"
}
```

---

### **Validation Inscription**

#### GET `/api/staff/inscriptions?status={status}`
Récupère les inscriptions en attente

**Query params :**
- `status` (optionnel) : "pending", "approved", "rejected"

**Réponse attendue :**
```json
[
  {
    "id": "{inscription_id}",
    "status": "{inscription_status}",
    "dateSubmitted": "{inscription_date_submitted}",
    "member": {
      // Données du membre
    }
  }
]
```

#### POST `/api/staff/inscriptions/{inscription_id}/validate`
Valide une inscription

**Body attendu :**
```json
{
  "action": "approve" // ou "reject"
}
```

**Note :** Le backend génère automatiquement l'ID membre et le mot de passe si l'action est "approve".

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Inscription validée",
  "member": {
    // Données du membre créé
  }
}
```

---

## 📝 Notes Importantes

### **Format des Dates**
- **Format API :** `YYYY-MM-DD` (ex: "2026-02-15")
- **Format d'affichage :** "15 Février 2026" (géré côté frontend)
- **Format heure API :** `HH:mm` (ex: "09:00")
- **Format heure affichée :** "09h00 - 11h00" (géré côté frontend)

### **Catégories d'Activités**
Les catégories sont fixes (4 couleurs) :
- `numerique` → Numérique (Bleu: #1f658e)
- `arts-vivants` → Arts vivants (Orange: #f08d35)
- `projet-pro` → Projet pro (Violet: #9b59b6)
- `solidarite` → Solidarité (Vert: #649d50)

### **Salles réservables**
Les salles sont fixes (charte graphique) :
- Salle de l'Eau (Bleu: #1f658e)
- Salle de la Terre + patio (Vert: #649d50)
- Salle du Feu (Orange: #f08d35)
- Salle du Vent (Violet: #9b59b6)
- Salle de formation (Gris: #6e6f75)
- Accueil (Jaune or: #e6b800)

### **Gestion des Erreurs**
Toutes les réponses d'erreur doivent suivre ce format :
```json
{
  "success": false,
  "error": {
    "code": "{error_code}",
    "message": "{error_message}"
  }
}
```

**Note :** La gestion de la sécurité, de l'authentification, des sessions et des permissions est entièrement gérée par le backend sur le serveur Ubuntu. Le frontend n'a pas besoin de gérer ces aspects.

---

## 🔧 Guide de Remplacement

### **Étape 1 : Identifier les Placeholders**
Rechercher dans le code tous les `{nom_variable}`

### **Étape 2 : Remplacer par les Variables Backend**
Remplacer chaque placeholder par la variable correspondante de votre API

**Exemple :**
```javascript
// AVANT (placeholder)
const memberName = `${member.nom} ${member.prenom}`;

// APRÈS (variable backend)
const memberName = `${member.{member_nom}} ${member.{member_prenom}}`;
```

### **Étape 3 : Adapter les Structures de Données**
S'assurer que les structures JSON correspondent aux formats attendus listés ci-dessus.

### **Étape 4 : Gérer les Erreurs**
- Intercepter les erreurs API
- Afficher des messages d'erreur clairs à l'utilisateur
- Gérer les cas d'expiration de token

---

## ✅ Checklist d'Intégration

Avant de considérer l'intégration comme complète :

- [ ] Tous les placeholders sont remplacés par les vraies variables
- [ ] Tous les endpoints API sont connectés (dont PATCH activités et POST appel)
- [ ] Modification de salle : appel PATCH lors du changement dans le select
- [ ] Validation appel : appel POST avec animateur et adherentsPresents
- [ ] La gestion des erreurs est en place
- [ ] Les réponses API correspondent aux formats attendus
- [ ] Les données sont correctement affichées dans le frontend

---

**Dernière mise à jour :** 17 Février 2026  
**Version :** 2.1

**Changelog v2.1 (17/02/2026) :**
- Ajout endpoint **PATCH** `/api/staff/activities/{activity_id}` pour modification de salle et responsable
- Ajout section **Appel (Présence)** : variables et endpoints POST/GET pour le widget « Faire l'appel »
