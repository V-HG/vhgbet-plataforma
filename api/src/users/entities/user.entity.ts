import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Wallet } from '../../wallet/entities/wallet.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') // ID Seguro (não é o CPF)
  id: string;

  @Column()
  name: string; // Nome obrigatório para tratamento na plataforma

  @Column({ unique: true, length: 11 }) // TRAVA: Impossível ter 2 iguais
  cpf: string;

 // ... (outros campos)

  @Column()
  password: string;

  @Column({ default: false }) // Por padrão, ninguém é admin
  isAdmin: boolean;

  // ... (resto do arquivo)
  
  @CreateDateColumn()
  createdAt: Date;

  // Cada usuário tem uma carteira
  @OneToOne(() => Wallet, { cascade: true })
  @JoinColumn()
  wallet: Wallet;
}