import { IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString()
  name: string;

  @IsNotEmpty()
  @Matches(/^\d{11}$/, { message: 'O CPF deve conter exatamente 11 números.' })
  cpf: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { 
    message: 'Senha fraca: precisa de letra maiúscula, minúscula e número.' 
  })
  @Matches(/^(?!.*(\d)\1{2}).*$/, { 
    message: 'Senha insegura: não use sequências repetidas (ex: 111, 000).' 
  })
  password: string;
}