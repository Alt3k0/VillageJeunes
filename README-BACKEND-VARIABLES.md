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
| `{activity_category}` | String | Catégorie de l'activité | Valeurs: "numerique", "solidaire", "artistique", "formation" |
| `{activity_category_name}` | String | Nom affiché de la catégorie | Valeurs: "Numérique", "Solidaire", "Artistique/Culturel", "Formation/Atelier" |
| `{activity_category_color}` | String (Hex) | Couleur associée à la catégorie | Couleurs: "#1f658e", "#649d50", "#f08d35", "#9b59b6" |
| `{activity_date}` | String | Date de l'activité | Format: "YYYY-MM-DD" (ex: "2026-02-15") |
| `{activity_time}` | String | Heure affichée | Format: "09h00 - 11h00" |
| `{activity_time_start}` | String | Heure de début | Format: "HH:mm" (ex: "09:00") - pour création/modification |
| `{activity_time_end}` | String | Heure de fin | Format: "HH:mm" (ex: "11:00") - pour création/modification |
| `{activity_location}` | String | Salle où se déroule l'activité | Valeurs: "Salle Numérique", "Salle Solidaire", "Salle Artistique/Culturel", "Salle Emploi/Formation" |
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
Les catégories sont fixes :
- `numerique` → Salle Numérique (Bleu: #1f658e)
- `solidaire` → Salle Solidaire (Vert: #649d50)
- `artistique` → Salle Artistique/Culturel (Orange: #f08d35)
- `formation` → Salle Emploi/Formation (Violet: #9b59b6)

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
- [ ] Tous les endpoints API sont connectés
- [ ] La gestion des erreurs est en place
- [ ] Les réponses API correspondent aux formats attendus
- [ ] Les données sont correctement affichées dans le frontend

---

**Dernière mise à jour :** Février 2026  
**Version :** 2.0 (Révisée et simplifiée)
