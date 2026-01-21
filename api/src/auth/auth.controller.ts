import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body) {
    // Verifica manualmente para este exemplo simples
    const user = await this.authService.validateUser(body.cpf, body.password);
    if (!user) {
      throw new UnauthorizedException('CPF ou senha inválidos');
    }
    return this.authService.login(user);
  }
}