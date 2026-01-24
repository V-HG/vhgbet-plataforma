import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; // Essencial para checar a senha

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  // 1. Valida se o usuário existe e a senha bate
  async validateUser(cpf: string, pass: string): Promise<any> {
    // Busca usando o método otimizado que criamos no UsersService
    const user = await this.usersService.findByCpf(cpf);

    // SE o usuário existe E a senha bate com a criptografia do banco
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result; // Retorna o usuário sem a senha
    }
    
    return null; // Se não achar ou senha errada, retorna null
  }

  // 2. Gera o Token (O App precisa disso para acessar a conta)
  async login(user: any) {
    const payload = { 
      sub: user.id,    // ID do usuário (padrão JWT)
      name: user.name, // Nome para exibir no app
      cpf: user.cpf    // CPF para consultas
    };

    return {
      access_token: this.jwtService.sign(payload), // Cria o código mágico (Token)
    };
  }
}