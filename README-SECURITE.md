# Sécurité frontend – Validation des entrées

Ce document décrit les mesures de sécurité ajoutées côté frontend : validation des entrées utilisateur (type, longueur, format), limitation des risques de dépassement mémoire et de données mal formées envoyées au backend. **Le backend reste seul responsable de l’authentification, de l’autorisation et de la validation métier côté serveur.**

---

## 1. Module partagé : `validation.js`

**Fichier :** `validation.js`  
**Rôle :** Fournir des constantes et des helpers de validation réutilisables sur toutes les pages. Aucune logique métier ; uniquement vérification de type, longueur et format.

### Constantes (lignes 8-16)

| Constante | Valeur | Utilité |
|-----------|--------|--------|
| `VALIDATION.MAX_LENGTH_SHORT` | 250 | Champs courts (nom, prénom, email, recherche, etc.) – limite taille et risque de surcharge |
| `VALIDATION.MAX_LENGTH_TEXT` | 1000 | Textareas (description, commentaires, infos médicales, etc.) |
| `VALIDATION.MAX_LENGTH_SIGNATURE` | 500000 | Signature base64 (~500 Ko max) – évite envoi de blobs énormes |
| `VALIDATION.MAX_ARRAY_ITEMS` | 50 | Nombre max d’éléments dans les listes (genre, activités, etc.) |
| `VALIDATION.PASSWORD_MIN` | 8 | Longueur minimale mot de passe (staff) |
| `VALIDATION.PASSWORD_MAX` | 128 | Longueur maximale mot de passe |
| `VALIDATION.MEMBER_ROLES` | `['Adhérent','Bénévole','Partenaire']` | Rôles autorisés – évite valeurs arbitraires |

### Fonctions exposées (lignes 18-207, export global 218-232)

- **`getFormValue(selector)`** (l. 18-27) – Récupération sécurisée de la valeur d’un champ (évite accès à un élément absent).
- **`validateString(value, label, maxLength, required)`** (l. 29-38) – Chaîne obligatoire/optionnelle, longueur max.
- **`validateOptionalString(value, maxLength)`** (l. 41-47) – Chaîne optionnelle, longueur max uniquement.
- **`validateEmail(value, required)`** (l. 50-61) – Format email + longueur max.
- **`validateStringArray(elements, label, maxItems)`** (l. 64-81) – Tableau (cases à cocher) : nombre d’éléments et longueur de chaque valeur.
- **`validateDateString(value, label, required)`** (l. 83-101) – Format `YYYY-MM-DD` et cohérence jour/mois/année.
- **`validateSignature(value, required)`** (l. 104-112) – Présence et taille max de la signature base64.
- **`validatePassword(value, required)`** (l. 115-127) – Longueur min/max mot de passe.
- **`validateSearchTerm(value)`** (l. 129-135) – Longueur max du terme de recherche (évite abus).
- **`validateMemberRole(value)`** (l. 137-144) – Rôle dans la liste autorisée.
- **`safeTruncate(value, maxLength)`** (l. 149-154) – Troncature sans erreur pour sanitisation avant envoi.
- **`attachCharCounter(inputOrSelector, maxLength, options)`** (l. 155-190) – Attache un compteur « X / max » sous un champ ; au-delà de 90 % du max (configurable via `warnThreshold`), le compteur passe en classe `char-counter--warn` (alerte visuelle). Préviens l’utilisateur avant troncature.
- **`setInputHint(inputOrSelector, hintText)`** (l. 192-207) – Affiche un message d’aide sous un champ (ex. « Chiffres et espaces uniquement. »).
- **Injection de styles** (l. 209-216) – Une balise `<style id="validation-ux-styles">` est injectée au chargement : `.char-counter`, `.char-counter--warn`, `.input-hint`.

**Chargement :** À inclure **avant** tout script qui l’utilise (voir sections par page ci-dessous).

---

## 2. Formulaire d’inscription adhérent – `script.js`

**Fichier :** `script.js`  
**Page :** `inscription-complete.html` (charge `validation.js` puis `script.js`).

### Bloc try/catch et validation (lignes 332-461)

