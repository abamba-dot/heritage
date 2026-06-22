# Rapport de présentation du site HÉRITAGES

## 1. Introduction

Le projet **HÉRITAGES** est un site web vitrine et e-commerce léger destiné à présenter une collection de t-shirts/maillots inspirés des identités culturelles, des pays et des villes. Le slogan principal du site est :

> **Every City Has A Story**

L'objectif du projet est de proposer une expérience digitale immersive, élégante et simple à utiliser, permettant à un client de découvrir l'univers de la marque, choisir un pays, sélectionner une taille, ajouter une personnalisation, puis passer commande via WhatsApp.

Le site a été conçu comme une interface moderne, responsive et directement exploitable pour une présentation client ou un lancement commercial.

## 2. Contexte du projet

La marque HÉRITAGES s'appuie sur une idée forte : chaque ville, chaque pays et chaque origine racontent une histoire. Le site traduit cette idée à travers une direction artistique premium : fond sombre, accent doré, typographies fortes, images de collection et animations de scroll.

Le projet répond à plusieurs besoins :

- Présenter l'identité visuelle de la marque.
- Mettre en avant une collection internationale de t-shirts.
- Offrir un configurateur simple pour choisir un modèle.
- Permettre au client d'ajouter une demande spéciale.
- Centraliser les commandes via WhatsApp.
- Préparer le site pour un hébergement réel sur VPS avec Nginx.

## 3. Objectifs du site

Les objectifs principaux sont :

- Créer une première impression forte grâce à un Hero animé.
- Donner une image premium et culturelle à la marque.
- Simplifier le parcours utilisateur jusqu'à la commande.
- Éviter un tunnel de paiement complexe au départ.
- Permettre au client de commander rapidement via WhatsApp.
- Avoir une base technique maintenable et évolutive.

## 4. Public cible

Le site s'adresse principalement :

- Aux clients intéressés par la mode urbaine et culturelle.
- Aux personnes qui souhaitent porter un vêtement lié à leurs origines.
- Aux amateurs de t-shirts personnalisés.
- Aux clients internationaux ou diasporiques.
- Aux utilisateurs mobiles, car une grande partie des commandes peut venir des réseaux sociaux.

## 5. Identité visuelle

L'identité visuelle repose sur un univers sombre, luxueux et minimaliste.

Couleurs principales :

- Noir profond : `#0D0D0D`
- Crème : `#F5F0E1`
- Or : `#D4AF37`
- Vert sombre : utilisé comme nuance secondaire

Typographies :

- **College Block / police bloc** pour les grands titres et l'identité forte.
- **Cinzel** pour certains éléments premium et titres secondaires.
- **Inter** pour les textes, labels, boutons et informations pratiques.

Le choix du noir et de l'or permet de créer une perception haut de gamme, tandis que les grandes lettres donnent un aspect sportif, culturel et mémorable.

## 6. Structure générale du site

Le site est composé des grandes parties suivantes :

- Écran de chargement.
- Header / navigation.
- Hero animé.
- Configurateur de produit.
- Panier latéral.
- Footer avec contact, pays et liens.

Le fichier principal `src/App.jsx` organise l'application avec :

- `CartProvider` pour la gestion globale du panier.
- `LoadingScreen` affiché au lancement.
- `Header` pour la navigation.
- `Hero` pour l'expérience d'entrée.
- `Configurator` pour le choix du produit.
- `Footer` pour les informations finales.
- `CartDrawer` pour afficher et gérer le panier.

## 7. Écran de chargement

Le site commence par un écran de chargement immersif.

Fonctionnalités :

- Fond noir plein écran.
- Logo/icône HÉRITAGES centré.
- Animation des lettres du mot HÉRITAGES.
- Ligne dorée animée.
- Tagline "Every City Has A Story".
- Disparition progressive vers le site.

Cette étape permet de renforcer l'identité de marque avant même l'arrivée sur le contenu principal.

## 8. Header et navigation

Le Header est fixe en haut de page. Il contient :

- Le logo HÉRITAGES.
- Des liens vers les collections, le configurateur et le contact.
- L'icône du panier avec compteur.
- Un menu mobile.

Le Header adapte son apparence selon le scroll :

- Au début, il reste transparent pour laisser respirer le Hero.
- Après le scroll, il devient sombre avec une bordure.
- Le logo est masqué pendant que le Hero est visible pour éviter une surcharge visuelle.

Ce comportement améliore la lisibilité et donne une impression plus professionnelle.

## 9. Hero animé

Le Hero est l'élément le plus immersif du site.

