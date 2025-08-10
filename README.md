# 🚀 API Supervision Dashboard

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.5.0-green.svg)](https://www.chartjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Dashboard moderne et interactif pour la supervision et l'analyse des performances de vos APIs en temps réel**

## 📋 Table des matières

- [🎯 Vue d'ensemble](#-vue-densemble)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Technologies utilisées](#️-technologies-utilisées)
- [📦 Prérequis](#-prérequis)
- [🚀 Installation et configuration](#-installation-et-configuration)
- [🎨 Composants principaux](#-composants-principaux)
- [📊 Services et API](#-services-et-api)
- [🧪 Tests](#-tests)
- [📱 Interface utilisateur](#-interface-utilisateur)
- [🔧 Configuration](#-configuration)
- [📈 Déploiement](#-déploiement)
- [🤝 Contribution](#-contribution)
- [📄 Licence](#-licence)

## 🎯 Vue d'ensemble

L'**API Supervision Dashboard** est une application web moderne développée avec React et TypeScript, conçue pour offrir une vue d'ensemble complète et en temps réel de vos APIs. Elle combine des métriques clés, des visualisations interactives et des tableaux de données pour faciliter la prise de décision et le monitoring des performances.

### 🎯 Objectifs du projet

- **Monitoring en temps réel** : Surveillance continue des performances de vos APIs
- **Visualisation intuitive** : Graphiques et tableaux interactifs pour une analyse rapide
- **Alertes et notifications** : Détection proactive des anomalies et des problèmes
- **Interface responsive** : Accessible sur tous les appareils et navigateurs
- **Performance optimisée** : Chargement rapide et expérience utilisateur fluide

## ✨ Fonctionnalités

### 📊 **Métriques et KPIs**
- **Taux de succès** : Pourcentage de requêtes réussies vs échecs
- **Latence moyenne** : Temps de réponse des APIs
- **Débit** : Nombre de requêtes par seconde/minute
- **Erreurs** : Classification et analyse des codes d'erreur
- **Utilisation des ressources** : CPU, mémoire, bande passante

### 📈 **Visualisations avancées**
- **Graphiques temporels** : Évolution des métriques dans le temps
- **Graphiques de corrélation 2D** : Analyse des relations entre variables
- **Graphiques en donut** : Répartition des types de requêtes/erreurs
- **Tableaux interactifs** : Données filtrables et triables
- **Dashboard personnalisable** : Widgets configurables selon vos besoins

### 🔍 **Analyse et reporting**
- **Filtres avancés** : Par date, endpoint, type de requête, etc.
- **Export de données** : Formats CSV, JSON, PDF
- **Historique complet** : Conservation des données pour analyse rétrospective
- **Alertes configurables** : Seuils personnalisables pour chaque métrique

## 🏗️ Architecture

```
api-dashboard/
├── 📁 src/
│   ├── 🧩 components/          # Composants React réutilisables
│   ├── 🎣 hooks/              # Hooks personnalisés React
│   ├── 🔧 services/           # Services pour l'API et la logique métier
│   ├── 📝 types/              # Définitions TypeScript
│   ├── 🎨 styles/             # Fichiers CSS et styles
│   └── 📱 pages/              # Pages principales de l'application
├── 📁 public/                 # Assets statiques
├── 📁 docs/                   # Documentation technique
└── 📁 tests/                  # Tests unitaires et d'intégration
```

### 🏛️ **Patterns architecturaux**
- **Architecture modulaire** : Séparation claire des responsabilités
- **Composants fonctionnels** : Utilisation des hooks React modernes
- **Services centralisés** : Logique métier isolée et réutilisable
- **Type safety** : TypeScript pour la robustesse du code
- **Responsive design** : Mobile-first approach

## 🛠️ Technologies utilisées

### **Frontend**
- **React 19.1.0** : Bibliothèque UI moderne et performante
- **TypeScript 5.8.3** : Typage statique pour la robustesse
- **Chart.js 4.5.0** : Graphiques interactifs et responsifs
- **React Chart.js 2** : Intégration React pour Chart.js
- **Axios 1.11.0** : Client HTTP pour les appels API
- **Lucide React** : Icônes modernes et cohérentes

### **Styling et UI**
- **CSS Modules** : Styles modulaires et encapsulés
- **Responsive Design** : Interface adaptative multi-appareils
- **Modern CSS** : Flexbox, Grid, Variables CSS

### **Outils de développement**
- **React Scripts 5.0.1** : Configuration et build automatiques
- **ESLint** : Linting et qualité du code
- **Jest** : Framework de tests
- **Web Vitals** : Métriques de performance web

## 📦 Prérequis

### **Système**
- **Node.js** : Version 18.x ou supérieure (LTS recommandé)
- **npm** : Version 9.x ou supérieure
- **Git** : Pour le clonage du dépôt

### **Navigateurs supportés**
- **Chrome** : Version 90+
- **Firefox** : Version 88+
- **Safari** : Version 14+
- **Edge** : Version 90+

### **Ressources système**
- **RAM** : Minimum 4GB (8GB recommandé)
- **Stockage** : 500MB d'espace libre
- **Réseau** : Connexion internet stable pour les dépendances

## 🚀 Installation et configuration

### **1. Clonage du dépôt**

```bash
# Cloner le dépôt principal
git clone https://github.com/votre-username/api-dashboard.git

# Accéder au répertoire
cd api-dashboard

# Vérifier la branche actuelle
git branch -a
```

### **2. Installation des dépendances**

```bash
# Installation des dépendances principales
npm install

# Vérification de l'installation
npm list --depth=0
```

### **3. Configuration de l'environnement**

```bash
# Créer le fichier d'environnement
cp .env.example .env

# Éditer les variables d'environnement
nano .env
```

**Variables d'environnement principales :**
```env
# Configuration de l'API backend
REACT_APP_API_BASE_URL=http://localhost:8090
REACT_APP_API_TIMEOUT=30000

# Configuration de l'environnement
REACT_APP_ENV=development
REACT_APP_DEBUG=true

# Configuration des métriques
REACT_APP_METRICS_INTERVAL=5000
REACT_APP_HISTORY_DAYS=30
```

### **4. Lancement de l'application**

```bash
# Mode développement
npm start

# Mode production (build)
npm run build

# Tests
npm test

# Tests avec couverture
npm run test:coverage
```

## 🎨 Composants principaux

### **📊 Dashboard Header (`DashboardHeader.tsx`)**
- Navigation principale de l'application
- Sélecteur de période et de contexte
- Notifications et alertes en temps réel
- Recherche globale

### **📈 Métriques Grid (`MetricsGrid.tsx`)**
- Affichage des KPIs principaux
- Cartes métriques avec indicateurs visuels
- Comparaison avec les périodes précédentes
- Alertes et seuils

### **📋 Tableau API (`ApiTable.tsx`)**
- Liste des endpoints et leurs métriques
- Filtres et tri avancés
- Actions rapides (test, documentation)
- Export des données

### **📊 Graphiques (`Chart.tsx`, `RequestEvolutionChart.tsx`)**
- Visualisations temporelles des métriques
- Graphiques de corrélation 2D
- Personnalisation des axes et légendes
- Export des graphiques

### **🔍 Corrélation 2D (`ApiCorrelation2D.tsx`)**
- Analyse des relations entre variables
- Nuage de points interactif
- Zoom et pan sur les données
- Sélection de métriques

## 📊 Services et API

### **🔧 Services principaux**

#### **API Usage Service (`apiUsageService.ts`)**
```typescript
// Exemple d'utilisation
import { getApiUsageMetrics } from '../services/apiUsageService';

const metrics = await getApiUsageMetrics({
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  endpoints: ['/users', '/products']
});
```

#### **Endpoint Call Service (`endpointCallService.ts`)**
- Gestion des appels aux endpoints
- Retry automatique en cas d'échec
- Cache intelligent des réponses
- Gestion des timeouts

#### **Request Evolution Service (`requestEvolutionService.ts`)**
- Analyse des tendances temporelles
- Détection des anomalies
- Prédictions basées sur l'historique
- Alertes proactives

#### **Trace Table Service (`traceTableService.ts`)**
- Suivi des requêtes individuelles
- Analyse des chaînes d'appels
- Performance détaillée par étape
- Debugging avancé

### **🌐 Intégration API**

#### **Endpoints principaux**
```typescript
// Configuration des endpoints
const API_ENDPOINTS = {
  METRICS: '/api/v1/metrics',
  ENDPOINTS: '/api/v1/endpoints',
  EVOLUTION: '/api/v1/evolution',
  TRACES: '/api/v1/traces',
  ALERTS: '/api/v1/alerts'
};
```

#### **Gestion des erreurs**
- Retry automatique avec backoff exponentiel
- Fallback vers des données en cache
- Notifications utilisateur en temps réel
- Logs détaillés pour le debugging

## 🧪 Tests

### **Structure des tests**
```
tests/
├── unit/              # Tests unitaires
├── integration/       # Tests d'intégration
├── e2e/              # Tests end-to-end
└── fixtures/         # Données de test
```

### **Exécution des tests**

```bash
# Tests unitaires
npm test

# Tests avec watch mode
npm test -- --watch

# Tests avec couverture
npm run test:coverage

# Tests spécifiques
npm test -- --testNamePattern="Dashboard"

# Tests d'intégration
npm run test:integration
```

### **Couverture de code**
- **Objectif** : > 80% de couverture
- **Types de tests** : Unitaires, intégration, E2E
- **Outils** : Jest, React Testing Library
- **CI/CD** : Intégration automatique

## 📱 Interface utilisateur

### **🎨 Design System**
- **Palette de couleurs** : Cohérente et accessible
- **Typographie** : Hiérarchie claire et lisible
- **Espacement** : Grille 8px pour la cohérence
- **Composants** : Bibliothèque de composants réutilisables

### **📱 Responsive Design**
- **Mobile First** : Approche mobile-first
- **Breakpoints** : xs, sm, md, lg, xl
- **Navigation** : Menu hamburger sur mobile
- **Touch** : Optimisé pour les interactions tactiles

### **♿ Accessibilité**
- **WCAG 2.1 AA** : Conformité aux standards
- **Navigation clavier** : Support complet du clavier
- **Lecteurs d'écran** : Labels et descriptions appropriés
- **Contraste** : Ratios de contraste optimaux

## 🔧 Configuration

### **Configuration de l'application**

```typescript
// src/config/app.config.ts
export const APP_CONFIG = {
  // Intervalles de rafraîchissement
  REFRESH_INTERVALS: {
    METRICS: 5000,      // 5 secondes
    ALERTS: 10000,      // 10 secondes
    EVOLUTION: 30000    // 30 secondes
  },
  
  // Limites et seuils
  LIMITS: {
    MAX_ENDPOINTS: 1000,
    MAX_HISTORY_DAYS: 365,
    MAX_TRACES: 10000
  },
  
  // Configuration des graphiques
  CHARTS: {
    DEFAULT_HEIGHT: 400,
    ANIMATION_DURATION: 750,
    COLORS: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
  }
};
```

### **Configuration des métriques**

```typescript
// Configuration des alertes
const ALERT_CONFIG = {
  LATENCY: {
    WARNING: 1000,    // 1 seconde
    CRITICAL: 3000    // 3 secondes
  },
  ERROR_RATE: {
    WARNING: 0.05,    // 5%
    CRITICAL: 0.10    // 10%
  },
  THROUGHPUT: {
    WARNING: 100,     // 100 req/s
    CRITICAL: 50      // 50 req/s
  }
};
```

## 📈 Déploiement

### **Environnements**

#### **Développement**
```bash
npm start
# http://localhost:3000
```

#### **Staging**
```bash
npm run build:staging
npm run deploy:staging
```

#### **Production**
```bash
npm run build:production
npm run deploy:production
```

### **Docker**

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build et exécution
docker build -t api-dashboard .
docker run -p 3000:3000 api-dashboard
```

### **CI/CD Pipeline**

```yaml
# .github/workflows/deploy.yml
name: Deploy Dashboard

on:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
```

## 🤝 Contribution

### **Comment contribuer**

1. **Fork** le projet
2. **Créez** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commitez** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Poussez** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

### **Standards de code**

- **ESLint** : Respect des règles de linting
- **Prettier** : Formatage automatique du code
- **Conventional Commits** : Format des messages de commit
- **Tests** : Nouveaux tests pour les nouvelles fonctionnalités

### **Structure des branches**

```
main          # Branche principale (production)
develop       # Branche de développement
feature/*     # Nouvelles fonctionnalités
bugfix/*      # Corrections de bugs
hotfix/*      # Corrections urgentes
release/*     # Préparations de release
```

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🆘 Support et contact

- **Documentation** : [docs/](docs/)
- **Issues** : [GitHub Issues](https://github.com/votre-username/api-dashboard/issues)
- **Discussions** : [GitHub Discussions](https://github.com/votre-username/api-dashboard/discussions)
- **Email** : support@votre-entreprise.com

## 🙏 Remerciements

- **React Team** pour l'excellent framework
- **Chart.js** pour les visualisations
- **Communauté open source** pour les contributions
- **Contributeurs** de ce projet

---

<div align="center">
  <p>⭐ Si ce projet vous a aidé, n'oubliez pas de le star sur GitHub ! ⭐</p>
  <p>Made with ❤️ by l'équipe API Dashboard</p>
</div>