Toute la lecture et la validation des champs se fait dans un seul `try`. En cas d’échec, une `Error` est levée, le `catch` affiche le message et fait `return` ; aucun envoi n’est effectué.

**Lignes concernées (validation des champs) :**

- **346** – `validateStringArray(genreEls, 'Genre')`
- **347** – `validateDateString(..., 'Date de naissance', true)`
- **351-352** – Nom, prénom : `validateString(..., VALIDATION.MAX_LENGTH_SHORT, true)`
- **353-359** – Surnom, préférence nom, ville, quartier, email, téléphone : `validateOptionalString` / `validateEmail`
- **362-388** – Découverte, activités, établissement, secteurs, asso, mobilité, permis, objectifs, bénévolat, santé, etc. : `validateStringArray` ou `validateOptionalString` (avec `MAX_LENGTH_TEXT` pour les textes longs)
- **390-398** – Signature, parent : `validateDateString`, `validateSignature`, `validateOptionalString`

**Utilité :** Données typées, bornées en longueur et au format attendu avant construction de `formData` ; réduction du risque d’envoi de chaînes énormes ou mal formées au backend.

---

## 3. Commentaires (détail membre) – `member-detail.js`

**Fichier :** `member-detail.js`  
**Pages :** `validation-inscription.html`, `informations.html` (chargent `validation.js` puis `member-detail.js`).

### Commentaire « paiement partiel » (lignes 561-582)

- **567-571** – `validateString(commentaireInput.value, 'Commentaire sur le paiement partiel', VALIDATION.MAX_LENGTH_TEXT, true)` dans un `try/catch`.
- En cas d’erreur : `alert` du message, `return` (pas d’envoi).

**Utilité :** Longueur max 1000 caractères pour le commentaire ; même logique que les autres champs texte.

### Commentaire staff (lignes 584-625)

- **591-595** – `validateString(commentaireInput.value, 'Commentaire', VALIDATION.MAX_LENGTH_TEXT, true)` dans un `try/catch`.
- Même principe : message utilisateur et pas d’ajout si invalide.

**Utilité :** Limite la taille des commentaires affichés et envoyés (plus tard) au backend.

---

## 4. Page « Validation d’inscription » – `validation-inscription.html`

**Fichier :** `validation-inscription.html` (script inline).  
**Chargement :** `validation.js` puis `member-detail.js` (déjà présents en tête de script).

### Recherche (lignes 978-995)

- **982** – `validateSearchTerm(document.getElementById('searchInput').value).toLowerCase()` dans un `try/catch`.
- En cas de dépassement (>&nbsp;250 caractères) : alerte et `return`.

**Utilité :** Évite des termes de recherche démesurés (performance et abus).

### Validation d’inscription – mot de passe, signature, rôle (lignes 1990-2012)

- **1997** – `validatePassword(passwordInput ? passwordInput.value : '', true)` (obligatoire, 8–128 caractères).
- **2003** – `validateSignature(rawSignature, true)` (obligatoire, taille max 500 Ko).
- **2006** – `validateMemberRole(roleEl ? roleEl.textContent : '')` (valeurs : Adhérent, Bénévole, Partenaire).
- Tout est dans un `try/catch` ; en cas d’erreur : alerte et `return`, pas d’appel à `validateInscription`.

**Utilité :** Données envoyées au backend (`POST /api/staff/inscriptions/{id}/validate`) conformes en longueur et en rôle.

### Sanitisation des données membre (lignes 1307-1371 et 1772-1830)

- **1307-1318** – `MEMBER_DATA_TEXT_FIELDS` (champs texte longs) et `sanitizeMemberData(data)` : pour chaque chaîne, `safeTruncate` avec `VALIDATION.MAX_LENGTH_TEXT` ou `VALIDATION.MAX_LENGTH_SHORT`.
- **1370** – `collectMemberDataFromDisplay()` retourne `sanitizeMemberData(raw)`.
- **1829** – `collectMemberDataFromInputs()` retourne `sanitizeMemberData(raw)`.

**Utilité :** Toutes les chaînes des objets membre (affichage ou formulaire) sont bornées avant envoi (PUT) ou utilisation interne ; pas de dépassement mémoire ni de champs démesurés côté backend.