Il utilise une animation inspirée d'un mécanisme de type **mask reveal** :

- Une image de fond plein écran.
- Un masque en forme du texte "HÉRITAGES".
- Une image visible à travers le masque.
- Un voile blanc qui s'opacifie au scroll.
- Une animation synchronisée avec le défilement.

Technologies utilisées :

- GSAP.
- ScrollTrigger.
- `@gsap/react`.
- Masque CSS avec SVG encodé.

Sur desktop, l'animation agrandit le masque jusqu'à environ 110 %. Sur mobile, elle adapte le mouvement pour rester fluide et lisible. Ce Hero permet au site d'avoir une entrée très visuelle, proche d'une expérience de marque premium.

## 10. Configurateur produit

Le configurateur est le cœur commercial du site. Il permet au client de créer rapidement sa commande.

Étapes principales :

1. Choix du pays.
2. Choix de la taille.
3. Ajout éventuel d'une personnalisation.
4. Ajout au panier.
5. Commande via WhatsApp.

Le configurateur utilise les données du fichier `src/data/countries.js`, qui contient 12 pays :

- Bénin
- Cameroun
- Congo
- Côte d'Ivoire
- Gabon
- Guinée
- Mali
- Maroc
- Allemagne
- France
- Brésil
- Équateur

Chaque pays possède :

- Un identifiant.
- Un nom affiché.
- Un drapeau.
- Un indicatif.
- Une image produit.

## 11. Aperçu produit

Lorsqu'un pays est sélectionné, l'image correspondante s'affiche depuis le dossier `public/collection/`.

Cela permet au client de voir immédiatement le rendu associé au pays choisi. L'expérience est différente selon l'appareil :

- Sur desktop : l'image produit apparaît dans une zone visuelle sticky à gauche.
- Sur mobile : le choix du pays ouvre un aperçu immersif avant confirmation.

Cette logique améliore l'engagement utilisateur et évite un formulaire trop classique.

## 12. Personnalisation libre

Le client peut cocher une option de personnalisation spéciale.

Exemples de demandes possibles :

- Nom au dos.
- Numéro.
- Phrase.
- Broderie.
- Placement particulier.
- Packaging.
- Autre idée personnalisée.

Si l'option est activée, une zone de texte apparaît avec une animation fluide. Cette approche laisse une liberté au client sans surcharger le formulaire principal.

## 13. Gestion des prix

Les prix sont centralisés dans `src/data/config.js`.

Configuration actuelle :

- T-shirt standard : **120 DH**
- T-shirt personnalisé : **150 DH**
- Devise : **DH**
- Numéro WhatsApp : **212781636843**

Cette séparation facilite la maintenance. Si le prix ou le numéro WhatsApp change, il suffit de modifier un seul fichier.

## 14. Panier

Le site possède un panier fonctionnel.

Fonctionnalités :

- Ajout d'un produit.
- Regroupement des articles similaires.
- Quantité modifiable.
- Suppression d'un article.
- Vidage complet du panier.
- Compteur dans le Header.
- Panier latéral accessible à tout moment.
- Persistance via `localStorage`.

La persistance permet de conserver le panier même si l'utilisateur recharge la page.

## 15. Commande via WhatsApp

Le site ne nécessite pas encore de paiement en ligne. La commande passe par WhatsApp.

Lorsqu'un utilisateur clique sur "Commander via WhatsApp", un message est généré automatiquement avec :

- Le nom du produit.
- Le pays choisi.
- La taille.
- La quantité.
- Les personnalisations éventuelles.

Le lien utilise le numéro :

```txt
wa.me/212781636843
```

Ce choix est adapté pour un lancement de marque, car il permet de garder un contact humain avec le client, confirmer les détails et gérer le paiement manuellement.

## 16. Responsive design

Le site est conçu pour fonctionner sur desktop et mobile.

Sur desktop :

- Layout en deux colonnes pour le configurateur.
- Image produit sticky à gauche.
- Formulaire à droite.
- Navigation complète affichée.

Sur mobile :

- Interface en étapes.
- Navigation simplifiée.
- Aperçu produit plein écran.
- Barre d'action fixe en bas.
- Scroll natif pour une meilleure compatibilité mobile.

Le projet utilise Tailwind CSS pour gérer les breakpoints et les styles responsives.

## 17. Animations et expérience utilisateur

Le site utilise plusieurs types d'animations :

- Animation de chargement avec GSAP.
- Hero animé au scroll avec GSAP ScrollTrigger.
- Transitions de formulaire avec Framer Motion.
- Apparition progressive des éléments.
- Animation des prix.
- Ouverture/fermeture du panier latéral.
- Feedback visuel en cas de champ manquant.

