# Fonds dynamiques (lampe à lave)

Fond animé aux couleurs de la charte graphique Vill'Âge Jeunes, utilisable sur toutes les pages (index, connexion, accueil adhérent/staff/partenaire/bénévole).

## Fichiers

- **fond.css** — styles du fond et des blobs
- **fond.js** — injection du fond et animation

## Intégration dans une page HTML

1. **Dans le `<head>`**, après les autres feuilles de style :
   ```html
   <link rel="stylesheet" href="Test_fond_a_implementer/fond.css">
   ```

2. **Avant `</body>`**, avant les autres scripts :
   ```html
   <script src="Test_fond_a_implementer/fond.js"></script>
   ```

Si le site n’est pas à la racine, adapter le chemin (ex. `app/Test_fond_a_implementer/fond.css`).

## Rôle utilisateur (optionnel)

Pour afficher le fond, le script lit l’attribut **`data-user-role`** sur le `<body>` :

- `adherent` — défaut si absent
- `benevole` ou `bénévole`
- `partenaire`
- `staff`

Exemple :
```html
<body data-user-role="staff">
```

Sans `data-user-role`, le fond s’affiche quand même (rôle = adhérent par défaut). La même animation est utilisée pour tous les rôles.

## Optionnel : page staff

Sur les pages qui utilisent **style_staff.css**, si un décor fixe (`.background-decoration`) masque le fond, lui donner `z-index: -1` dans ce fichier pour le passer derrière la lampe à lave.
