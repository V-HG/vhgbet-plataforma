import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // 1. Usuário pede para depositar
  @UseGuards(AuthGuard('jwt'))
  @Post('deposit')
  create(@Request() req, @Body() body: { amount: number }) {
    // Pega o email do usuário ou usa um fictício se não tiver no cadastro
    const email = req.user.email || 'cliente@vhgbet.com';
    return this.paymentService.createDeposit(req.user.userId, req.user.walletId, body.amount, email);
  }

  // 2. ROTA DE TESTE (Webhook Fake)
  // Use isso para fingir que pagou e ver o saldo cair
  @Post('test/approve')
  async simulateApproval(@Body() body: { walletId: string, amount: number }) {
    return this.paymentService.approvePaymentSimulator(body.walletId, body.amount);
  }
}