# Rapport – Validation des formulaires et sécurité (front)

**Projet :** Vill'Age Jeunes – Formulaire d'inscription adhérent  
**Périmètre :** Validation côté client uniquement (première barrière). La vérification serveur est à mettre en place ultérieurement.  
**Date :** Février 2025  

---

## 1. Contexte et objectifs

- **Objectif :** Vérifier et contraindre les données saisies dans les formulaires (inscription adhérent, etc.) pour :
  - Limiter la **surcharge mémoire** et les abus (volume de données).
  - Réduire les risques d’**injection SQL** et de **XSS** en rejetant les caractères dangereux.
  - Garantir **types, longueurs et formats** cohérents avant tout envoi au serveur.

- **Principe :** Toute la validation décrite ici est réalisée **uniquement en front**. Elle ne remplace pas une validation et une sanitization **côté serveur**, qui restent obligatoires.

---

## 2. Limites de caractères (par champ et globales)

### 2.1 Constantes utilisées (`validation.js`)

| Constante | Valeur | Usage |
|-----------|--------|--------|
| `MAX_LENGTH_SHORT` | 250 | Nom, prénom, email, téléphone, libellés courts |
| `MAX_LENGTH_TEXT` | 1 000 | Textareas (problème santé, autre activité, adresse, etc.) |
| `MAX_LENGTH_SIGNATURE` | 500 | Signature texte (parent, etc.) |
| `MAX_LENGTH_ADDRESS` | 1 000 | Adresse longue |
| `TELEPHONE_MAX` | 20 | Numéro de téléphone (chiffres + espaces) |
| `MAX_TOTAL_FORM_CHARS` | 30 000 | **Somme de tous les champs texte du formulaire** |

### 2.2 Application

- Chaque champ texte/textarea est limité par une de ces constantes selon son type.
- Les champs avec `data-max-length` dans le HTML reçoivent en plus l’attribut **`maxlength`** au chargement, ce qui empêche de saisir au-delà de la limite.
- **Contrôle global :** avant soumission, la somme des longueurs de tous les champs (input texte, textarea, select) est calculée. Si elle dépasse `MAX_TOTAL_FORM_CHARS`, la soumission est refusée avec un message explicite.

**Effet :** limitation du volume de données par champ et par formulaire, réduction des risques de surcharge mémoire et d’envoi de gros payloads malveillants.

---

## 3. Caractères autorisés et interdits

### 3.1 Champs texte « classiques » (une ligne)

**Autorisés :**

- Lettres (y compris accentuées / Unicode : `\p{L}`, `\p{M}`)
- Chiffres (`\p{N}`)
- Espaces
- Ponctuation courante : `'` `-` `.` `,` `!` `?` `:` `(` `)` `/`

**Interdits (rejet explicite avec message d’erreur) :**

