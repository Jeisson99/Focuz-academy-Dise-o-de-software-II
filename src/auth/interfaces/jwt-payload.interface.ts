// Interfaz que define la estructura del payload del JWT
export interface JwtPayload {
  sub: string; // ID del usuario
  email: string; // Email del usuario
}
