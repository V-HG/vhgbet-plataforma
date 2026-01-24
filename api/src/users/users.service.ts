import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; 

import { User } from './entities/user.entity';
import { Wallet } from '../wallet/entities/wallet.entity'; 
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 1. Cria usuário novo (Login Seguro)
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({ 
      where: { cpf: createUserDto.cpf } 
    });

    if (existingUser) {
      throw new ConflictException('CPF já cadastrado na plataforma.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.usersRepository.create({
      name: createUserDto.name,
      cpf: createUserDto.cpf,
      password: hashedPassword,
      wallet: new Wallet() 
    });

    try {
      const savedUser = await this.usersRepository.save(newUser);
      const { password, ...result } = savedUser;
      return result;
    } catch (error) {
      console.error("ERRO BANCO:", error);
      throw new BadRequestException('Erro ao criar usuário.');
    }
  }

  // 2. Busca por CPF (Usado no Login)
  async findByCpf(cpf: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { cpf: cpf },
      relations: ['wallet'] 
    });
  }

  // --- MÉTODOS DO ADMIN (QUE TINHAM SUMIDO) ---

  // 3. Listar todos os usuários
  async findAll() {
    return this.usersRepository.find();
  }

  // 4. Promover usuário a Admin
  async promoteToAdmin(cpf: string) {
    const user = await this.findByCpf(cpf);
    if (!user) {
        throw new NotFoundException('Usuário não encontrado para promover.');
    }

    user.isAdmin = true;
    return this.usersRepository.save(user);
  }

  // 5. Estatísticas do Sistema
  async getSystemStats() {
    const totalUsers = await this.usersRepository.count();
    // Podemos adicionar soma de saldos aqui no futuro
    return { 
        totalUsers: totalUsers,
        active: true 
    };
  }
}