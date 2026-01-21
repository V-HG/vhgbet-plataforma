import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { WalletModule } from '../wallet/wallet.module'; // Importe aqui

@Module({
  imports: [WalletModule], // Adicione aqui
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}