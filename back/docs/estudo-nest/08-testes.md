# Estudo 08 - Testes em NestJS

## 📚 Conceitos estudados
- O NestJS suporta testes unitários e de integração com Jest.
- Testes garantem a qualidade e facilitam refatorações.

## 💻 Exemplo testado
```typescript
describe('AppController', () => {
  let appController: AppController;

  beforeEach(() => {
    appController = new AppController();
  });

  it('should return "Hello World!"', () => {
    expect(appController.getHello()).toBe('Hello World!');
  });
});
```

## 📝 Anotações pessoais
- Escrever testes desde o início evita bugs e retrabalho.
