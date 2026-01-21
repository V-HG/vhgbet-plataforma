import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletModule } from './wallet/wallet.module';
import { GamesModule } from './games/games.module';
import { SportsModule } from './sports/sports.module';
import { UsersModule } from './users/users.module'; // <--- Importe o Módulo
import { AuthModule } from './auth/auth.module';     // <--- Importe o Módulo
import { Wallet } from './wallet/entities/wallet.entity';
import { User } from './users/entities/user.entity'; // <--- Importe a Entidade User
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'admin', // Sua senha local
      database: process.env.DB_NAME || 'vhgbet_db',
      entities: [Wallet, User],
      synchronize: true, // Em produção real, o ideal é usar migrations, mas true funciona para agora
      ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : false, // <--- OBRIGATÓRIO PARA O RENDER
    }),
    WalletModule,
    GamesModule,
    SportsModule,
    UsersModule,
    AuthModule,
    PaymentModule,
  ],
})
export class AppModule {}