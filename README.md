# HÉRITAGES

Site vitrine pour la collection World Cup Series HÉRITAGES — maillots iconiques inspirés des villes africaines et mondiales.

**"EVERY CITY HAS A STORY"**

## Stack

- React 18 + Vite 5
- Tailwind CSS 3
- GSAP 3 + ScrollTrigger + `@gsap/react`
- Framer Motion 11
- Lenis smooth scroll (desktop uniquement)

## Démarrage local

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Build & Déploiement

```bash
npm run build    # génère dist/
npm run preview  # prévisualise le build
```

**Vercel** : framework `Vite`, build command `npm run build`, output `dist`.  
Le fichier `vercel.json` configure le SPA rewrite vers `index.html`.

**VPS Ubuntu + Nginx** : voir [DEPLOYMENT.md](DEPLOYMENT.md).

## Structure du projet

```
src/
  App.jsx                  # Lenis + structure globale
  index.css                # Variables, scrollbar, utilitaires
  components/
    Header.jsx             # Fixe, transparent → opaque au scroll
    Hero.jsx               # Sticky mask reveal (SVG text mask, GSAP scrub)
    Configurator.jsx       # Formulaire configurateur + modale confirmation
    Footer.jsx             # 3 colonnes : Liens / Pays / Contact
    CartDrawer.jsx         # Tiroir panier + commande WhatsApp
  context/
    CartContext.jsx        # État global panier, localStorage
  data/
    countries.js           # 12 pays de la collection
public/
  images/
    photohero1.png         # Fond du Hero (lookbook)
  collection/
    benin.jpeg
    cameroun.jpeg
    ...                    # Visuels maillots (12 fichiers)
  favicon.svg
```

## Ajouter un nouveau pays à la collection

**1 — Ajouter l'image du maillot**

Déposer le fichier dans `public/collection/` :

```
public/collection/senegal.jpeg
```

Formats acceptés : `.jpeg`, `.jpg`, `.png` — recommandé ≥ 800×800 px, fond neutre.

**2 — Déclarer le pays dans `src/data/countries.js`**

```js
export const countries = [
  // ... pays existants ...
  {
    id: "senegal",          // identifiant unique kebab-case
    name: "Sénégal",        // nom affiché (avec accents)
    flag: "🇸🇳",            // emoji drapeau
    code: "221",            // indicatif téléphonique (pour l'URL WhatsApp)
    image: "/collection/senegal.jpeg",
  },
]
```

C'est tout. Le pays apparaît automatiquement dans :
- Le menu déroulant du Configurateur
- La liste "Pays de la collection" du Footer

**Remarque** : les noms de fichiers avec espaces fonctionnent dans `<img src>` mais il est préférable d'utiliser des tirets (`cote-divoire.jpeg` plutôt que `cote divoire.jpeg`).

## Fonctionnalités

- **Hero** : sticky scroll mask — le mot HÉRITAGES se révèle en masque SVG au scroll (maskSize 0% → 110%), overlay blanc, parallaxe, collapse à la sortie
- **Configurateur** : choix pays, ville libre, style, couleur, taille, personnalisation libre — validation inline, modale de confirmation, commande WhatsApp
- **Panier** : persisté via `localStorage`, badge compteur dans le Header, tiroir latéral
- **Smooth scroll** : Lenis actif sur desktop (≥768px), scroll natif sur mobile/iOS Safari
- **Responsive** : mobile-first, breakpoints `sm` / `md` / `lg`

## Commande via WhatsApp

Le Configurateur génère un récapitulatif texte envoyé via `https://wa.me/?text=...`. Pour pointer vers un numéro précis, remplacer le lien dans `CartDrawer.jsx` :

```js
const whatsappUrl = `https://wa.me/212XXXXXXXXX?text=${encodeURIComponent(whatsappText)}`
```