Les animations ne sont pas seulement décoratives. Elles aident à guider l'utilisateur, à rendre l'interface plus fluide et à renforcer la perception premium.

## 18. Architecture technique

Le site est développé avec :

- **React 18** pour la création des composants.
- **Vite 8** pour le build rapide.
- **Tailwind CSS** pour le style.
- **GSAP** pour les animations complexes.
- **Framer Motion** pour les transitions d'interface.
- **Lenis** pour le smooth scroll sur desktop.
- **Nginx** pour servir le site en production sur VPS.

Structure principale :

```txt
src/
  App.jsx
  main.jsx
  index.css
  components/
    Header.jsx
    Hero.jsx
    Configurator.jsx
    PrixDisplay.jsx
    CartDrawer.jsx
    Footer.jsx
    LoadingScreen.jsx
  context/
    CartContext.jsx
  data/
    countries.js
    config.js
```

## 19. Gestion de l'état

La gestion du panier est centralisée dans `CartContext.jsx`.

Ce contexte fournit :

- La liste des articles.
- Le nombre total d'articles.
- L'état d'ouverture du panier.
- Les fonctions d'ajout, suppression et modification.
- La sauvegarde automatique dans `localStorage`.

Cette solution est simple, légère et adaptée au périmètre actuel du projet.

## 20. Déploiement

Le projet est prêt pour deux types de déploiement :

### Vercel

Le fichier `vercel.json` permet de gérer le comportement SPA avec une redirection vers `index.html`.

### VPS Ubuntu + Nginx

Le projet contient :

- `DEPLOYMENT.md`
- `deploy/nginx/heritage-wear.shop.conf`

Le build de production est généré avec :

```bash
npm run build
```

Puis Nginx sert le dossier :

```txt
/var/www/heritage/dist
```

Le site a été préparé pour le domaine :

```txt
heritage-wear.shop
www.heritage-wear.shop
```

## 21. Sécurité et fiabilité

Plusieurs points ont été pris en compte :

- Build de production testé.
- Audit npm corrigé à zéro vulnérabilité connue au moment de la préparation.
- Nginx configuré avec fallback SPA.
- Assets statiques mis en cache.
- Numéro WhatsApp centralisé.
- Pas de stockage sensible côté client.
- Pas de paiement bancaire intégré à ce stade, ce qui réduit les risques de sécurité.

## 22. Points forts du projet

Les points forts sont :

- Identité visuelle forte et mémorable.
- Parcours client simple.
- Expérience mobile adaptée.
- Hero animé premium.
- Configurateur interactif.
- Panier fonctionnel.
- Commande WhatsApp directe.
- Données pays faciles à maintenir.
- Déploiement VPS préparé.

## 23. Limites actuelles

Le projet reste une première version. Certaines limites existent :

- Pas encore de paiement en ligne.
- Pas encore de back-office administrateur.
- Les commandes ne sont pas enregistrées dans une base de données.
- Les réseaux sociaux du footer utilisent encore des liens génériques.
- Les pages CGV et Mentions légales sont référencées mais pas encore développées.
- Le stock produit n'est pas encore géré.

Ces limites sont normales pour un MVP et peuvent être traitées dans une prochaine version.

## 24. Améliorations futures

Les évolutions possibles sont :

- Ajout d'un paiement en ligne.
- Connexion à une base de données.
- Création d'un espace administrateur.
- Gestion du stock.
- Ajout de pages légales complètes.
- Ajout de statistiques de visite.
- Intégration Instagram/TikTok réelle.
- Ajout d'un système de suivi des commandes.
- Ajout de filtres ou collections par continent/pays.
- Optimisation SEO avancée.

## 25. Conclusion

Le site HÉRITAGES est une solution web moderne, immersive et orientée conversion. Il met en valeur une marque culturelle à travers une interface premium et un parcours d'achat simplifié.

Le projet combine une direction artistique forte, des animations avancées, un configurateur produit, un panier fonctionnel et une commande via WhatsApp. Il constitue une base solide pour présenter la marque à un client, à un jury ou à des partenaires.

Cette première version est volontairement simple côté commerce : elle permet de tester le marché rapidement, de recevoir des commandes et d'améliorer progressivement le produit selon les retours utilisateurs.

---

# Aide à la soutenance orale

## Présentation courte en 1 minute

Bonjour, je vous présente **HÉRITAGES**, un site web vitrine et e-commerce léger pour une marque de t-shirts inspirée par les pays, les villes et les origines culturelles.

