// src/services/apiUsageService.ts
import { ApiCall } from "../types/api";

// Interface pour les données d'utilisation des API
export interface ApiUsageData {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export const generateApiUsageData = (apiCalls: ApiCall[]): ApiUsageData[] => {
  // Vérification des données
  if (!apiCalls || apiCalls.length === 0) return [];

  // Regroupement par nom d'API et comptage des occurrences
  const apiCounts = apiCalls.reduce((acc, call) => {
    acc[call.name] = (acc[call.name] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Conversion en tableau d'objets avec totaux
  const apiEntries = Object.entries(apiCounts);
  const totalCalls = apiEntries.reduce((sum, [, count]) => sum + count, 0);

  // Génération des données avec pourcentages et couleurs
  return apiEntries.map(([name, count]) => ({
    name,
    count,
    percentage: totalCalls > 0 ? (count / totalCalls) * 100 : 0,
    color: getColorForApi(name), // Assignation des couleurs basées sur le nom
  }));
};

// Fonction pour assigner des couleurs en fonction du nom de l'API
const getColorForApi = (apiName: string): string => {
  const apiColors: { [key: string]: string } = {
    getaccount: " #10B981", 
    getcustomer: "#EF4444", 
    gethistory: "#F59E0B",
    dotransfer: "#3B82F6",
    // Ajouter d'autres mappings si nécessaire
  };
  return apiColors[apiName.toLowerCase()] || "#6B7280"; // Couleur par défaut si non mappée
};