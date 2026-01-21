import { Controller, Post, Body, Get, UseGuards, Request, UnauthorizedException, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ROTA PÚBLICA: Cadastro
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // ROTA PROTEGIDA: Meu Perfil
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  // ROTA ADMIN: Estatísticas
  @UseGuards(AuthGuard('jwt'))
  @Get('admin/stats')
  async getStats(@Request() req) {
    if (!req.user.isAdmin) { 
        throw new UnauthorizedException('Apenas o Dono pode ver isso.'); 
    }
    return this.usersService.getSystemStats();
  }

  // ROTA ADMIN: Lista de Usuários
  @UseGuards(AuthGuard('jwt'))
  @Get('admin/list')
  async getAllUsers(@Request() req) {
    if (!req.user.isAdmin) {
        throw new UnauthorizedException('Sai daqui, curioso!');
    }
    return this.usersService.findAll();
  }

  // --- ROTA DE CONFIGURAÇÃO (USE UMA VEZ E DEPOIS APAGUE) ---
  // Transforma um CPF em Admin
  // Exemplo de uso no navegador: http://localhost:3000/users/setup-admin/12345678900
// ... (outros códigos acima)

  // ROTA DE EMERGÊNCIA PARA VIRAR ADMIN
  @Get('setup-admin/:cpf')
  async setupAdmin(@Param('cpf') cpf: string) {
    await this.usersService.promoteToAdmin(cpf); // Essa função muda no banco
    return { message: `SUCESSO: O CPF ${cpf} agora é o CHEFÃO! Faça logout e login novamente.` };
  }
}