L'objectif était de créer une expérience premium, responsive et directement utilisable. Le site commence par un Hero animé, puis propose un configurateur permettant de choisir un pays, une taille, d'ajouter une personnalisation et de commander via WhatsApp.

Techniquement, le projet utilise React, Vite, Tailwind CSS, GSAP, Framer Motion et un panier persistant avec localStorage. Il est également préparé pour être hébergé sur un VPS avec Nginx.

Le résultat est un MVP solide, visuel et fonctionnel, qui peut être présenté à un client ou utilisé comme base pour un lancement réel.

## Présentation longue en 3 minutes

Le projet HÉRITAGES est né d'une idée simple : permettre aux clients de porter une pièce qui représente leur histoire, leur pays ou leurs origines. Le slogan "Every City Has A Story" résume cette vision.

J'ai développé un site moderne avec une identité visuelle sombre et dorée, pour donner une impression premium. L'entrée du site se fait avec un écran de chargement animé, puis un Hero qui utilise un masque typographique sur le mot HÉRITAGES. Cette animation permet d'avoir une première impression forte.

Ensuite, l'utilisateur arrive sur le configurateur. Il choisit un pays parmi 12 modèles, voit l'aperçu correspondant, sélectionne sa taille et peut ajouter une demande personnalisée. Le prix s'adapte automatiquement selon le choix standard ou personnalisé.

Le site possède aussi un panier complet : ajout d'article, quantité, suppression, sauvegarde dans le navigateur et commande via WhatsApp. Ce choix est volontaire, car pour une première version commerciale, WhatsApp permet un contact direct avec le client et évite la complexité d'un paiement en ligne.

Sur le plan technique, le site est construit avec React et Vite. Tailwind CSS est utilisé pour le design responsive. GSAP gère les animations complexes comme le Hero et Framer Motion gère les transitions d'interface. Le site est aussi prêt pour la production avec un build statique servi par Nginx sur un VPS.

Ce projet montre donc à la fois une compétence frontend, une réflexion UX/UI, une logique commerciale et une préparation réelle au déploiement.

## Questions possibles du jury et réponses

### Pourquoi avoir utilisé React ?

React permet de construire l'interface sous forme de composants réutilisables. C'est adapté ici parce que le site contient plusieurs blocs interactifs : configurateur, panier, modale, Header, Footer et écran de chargement.

### Pourquoi avoir choisi WhatsApp au lieu d'un paiement en ligne ?

Pour un MVP, WhatsApp est plus simple, plus rapide et plus humain. Cela permet de valider l'intérêt des clients avant d'investir dans un système de paiement plus complexe.

### Le site est-il responsive ?

Oui. Le site possède une expérience desktop et mobile différente. Sur mobile, le configurateur devient un parcours en étapes avec aperçu produit et barre d'action fixe.

### Comment les produits sont-ils gérés ?

Les pays et images sont stockés dans `countries.js`. Chaque pays contient son nom, son drapeau, son indicatif et son image. Cela permet d'ajouter facilement de nouveaux modèles.

### Comment fonctionne le panier ?

Le panier est géré avec React Context. Les données sont sauvegardées dans `localStorage`, donc elles restent disponibles même après rechargement de la page.

### Quels sont les points à améliorer ?

Les prochaines étapes seraient l'ajout d'un paiement en ligne, d'une base de données, d'un back-office, de pages légales complètes et d'une meilleure gestion du stock.

### Pourquoi GSAP et Framer Motion ?

GSAP est très puissant pour les animations complexes liées au scroll, comme le Hero. Framer Motion est plus pratique pour les transitions d'interface, comme les modales ou les étapes du configurateur.

### Le site est-il prêt pour la production ?

Oui, le projet possède un build de production et une configuration Nginx. Il est prêt à être servi sur VPS. Il reste seulement à finaliser la configuration DNS/HTTPS selon le domaine.

## Points à mettre en avant devant le jury

- Le site ne se limite pas à une maquette : il est fonctionnel.
- Le panier marche réellement.
- La commande WhatsApp génère un message automatique.
- Le projet est responsive.
- Le code est structuré en composants.
- Les données sont séparées du visuel.
- Le site est prêt au déploiement.
- Le design respecte une vraie direction artistique.

## Phrase de conclusion orale

Pour conclure, HÉRITAGES est un MVP complet qui réunit identité de marque, expérience utilisateur, logique commerciale et préparation technique à la production. Il peut déjà servir de base réelle pour présenter et vendre une première collection.
