import { Injectable, BadRequestException } from '@nestjs/common';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class GamesService {
  constructor(private walletService: WalletService) {}

  async spin(userId: string, walletId: string, betAmount: number) {
    if (betAmount <= 0) throw new BadRequestException('Aposta inválida');

    // 1. Desconta o valor da aposta
    await this.walletService.processTransaction(walletId, -betAmount);

    // Lógica do Jogo (30% de chance de ganhar)
    const grid = this.generateGrid();
    const isWin = Math.random() < 0.3; 
    let winAmount = 0;

    if (isWin) {
      winAmount = betAmount * 2; // Multiplicador 2x
      await this.walletService.processTransaction(walletId, winAmount);
    }

    // 2. Busca o saldo final
    const finalWallet = await this.walletService.findOne(walletId);
    
    return {
      grid,
      winAmount,
      newBalance: Number(finalWallet?.balance || 0)
    };
  }

  // Gera o grid visual
  private generateGrid() {
    const symbols = ['tigre', 'pote', 'moeda', 'dragão', 'wild'];
    
    // CORREÇÃO: Definimos o tipo explícito aqui (string[][])
    const grid: string[][] = []; 
    
    for (let i = 0; i < 3; i++) {
      // CORREÇÃO: Definimos o tipo explícito aqui também (string[])
      const row: string[] = []; 
      
      for (let j = 0; j < 3; j++) {
        row.push(symbols[Math.floor(Math.random() * symbols.length)]);
      }
      grid.push(row);
    }
    return grid;
  }
}