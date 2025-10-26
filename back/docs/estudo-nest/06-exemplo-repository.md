# Estudo 06 - Repository Pattern com Prisma

## 📚 Conceitos estudados
- O padrão Repository isola a lógica de acesso a dados.
- Facilita testes e manutenção do código.

## 💻 Exemplo testado
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

/**
 * ✅ O que faz: Repositório para manipular usuários no banco.
 * 📌 Onde usar: Para separar regras de negócio do acesso a dados.
 * ⚙️ Como funciona: Usa PrismaService para executar queries.
 */
@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria um novo usuário.
   */
  async createUser(name: string): Promise<void> {
    await this.prisma.user.create({ data: { name } });
  }
}
```

## 📝 Anotações pessoais
- O uso de repositórios deixa o código mais limpo e testável.