- `<` `>` — prévention XSS (balises HTML)
- `"` `'` (guillemets) — réduction des risques d’échappement et d’injection
- `\` — caractère d’échappement
- `;` — souvent associé à l’injection SQL
- `=` — souvent utilisé dans les payloads
- Commentaires SQL : `--` `/*` `*/`
- Caractères de contrôle (codes 0x00–0x1F)

**Implémentation :** regex `REGEX_SAFE_TEXT` dans `validation.js`, utilisée par `validateSafeText()`.

### 3.2 Champs texte multiligne (textarea)

Même ensemble de caractères autorisés, avec en plus :

- Retours à la ligne (`\n`, `\r`)

**Implémentation :** `REGEX_SAFE_TEXT_MULTILINE`, option `allowMultiline: true` dans `validateSafeText(..., { allowMultiline: true })`.

### 3.3 Téléphone

- **Autorisés :** chiffres `0-9` et espaces uniquement.
- **Longueur max :** `TELEPHONE_MAX` (20 caractères).

**Implémentation :** `validateTelephone()` avec `REGEX_TELEPHONE`.

### 3.4 Email

- Format classique : `xxx@yyy.zzz`
- Longueur max : `MAX_LENGTH_SHORT` (250)
- Pas de liste de caractères interdits spécifique au-delà du format (la regex restreint déjà le format).

**Implémentation :** `validateEmail()` dans `validation.js`.

---

## 4. Prévention de l’injection SQL (côté front)

- **Pas d’exécution SQL en front :** le front n’envoie que des données ; il ne construit jamais de requête SQL.
- **Rôle du front :**
  - Rejeter les caractères dangereux (`;` `--` `/*` `*/` etc.) via `validateSafeText()`.
  - Limiter les longueurs pour éviter des chaînes démesurées.

**Recommandation serveur (à faire plus tard) :** utiliser **toujours** des requêtes paramétrées (prepared statements) et ne jamais concaténer les entrées utilisateur dans une chaîne SQL. La validation front reste une première barrière, pas une protection suffisante à elle seule.

---

## 5. Prévention XSS (côté front)

- **Entrée :** rejet des caractères `<` et `>` (et autres dangereux) dans les champs texte via `validateSafeText()`.
- **Sortie :** en affichage, il faut **échapper** les données (HTML escape) avant de les insérer dans le DOM. Si les champs sont affichés via `textContent` ou des mécanismes qui échappent le HTML, le risque est réduit ; toute insertion de HTML brut (e.g. `innerHTML`) avec des données utilisateur doit être évitée ou strictement encadrée.

La validation front limite donc les entrées « brutes » susceptibles de contenir du script ou des balises.

---

## 6. Bonnes pratiques appliquées

| Pratique | Mise en œuvre |
|----------|----------------|
| **Allowlist (liste blanche)** | Seuls des caractères explicites sont autorisés (regex sur alphabet défini). |
| **Limite par champ** | Chaque type de champ a une longueur max (constantes centralisées). |
| **Limite globale** | `getTotalFormTextLength()` + `MAX_TOTAL_FORM_CHARS` avant soumission. |
| **Rejet plutôt que « nettoyage »** | En cas de caractère interdit, erreur claire affichée à l’utilisateur plutôt que suppression silencieuse. |
| **Messages d’erreur explicites** | Ex. : « Le champ X contient des caractères non autorisés. Utilisez uniquement lettres, chiffres, espaces et ponctuation courante (pas de < > " \ ; =). » |
| **Cohérence HTML / JS** | `data-max-length` + attribut `maxlength` pour empêcher la saisie au-delà de la limite. |
| **Compatibilité** | Si `validateSafeText` / `validateTelephone` ne sont pas disponibles (ancienne version), repli sur `validateString` / `validateOptionalString`. |

---

## 7. Où la validation est appliquée

- **Au chargement :** application de `maxlength` et, si présent, des compteurs de caractères (`attachCharCounter`) sur les champs avec `data-max-length`.
- **À la soumission :** dans `submitForm()` (script.js) :
  1. Vérification de la limite globale (`getTotalFormTextLength` vs `MAX_TOTAL_FORM_CHARS`).
  2. Pour les champs texte : `validateSafeText()` (longueur + caractères autorisés).
  3. Pour les téléphones : `validateTelephone()`.
  4. Pour les emails : `validateEmail()`.
  5. Pour les dates : `validateDateString()`.
  6. Pour les tableaux (cases à cocher, etc.) : `validateStringArray()` (nombre d’éléments et longueur de chaque valeur).

Toute erreur de validation est attrapée dans le `try/catch` et affichée à l’utilisateur via `alert()` (message de l’erreur), et la soumission est interrompue.

---

## 8. Recommandations pour la suite (serveur)

1. **Refaire toutes les vérifications côté serveur** (longueurs, formats, caractères autorisés). Ne jamais se fier uniquement au front.
2. **Requêtes paramétrées** pour toute requête SQL ; pas de concaténation de chaînes utilisateur dans le SQL.
3. **Échappement / encodage** adapté selon le contexte (HTML, URL, en-têtes, etc.) lors de l’affichage ou de l’envoi des données.
4. **Limites techniques côté serveur** : taille max du body HTTP, taille max par champ en base, timeouts.
5. **Logs** des erreurs de validation (sans logger les données sensibles en clair) pour détecter des tentatives d’abus ou d’injection.
6. **Signature (image / base64) :** si un champ signature est envoyé en base64, définir une limite serveur adaptée (ex. 50–100 Ko) et un type MIME autorisé ; la limite `MAX_LENGTH_SIGNATURE` (500) en front concerne une **signature texte**, pas une image.

---

## 9. Résumé

- **Validation actuelle :** uniquement en front (longueurs, caractères autorisés, format téléphone/email/dates, limite globale du formulaire).
- **Objectifs atteints :** limitation de la surcharge mémoire, réduction des risques d’injection SQL et de XSS par rejet de caractères dangereux et par limites strictes.
- **Prochaine étape indispensable :** mettre en place une vérification et une sanitization **côté serveur** en cohérence avec ce rapport (paramétrage SQL, échappement, limites techniques).
