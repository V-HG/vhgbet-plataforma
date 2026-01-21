import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class PaymentService {
  private client: MercadoPagoConfig;

  constructor(private walletService: WalletService) {
    // ⚠️ LEMBRE-SE DE COLOCAR SEU ACCESS TOKEN DO MERCADO PAGO AQUI
    this.client = new MercadoPagoConfig({ 
        accessToken: 'TEST-5888185704222275-012019-80609cb6f96de7d10d45f429e8061834-269371478', 
        options: { timeout: 5000 } 
    });
  }

  // 1. Gera o PIX
  async createDeposit(userId: string, walletId: string, amount: number, email: string) {
    const payment = new Payment(this.client);

    try {
      const response = await payment.create({
        body: {
          transaction_amount: amount,
          description: 'Depósito VHG BET',
          payment_method_id: 'pix',
          payer: {
            email: email || 'user@vhgbet.com' 
          },
          external_reference: walletId, 
        }
      });

      // AQUI ESTAVA O ERRO: Adicionamos ?. para evitar erro se vier vazio
      return {
        id: response.id,
        qr_code: response.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: response.point_of_interaction?.transaction_data?.qr_code_base64,
        status: response.status
      };
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao gerar PIX no Mercado Pago');
    }
  }

  // 2. Simula o Webhook (Para testar em localhost)
  async approvePaymentSimulator(walletId: string, amount: number) {
    console.log(`💰 Aprovando depósito de R$ ${amount} para carteira ${walletId}`);
    
    // Chama a função nova da carteira
    await this.walletService.updateBalance(walletId, amount);
    
    return { message: "Pagamento aprovado e saldo adicionado!" };
  }
}