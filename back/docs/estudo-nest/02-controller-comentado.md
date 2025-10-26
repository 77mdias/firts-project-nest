# Estudo 02 - Controller Básico com Comentários

## 📚 Conceitos estudados
- Controllers são responsáveis por mapear rotas e responder requisições HTTP.
- Decorators como @Controller e @Get definem o comportamento das rotas.

## 💻 Exemplo testado
```typescript
import { Controller, Get } from '@nestjs/common';

/**
 * ✅ O que faz: Define o controlador principal da aplicação.
 * 📌 Onde usar: Em qualquer aplicação NestJS para mapear rotas.
 * ⚙️ Como funciona: O decorator @Controller() indica que a classe é um controller.
 */
@Controller()
export class AppController {
  /**
   * ✅ O que faz: Retorna uma mensagem de hello world.
   * 📌 Onde usar: Rota GET principal do sistema.
   * ⚙️ Como funciona: Ao acessar '/', retorna a string.
   */
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
```

## 📝 Anotações pessoais
- Cada método pode ser decorado com o verbo HTTP correspondente (@Get, @Post, etc).
- Comentários detalhados ajudam a entender o propósito de cada função.
