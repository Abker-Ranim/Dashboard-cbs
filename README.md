# 🚀 API Supervision Dashboard

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.5.0-green.svg)](https://www.chartjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Dashboard moderne et interactif pour la supervision et l'analyse des performances de vos APIs en temps réel**



L'**API Supervision Dashboard** est une application web moderne développée avec React et TypeScript, conçue pour offrir une vue d'ensemble complète et en temps réel de vos APIs. Elle combine des métriques clés, des visualisations interactives et des tableaux de données pour faciliter la prise de décision et le monitoring des performances.

### 🎯 Objectifs du projet

- **Monitoring en temps réel** : Surveillance continue des performances de vos APIs
- **Visualisation intuitive** : Graphiques et tableaux interactifs pour une analyse rapide
- **Interface responsive** : Accessible sur tous les appareils et navigateurs
- **Performance optimisée** : Chargement rapide et expérience utilisateur fluide

## ✨ Fonctionnalités

### 📊 **Métriques et KPIs**
- **Taux de succès** : Pourcentage de requêtes réussies vs échecs
- **Latence moyenne** : Temps de réponse des APIs
- **Débit** : Nombre de requêtes par seconde/minute
- **Erreurs** : Classification et analyse des codes d'erreur

### 📈 **Visualisations avancées**
- **Graphiques temporels** : Évolution des métriques dans le temps
- **Graphiques de corrélation 2D** : Analyse des relations entre variables
- **Graphiques en donut** : Répartition des types de requêtes/erreurs
- **Tableaux interactifs** : Données filtrables et triables
- **Dashboard personnalisable** : Widgets configurables selon vos besoins


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


## 📦 Prérequis

### **Système**
- **Node.js** : Version 18.x ou supérieure (LTS recommandé)
- **npm** : Version 9.x ou supérieure
- **Git** : Pour le clonage du dépôt


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
npm install

```

### **3. Lancement de l'application**

```bash
# Mode développement
npm start

