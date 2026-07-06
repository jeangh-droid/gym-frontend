export interface RegistroRequest {
  codigoUniversitario?: string;
  nombreCompleto: string;
  correoInstitucional: string;
  contrasena: string;
  genero: string;
  fechaNacimiento: string; // formato yyyy-MM-dd
  peso: number;
  estatura: number;
  nivel: number;
  objetivo: string;
  diasEntrenamiento?: number;
}