---

## 5. Page « Informations » (adhérents/bénévoles/partenaires) – `informations.html`

**Fichier :** `informations.html` (script inline).  
**Chargement :** `validation.js` puis `member-detail.js`.

### Recherche (lignes 517-534)

- **521** – `validateSearchTerm(document.getElementById('searchInput').value).toLowerCase()` dans un `try/catch`.
- Même logique que sur validation-inscription : alerte et `return` si terme trop long.

**Utilité :** Limite la taille du critère de recherche (cohérence et sécurité).

### Sanitisation des données membre (lignes 655-719 et 1122-1177)

- **655-664** – `MEMBER_DATA_TEXT_FIELDS` et `sanitizeMemberData(data)` (même implémentation que validation-inscription).
- **718** – `collectMemberDataFromDisplay()` retourne `sanitizeMemberData(raw)`.
- **1176** – `collectMemberDataFromInputs()` retourne `sanitizeMemberData(raw)`.

**Utilité :** Données membre (lecture ou édition) toujours tronquées aux limites définies avant tout envoi (ex. PUT `/api/staff/members/{id}`).

---

## 6. Formulaire « Création d’activité » – `accueil-staff.js`

**Fichier :** `accueil-staff.js`  
**Page :** `accueil-staff.html` (charge `validation.js` puis `accueil-staff.js`).

### Soumission du formulaire (lignes 2209-2262)

Toute la lecture et la validation sont dans un `try/catch` avant construction de l’objet activité et mise à jour des données.

- **2217-2222** – Nom : `validateString(getFormValue('#activityName'), 'Nom de l\'activité', VALIDATION.MAX_LENGTH_SHORT, true)`.
- **2223-2228** – Date : `validateDateString(getFormValue('#activityDate'), 'Date', true)`.
- **2229-2236** – Heures début/fin : format `HH:MM` (regex) et vérification début &lt; fin.
- **2238-2241** – Catégorie : présence dans `activityCategories` (numerique, solidaire, artistique, formation).
- **2240-2244** – Salle : `validateString(..., 'Salle', VALIDATION.MAX_LENGTH_SHORT, true)`.
- **2246-2250** – Responsable : `validateString(..., 'Responsable', VALIDATION.MAX_LENGTH_SHORT, true)`.
- **2252-2255** – Description : `validateOptionalString(..., VALIDATION.MAX_LENGTH_TEXT)`.

En cas d’erreur : `alert` du message et `return` ; aucune modification de `activitiesData` ni d’allActivitiesList.

**Utilité :** Champs activité (titre, salle, responsable, description, date, heures, catégorie) validés en type et longueur ; pas de valeurs arbitraires pour la catégorie ; format de date et d’heure contrôlé.

---

## 7. Expérience utilisateur – Compteurs et messages d’aide

Ces mesures **préviens l’utilisateur** avant troncature (compteur de caractères) et **guident la saisie** (messages simples comme « Chiffres et espaces uniquement »). Elles complètent la validation côté sécurité en évitant les mauvaises surprises à la soumission.

### Module `validation.js`

- **`attachCharCounter(inputOrSelector, maxLength, options)`** – Fichier : `validation.js`, lignes 155-190. Affiche sous le champ un compteur « X / max », mis à jour à chaque saisie ; au-delà de 90 % du max, le compteur passe en rouge (`char-counter--warn`).
- **`setInputHint(inputOrSelector, hintText)`** – Fichier : `validation.js`, lignes 192-207. Affiche un message d’aide sous le champ (toujours visible).
- **Styles injectés** – Fichier : `validation.js`, lignes 209-216. Classes `.char-counter`, `.char-counter--warn`, `.input-hint` pour l’affichage des compteurs et hints.

### Formulaire d’inscription – `inscription-complete.html` et `script.js`

