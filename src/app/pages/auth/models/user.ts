export interface User {
  id?: number;
  nombre: string;
  apellido: string;
  tipo?: number;
  matricula: number;
  email: string;
  password?: string;
  tipoUsuarioId?: number;
}
