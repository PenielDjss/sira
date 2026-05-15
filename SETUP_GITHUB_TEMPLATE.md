# Configuration du dépôt GitHub pour les templates

## 📋 Instructions

Pour que le CLI Sira fonctionne correctement, vous devez créer un dépôt GitHub contenant le template HERMÈS.

### Étape 1 : Créer le dépôt GitHub

1. Allez sur GitHub et créez un nouveau dépôt public
2. Nom suggéré : `sira-templates`
3. Ne pas initialiser avec README, .gitignore ou licence

### Étape 2 : Pousser le template HERMÈS

```bash
# Depuis le répertoire /home/pniel/sira
cd sira-templates

# Initialiser git si ce n'est pas déjà fait
git init

# Ajouter tous les fichiers
git add .

# Commit
git commit -m "Initial commit: HERMÈS template"

# Ajouter le remote (remplacez USERNAME par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/USERNAME/sira-templates.git

# Pousser vers GitHub
git push -u origin main
```

### Étape 3 : Mettre à jour le chemin dans stacks.ts

Une fois le dépôt créé, mettez à jour le chemin dans `src/stacks.ts` :

```typescript
repo: 'USERNAME/sira-templates/hermes',
```

Remplacez `USERNAME` par votre nom d'utilisateur GitHub.

### Étape 4 : Rebuild et tester

```bash
# Rebuild le CLI
npm run build

# Tester la création d'un projet
sira create
```

## 🔍 Structure attendue du dépôt

```
sira-templates/
└── hermes/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    ├── .gitignore
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx
    │   ├── App.css
    │   ├── index.css
    │   └── vite-env.d.ts
    └── public/
        └── vite.svg
```

## ✅ Vérification

Pour vérifier que tout fonctionne :

1. Le dépôt doit être public sur GitHub
2. Le chemin doit être : `USERNAME/sira-templates/hermes`
3. Le dossier `hermes` doit contenir tous les fichiers du template

## 🐛 Debugging

Si vous rencontrez des erreurs lors de la création d'un projet, le CLI affichera maintenant :

- 📦 Le chemin du dépôt GitHub utilisé
- 📁 Le répertoire cible
- ℹ️ Les messages d'information de tiged
- ⚠️ Les avertissements
- ❌ Les erreurs détaillées avec stack trace

Cela vous aidera à identifier rapidement le problème !