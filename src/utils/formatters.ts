// Formatte le temps de réponse en ms
export function formatResponseTime(ms: number): string {
  return `${ms} ms`;
}

// Retourne une classe CSS selon le code de statut HTTP
export function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) return "status-success";
  if (status >= 400 && status < 500) return "status-warning";
  if (status >= 500) return "status-error";
  return "status-unknown";
}

// Retourne une classe CSS selon la méthode HTTP
export function getMethodColor(method: string): string {
  switch (method) {
    case "GET":
      return "method-get";
    case "POST":
      return "method-post";
    case "PUT":
      return "method-put";
    case "DELETE":
      return "method-delete";
    case "PATCH":
      return "method-patch";
    default:
      return "method-unknown";
  }
} 