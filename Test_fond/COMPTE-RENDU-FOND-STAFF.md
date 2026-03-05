# Compte rendu – Blocage affichage lampe à lave (fond staff)

## Ce qui fonctionne
- La couleur de fond change bien (tu vois du blanc) : le CSS `body.fond-staff { background: transparent }` est bien appliqué, donc le body ne masque plus le fond. On voit à la place le fond du **html** (souvent blanc par défaut).

## Problèmes identifiés

### 1. Stacking context (z-index) – cause la plus probable
- Le conteneur de la lampe à lave (`.fond-lava-wrap`) a **z-index: -1** pour passer derrière le contenu.
- Si le **body** ne crée pas de « stacking context » (pas de z-index défini), les éléments à z-index -1 sont comparés au **conteneur racine** (viewport/html), pas au body.
- Résultat possible : le conteneur est peint **derrière le fond du viewport**, donc invisible, alors que le body transparent laisse voir le blanc du html.

**Solution :** forcer un stacking context sur le body pour le thème staff (ex. `z-index: 0`), afin que le -1 du wrap soit bien « derrière le body » mais au-dessus du fond html.

### 2. Contenu par-dessus la lampe
- Même si le wrap était visible, **header** (z-index 100), **main** (z-index 1) et **.background-decoration** (z-index 0) couvrent presque toute la page.
- La lampe est en z-index -1, donc derrière tout ça ; on ne la voit que dans les zones sans contenu (souvent aucune en pratique).

**Solution :** garder le wrap en arrière-plan (z-index -1) une fois le stacking context corrigé, ou passer le wrap en z-index 0 et s’assurer que header/main/footer ont un z-index plus élevé pour rester au-dessus.

### 3. Animation uniquement dans `requestAnimationFrame`
- Les positions des blobs sont mises à jour **uniquement dans la boucle `tick()`**, appelée par `requestAnimationFrame`.
- Au premier rendu, les blobs ont donc encore **left: 0 ; top: 0** (valeurs du CSS), tous en haut à gauche, et peuvent être masqués ou mal positionnés avant la première frame.

**Solution :** appeler `tick()` une fois **tout de suite** (de façon synchrone) après avoir inséré le wrap dans le DOM, pour que les positions soient correctes dès le premier paint.

### 4. Visibilité des blobs
- Opacités faibles (0.08 à 0.22) + blur 72px + fond clair = effet **très discret**, facile à prendre pour « rien ne s’affiche ».

**Solution :** augmenter un peu les opacités (ou la taille des blobs) pour confirmer que l’effet s’affiche, puis les réduire si besoin pour rester « apaisant ».

### 5. Erreur JavaScript
- Si une erreur est levée dans `initLavaStaff()` (ou avant), le wrap n’est jamais créé ou pas inséré.

**Solution :** ouvrir la console (F12 → Console) sur `accueil-staff.html` et vérifier qu’il n’y a pas d’erreur. Ajouter un `try/catch` dans `initLavaStaff` pour logger les erreurs si besoin.

---

## Corrections appliquées dans le code
1. **CSS** : `body.fond-staff` reçoit `position: relative` et `z-index: 0` pour créer un stacking context et que le wrap (z-index -1) soit bien visible par rapport au body.
2. **JS** : appel de `tick()` une fois **immédiatement** après l’insertion du wrap, pour que les blobs aient des positions correctes dès le premier affichage.
3. **JS** : légère hausse des opacités des blobs pour rendre l’effet visible (tu pourras les rebaisser ensuite si tu veux rester plus discret).

Après ces changements, recharger `accueil-staff.html` et vérifier en console qu’il n’y a pas d’erreur. Si rien ne change, dans les outils de développement (F12) : onglet **Elements**, vérifier que le div `.fond-lava-wrap` existe bien dans le body et que ses enfants `.fond-lava-blob` ont des styles `left`/`top` en % après le premier frame.
