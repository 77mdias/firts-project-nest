# Estudo 03 - Service Básico com Comentários

## 📚 Conceitos estudados
- Services encapsulam a lógica de negócio e podem ser injetados em controllers.
- O decorator @Injectable() indica que a classe pode ser gerenciada pelo NestJS.

## 💻 Exemplo testado
```typescript
import { Injectable } from '@nestjs/common';

/**
 * ✅ O que faz: Serviço que retorna uma mensagem de hello world.
 * 📌 Onde usar: Para lógica de negócio reutilizável.
 * ⚙️ Como funciona: Pode ser injetado em controllers via construtor.
 */
@Injectable()
export class AppService {
  /**
   * ✅ O que faz: Retorna uma mensagem de hello world.
   * 📌 Onde usar: Em qualquer controller que precise dessa mensagem.
   * ⚙️ Como funciona: Função simples que retorna uma string.
   */
  getHello(): string {
    return 'Hello World!';
  }
}
```

## 📝 Anotações pessoais
- Services promovem reutilização e separação de responsabilidades.
- Sempre comentar o propósito e funcionamento das funções.
