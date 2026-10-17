import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard para iniciar el flujo de autenticación de Google OAuth
 */
@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}
