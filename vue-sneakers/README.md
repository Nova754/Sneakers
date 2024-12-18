# SNEAKERS

## Documentation du frontend (vue-sneakers)

### Installation et Configutation

**Vue.js** : framework JavaScript utilisé pour construire des interfaces utilisateur et des applications web interactives

#### Étape 1 : Installer les dépendances Node.js
On utilise :
- axios : permet de faire des requêtes HTTP (GET, POST, PUT, DELETE, etc.) avec le JavaScript, facilitant la communication avec une API
```
cd vue-sneakers
npm install axios
```

#### Étape 2 : Démarrer le serveur
```
cd vue-sneakers
npm run serve
```

### Structure du projet Vue
```
sneaker-shop-frontend/
├── public/                  # Fichiers publics (index.html, favicon, etc.)
├── src/                     # Source du code frontend
│   ├── assets/              # Images
│   ├── components/          # Composants Vue.js 
│   ├── views/               # Pages principales de l'application 
│   ├── router/              # Configuration du routing
│   ├── store/               # Vuex Store pour la gestion de l'état
│   ├── App.vue              # Composant racine de l'application
│   └── main.js              # Point d'entrée de l'application
├── .gitignore               # Fichiers à ignorer par Git
├── package.json             # Dépendances et scripts npm
└── vue.config.js            # Configuration spécifique à Vue.js
```
- **src/components/** */ : Contient tous les composants Vue.js réutilisables : Navbar
- **src/views/** */ : Contient les vues principales de l’application : Home, Login, Register, Wishlist, Collection et Dashboard (admin)
- **src/router/** */ : Contient la configuration des routes pour le projet avec vue-router.
- **src/store/** */ : Contient la gestion de l’état avec Vuex (par exemple le login et le register)

### Scripts utiles

Voici quelques commandes utiles pour le développement :
- **npm run serve** : Démarre le serveur de développement local.
- **npm run build** : Compile le projet pour la production (création d’un dossier dist/ optimisé).
- **npm run lint** : Vérifie le code avec ESLint.
- **npm run test** : Lance les tests unitaires du projet.
