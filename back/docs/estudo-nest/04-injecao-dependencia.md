# Estudo 04 - Injeção de Dependência no NestJS

## 📚 Conceitos estudados
- O NestJS utiliza injeção de dependência para gerenciar instâncias de classes (services, repositories, etc).
- Providers são declarados nos módulos e podem ser injetados em controllers e outros services.

## 💻 Exemplo testado
```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * ✅ O que faz: Define o módulo principal da aplicação.
 * 📌 Onde usar: Todo projeto NestJS precisa de pelo menos um módulo.
 * ⚙️ Como funciona: O decorator @Module organiza controllers e providers.
 */
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## 📝 Anotações pessoais
- A injeção de dependência facilita testes e manutenção.
- Providers podem ser services, repositórios, factories, etc.
