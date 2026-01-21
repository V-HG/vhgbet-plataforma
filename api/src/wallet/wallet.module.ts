import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Wallet } from './entities/wallet.entity';

@Module({
  // Registra a Tabela Wallet no banco
  imports: [TypeOrmModule.forFeature([Wallet])], 
  controllers: [WalletController],
  providers: [WalletService],
  // A LINHA MÁGICA: Exporta o serviço para ser usado no Jogo
  exports: [WalletService], 

})
export class WalletModule {}