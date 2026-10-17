import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID:
        configService.get<string>('GOOGLE_CLIENT_ID') || 'google-client-id-placeholder',
      clientSecret:
        configService.get<string>('GOOGLE_CLIENT_SECRET') || 'google-client-secret-placeholder',
      callbackURL:
        configService.get<string>('GOOGLE_CALLBACK_URL') ||
        'http://localhost:8002/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails && emails[0] ? emails[0].value : '',
      nombre: name
        ? `${name.givenName || ''} ${name.familyName || ''}`.trim()
        : profile.displayName || 'Usuario Google',
      foto: photos && photos[0] ? photos[0].value : '',
      accessToken,
    };
    done(null, user);
  }
}
