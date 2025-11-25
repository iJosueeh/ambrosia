// Define la estructura de datos que el backend envia
// y que el frontend consumirá.

export interface DashboardStats {
  totalUsuarios: number;
  recursosPublicados: number;
  hilosActivos: number;
  nuevosRegistrosMes: number;
}

export interface UserGrowth {
  labels: string[];
  data: number[];
}

export interface RecentActivity {
  tipo: string;
  descripcion: string;
  fecha: string; // La fecha viene como un string en formato ISO desde el backend
}

// El objeto principal que agrupa toda la data del dashboard
export interface AdminDashboardData {
  stats: DashboardStats;
  userGrowth: UserGrowth;
  recentActivity: RecentActivity[];
}