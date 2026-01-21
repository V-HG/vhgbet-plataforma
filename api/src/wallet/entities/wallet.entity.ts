import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid') // Garante que o ID seja compatível com texto (UUID)
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  // --- AQUI ESTA A CORREÇÃO ---
  // Isso ensina a Carteira que ela pertence a um User
  @OneToOne(() => User, (user) => user.wallet)
  user: User;
}