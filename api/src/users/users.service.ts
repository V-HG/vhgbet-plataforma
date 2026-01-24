import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; // Importante para criptografar senha

import { User } from './entities/user.entity';
import { Wallet } from '../wallet/entities/wallet.entity'; // Ajuste o caminho se necessário
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  findOne(arg0: { where: { cpf: string; }; }) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 1. Cria usuário novo (Com senha segura e carteira zerada)
  async create(createUserDto: CreateUserDto) {
    // Verifica se já existe (usando usersRepository correto)
    const existingUser = await this.usersRepository.findOne({ 
      where: { cpf: createUserDto.cpf } 
    });

    if (existingUser) {
      throw new ConflictException('CPF já cadastrado na plataforma.');
    }

    // Criptografia da senha
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Cria o objeto do usuário
    const newUser = this.usersRepository.create({
      name: createUserDto.name,
      cpf: createUserDto.cpf,
      password: hashedPassword,
      wallet: new Wallet() // A mágica: Cria a carteira automaticamente aqui
    });

    try {
      // Salva no banco
      const savedUser = await this.usersRepository.save(newUser);
      
      // Remove a senha do retorno para segurança
      const { password, ...result } = savedUser;
      return result;

    } catch (error) {
      console.error("ERRO REAL DO BANCO:", error);
      throw new BadRequestException('Erro ao criar usuário. Verifique os dados.');
    }
  }

  // 2. Busca por CPF (Unificado e corrigido)
  // Útil para login e para validações internas
  async findByCpf(cpf: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { cpf: cpf },
      relations: ['wallet'] // Traz a carteira junto (importante para ver saldo)
    });
  }
}