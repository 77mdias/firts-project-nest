# Estudo 07 - Validação e DTOs no NestJS

## 📚 Conceitos estudados
- DTOs (Data Transfer Objects) definem o formato dos dados recebidos/enviados.
- A validação é feita com decorators e pipes, como ValidationPipe.

## 💻 Exemplo testado
```typescript
import { IsString, Length } from 'class-validator';

/**
 * DTO para criação de usuário.
 */
export class CreateUserDto {
  @IsString()
  @Length(3, 50)
  name: string;
}
```

## 📝 Anotações pessoais
- O uso de DTOs e validação previne dados inválidos e facilita manutenção.
