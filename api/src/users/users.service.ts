import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Wallet } from 'src/wallet/entities/wallet.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // 1. Cria usuário novo (Com senha segura e carteira zerada)
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepo.findOne({ where: { cpf: createUserDto.cpf } });
    if (existingUser) {
      throw new ConflictException('CPF já cadastrado na plataforma.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.userRepo.create({
      name: createUserDto.name,
      cpf: createUserDto.cpf,
      password: hashedPassword,
      wallet: new Wallet() // Cria carteira automaticamente
    });

    try {
      const savedUser = await this.userRepo.save(newUser);
      const { password, ...result } = savedUser;
      return result;
    } catch (error) {
      console.error("ERRO REAL DO BANCO:", error); // <--- O X-9
      throw new BadRequestException('Erro ao criar usuário.');
    }
  }

  // 2. Busca para o Login (Retorna null se não achar, para evitar erros)
  async findByCpf(cpf: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { cpf }, relations: ['wallet'] });
  }
  
  // 3. Busca Perfil pelo ID
  async findOne(id: string) {
     return this.userRepo.findOne({ where: { id }, relations: ['wallet'] });
  }

  // 4. ADMIN: Lista todos os usuários
  findAll() {
    return this.userRepo.find({ relations: ['wallet'] });
  }

  // 5. ADMIN: Calcula estatísticas do cassino
  async getSystemStats() {
    const users = await this.userRepo.find({ relations: ['wallet'] });
    
    // Total nas mãos dos jogadores
    const totalPlayerBalance = users.reduce((acc, user) => acc + Number(user.wallet.balance), 0);
    
    return {
      totalUsers: users.length,
      totalPlayerBalance,
      houseProfit: 10000 - totalPlayerBalance // Exemplo: Caixa inicial de 10k - Passivo
    };
  }

  // 6. SETUP: Promove um CPF para virar Dono (Admin)
  async promoteToAdmin(cpf: string) {
    const user = await this.userRepo.findOne({ where: { cpf } });
    if (!user) {
        throw new BadRequestException('Usuário não encontrado para promoção.');
    }
    user.isAdmin = true;
    return this.userRepo.save(user);
  }
}