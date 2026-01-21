import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  // 1. Valida se o usuário existe e a senha bate
  async validateUser(cpf: string, pass: string): Promise<any> {
    const user = await this.usersService.findByCpf(cpf);
    
    if (user && await bcrypt.compare(pass, user.password)) {
      // Remove a senha do objeto antes de retornar
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // 2. Gera o Token (O Crachá)
async login(user: any) {
    // AGORA É O JEITO CORRETO:
    // Pegamos o valor "isAdmin" direto do banco de dados (user.isAdmin)
    const payload = { 
        username: user.name, 
        sub: user.id, 
        walletId: user.wallet.id,
        isAdmin: user.isAdmin // <--- Lê a verdade do banco
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
          id: user.id,
          name: user.name,
          isAdmin: user.isAdmin // <--- Manda a verdade para o site
      }
    };
  }
}