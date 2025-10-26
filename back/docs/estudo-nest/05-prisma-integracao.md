# Estudo 05 - Integração do Prisma com NestJS

## 📚 Conceitos estudados
- Prisma é um ORM moderno para Node.js e TypeScript, facilitando o acesso a bancos de dados.
- A integração com NestJS é feita via um service customizado (PrismaService).

## 💻 Exemplo testado
```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * ✅ O que faz: Service que encapsula o Prisma Client.
 * 📌 Onde usar: Para acessar o banco de dados em qualquer parte da aplicação.
 * ⚙️ Como funciona: Estende PrismaClient e conecta ao iniciar o módulo.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

## 📝 Anotações pessoais
- O PrismaService pode ser injetado em outros services e controllers.
- O schema do Prisma define os modelos do banco de dados.
