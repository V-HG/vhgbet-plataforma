import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,
  ) {}

  // 1. Busca Carteira (Agora aceita STRING/UUID)
  // Corrige o erro: "Argument of type 'string' is not assignable..."
  async findOne(id: string) {
    const wallet = await this.walletRepo.findOne({ where: { id } });
    if (!wallet) {
       // Se não achar, tenta buscar pelo ID do usuário (caso tenha passado user id por engano)
       // Isso é uma segurança extra
       return this.walletRepo.findOne({ where: { user: { id } } });
    }
    return wallet;
  }

  // 2. Usado pelo JOGO (Apostar e Ganhar)
  // Corrige o erro: "Property 'processTransaction' does not exist"
  async processTransaction(walletId: string, amount: number) {
    // Busca a carteira
    const wallet = await this.walletRepo.findOne({ where: { id: walletId } });
    
    if (!wallet) throw new NotFoundException('Carteira não encontrada');

    const novoSaldo = Number(wallet.balance) + Number(amount);

    // Se for aposta (valor negativo) e não tiver saldo, bloqueia
    if (amount < 0 && novoSaldo < 0) {
      throw new BadRequestException('Saldo insuficiente para aposta');
    }

    wallet.balance = novoSaldo;
    return this.walletRepo.save(wallet);
  }

  // 3. Usado pelo PIX (Depositar)
  // Corrige o erro: "Property 'updateBalance' does not exist"
  async updateBalance(walletId: string, amount: number) {
    const wallet = await this.walletRepo.findOne({ where: { id: walletId } });
    
    if (!wallet) throw new NotFoundException('Carteira não encontrada');

    wallet.balance = Number(wallet.balance) + Number(amount);
    return this.walletRepo.save(wallet);
  }
}