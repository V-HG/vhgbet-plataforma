import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  // AQUI É O PULO DO GATO
  async validate(payload: any) {
    // Estamos garantindo que o isAdmin passe do Token para o código
    return { 
        userId: payload.sub, 
        username: payload.username, 
        walletId: payload.walletId, // Importante para o jogo
        isAdmin: payload.isAdmin // <--- SE ISSO FALTAR, O ADMIN NÃO FUNCIONA
    };
  }
}