- **Compteurs de caractères** – Tous les champs portant l’attribut **`data-max-length`** reçoivent un compteur au chargement.  
  - Fichier : `inscription-complete.html` – attributs `data-max-length="250"` ou `data-max-length="1000"` sur : nom, prénom, surnom (l. 48, 53, 58), email, téléphone (l. 132, 137), problemeSante textarea (l. 148), ville/quartier/district (l. 111, 117, 123), etudesSup, secteurRecherche, secteurActivite, nomAsso, sujetAsso (l. 237, 260, 289, 301, 304), autreActivite (l. 315), parentNom, parentTelephone, parentEmail, parentAdresse (l. 493, 498, 503, 508).  
  - Fichier : `script.js`, lignes 639-649 – Au `DOMContentLoaded`, boucle sur `[data-max-length]` et appel à `attachCharCounter(el, max)` pour chaque champ.
- **Messages d’aide téléphone** – Fichier : `inscription-complete.html` – placeholders « Chiffres et espaces uniquement » sur les champs `name="telephone"` et `name="parentTelephone"` (l. 137, 498).  
  - Fichier : `script.js`, lignes 646-649 – `setInputHint('[name="telephone"]', 'Chiffres et espaces uniquement.')` et idem pour `parentTelephone`.

**Utilité :** L’utilisateur voit en temps réel le nombre de caractères et la limite, est prévenu visuellement avant troncature, et a un message clair pour les champs téléphone.

### Commentaires (détail membre) – `member-detail.js`

- **Compteurs sur les commentaires** – Fichier : `member-detail.js`, lignes 640-647. Au chargement, si `attachCharCounter` et `VALIDATION` sont définis : `attachCharCounter('#paiementPartielCommentaireInput', VALIDATION.MAX_LENGTH_TEXT)` et `attachCharCounter('#memberDetailCommentaireInput', VALIDATION.MAX_LENGTH_TEXT)` (limite 1000 caractères).

**Utilité :** Prévention de la troncature sur les commentaires paiement partiel et commentaires staff.

### Recherche – `validation-inscription.html` et `informations.html`

- **Compteur sur le champ recherche** – Fichier : `validation-inscription.html`, lignes 2149-2151 – après l’attache du listener `input` sur `#searchInput`, appel à `attachCharCounter('#searchInput', VALIDATION.MAX_LENGTH_SHORT)` (250 caractères).  
- Fichier : `informations.html`, lignes 1403-1405 – même logique.

**Utilité :** L’utilisateur voit la limite du terme de recherche avant d’atteindre l’erreur de validation.

### Formulaire création d’activité – `accueil-staff.js`

- **Compteurs nom et description** – Fichier : `accueil-staff.js`, lignes 2168-2175. Dans `setupAddActivityWidget()`, si `attachCharCounter` et `VALIDATION` sont définis : `attachCharCounter('#activityName', VALIDATION.MAX_LENGTH_SHORT)` (250) et `attachCharCounter('#activityDescription', VALIDATION.MAX_LENGTH_TEXT)` (1000).

**Utilité :** Prévention de la troncature sur le nom et la description e l’activité.

---

## 8. Récapitulatif des fichiers et ordre de chargement

| Page | Scripts (ordre) | Rôle de la sécurité |
|------|------------------|----------------------|
| `inscription-complete.html` | `form-data.js`, `validation.js`, `script.js` | Validation formulaire inscription ; compteurs et hints (téléphone) |
| `validation-inscription.html` | `validation.js`, `member-detail.js`, script inline | Recherche, mot de passe, signature, rôle, sanitisation données membre ; compteur recherche |
| `informations.html` | `validation.js`, `member-detail.js`, script inline | Recherche, sanitisation données membre ; compteur recherche |
| `accueil-staff.html` | `validation.js`, `accueil-staff.js` | Validation formulaire création d'activité ; compteurs nom et description |

---

## 9. Ce que le frontend ne fait pas (reste au backend)

- **Authentification / autorisation** – Cookies, sessions, tokens, rôles serveur.
- **Validation métier côté serveur** – Le backend doit **toujours** revalider les données (longueurs, formats, règles métier).
- **Protection contre l’injection SQL** – Côté backend (requêtes paramétrées) ; le frontend limite surtout la taille et le format des chaînes.
- **Rate limiting, CAPTCHA, politique mot de passe avancée** – Côté backend ou infrastructure.

La validation frontend améliore l’UX et réduit les envois de données manifestement invalides ou trop volumineuses ; elle ne remplace pas la sécurité côté serveur.
