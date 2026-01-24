import { Controller, Post, Body, Get, UseGuards, Request, UnauthorizedException, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. ROTA PÚBLICA: Cadastro
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // 2. ROTA PROTEGIDA: Meu Perfil
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    // CORREÇÃO: O 'cpf' vem do usuário logado (req.user)
    // Buscamos no banco para garantir que o saldo (wallet) venha atualizado
    return this.usersService.findByCpf(req.user.cpf);
  }

  // 3. ROTA ADMIN: Estatísticas
  @UseGuards(AuthGuard('jwt'))
  @Get('admin/stats')
  async getStats(@Request() req) {
    // Verifica se é admin (propriedade vem do Token ou do Banco)
    const user = await this.usersService.findByCpf(req.user.cpf);
    
    if (!user || !user.isAdmin) { 
        throw new UnauthorizedException('Acesso negado: Apenas para o Dono.'); 
    }
    return this.usersService.getSystemStats();
  }

  // 4. ROTA ADMIN: Lista de Usuários
  @UseGuards(AuthGuard('jwt'))
  @Get('admin/list')
  async getAllUsers(@Request() req) {
    const user = await this.usersService.findByCpf(req.user.cpf);

    if (!user || !user.isAdmin) {
        throw new UnauthorizedException('Sai daqui, curioso! Apenas Admin.');
    }
    return this.usersService.findAll();
  }

  // 5. ROTA DE EMERGÊNCIA (Para você virar Admin)
  // Use no navegador: https://seu-site.onrender.com/users/setup-admin/SEU_CPF
  @Get('setup-admin/:cpf')
  async setupAdmin(@Param('cpf') cpf: string) {
    await this.usersService.promoteToAdmin(cpf);
    return { 
        message: `SUCESSO SUPREMO: O CPF ${cpf} agora é ADMIN!`,
        instruction: "Faça Logout e Login no App para ver o painel novo."
    };
  }
}