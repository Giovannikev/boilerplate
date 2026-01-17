# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Initialisation de l'application

Pour initialiser et lancer l'application, suivez les étapes ci-dessous :

### 1. Installation des dépendances

Assurez-vous d'avoir Node.js et npm (ou Yarn) installés sur votre machine. Ensuite, installez les dépendances du projet en exécutant la commande suivante à la racine du projet :

```bash
npm install
# ou
yarn install
```

### 2. Lancement du serveur de développement

Une fois les dépendances installées, vous pouvez démarrer le serveur de développement. Cela lancera l'application en mode développement et ouvrira une instance locale dans votre navigateur.

```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible à l'adresse `http://localhost:5173` (ou un port similaire si 5173 est déjà utilisé).

### 3. Construction de l'application pour la production

Pour construire l'application en vue d'un déploiement en production, utilisez la commande suivante :

```bash
npm run build
# ou
yarn build
```

Ceci créera un dossier `dist` contenant les fichiers optimisés et minifiés de votre application.

## Exécution avec Docker

Pour exécuter l'application en utilisant Docker et Docker Compose, suivez ces étapes :

### 1. Construire les images Docker

À la racine du projet, exécutez la commande suivante pour construire l'image Docker de votre application. Cela compilera votre application et préparera l'image Nginx pour servir les fichiers statiques.

```bash
docker-compose build
```

### 2. Lancer les conteneurs Docker

Une fois l'image construite, vous pouvez lancer les conteneurs en arrière-plan :

```bash
docker-compose up -d
```

L'application sera accessible via votre navigateur à l'adresse `http://localhost:3001` (selon la configuration de votre `docker-compose.yml`).

### 3. Arrêter les conteneurs Docker

Pour arrêter les conteneurs en cours d'exécution :

```bash
docker-compose down
```
