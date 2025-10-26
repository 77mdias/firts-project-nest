# Estudo 01 - Instalação e Estrutura Inicial do NestJS

## 📚 Conceitos estudados
- O NestJS é um framework Node.js para aplicações escaláveis, usando TypeScript e arquitetura modular.
- Utiliza módulos, controladores, serviços e injeção de dependência.

## 💻 Exemplos testados

### 1. Instalação do NestJS CLI
```bash
npm install -g @nestjs/cli
```

### 2. Criação de um novo projeto
```bash
nest new meu-projeto-nest
```

### 3. Estrutura inicial do projeto
```
meu-projeto-nest/
│── src/
│    ├── app.controller.ts
│    ├── app.module.ts
│    ├── app.service.ts
│    └── main.ts
│── package.json
│── tsconfig.json
│── README.md
```

## 📝 Anotações pessoais
- O comando `nest new` já cria uma estrutura modular e pronta para testes.
- Controllers recebem requisições e retornam respostas.
- O uso de decorators (@Controller, @Get) facilita a organização do código.

---

## Todo-list
- [x] Instalar NestJS CLI
- [x] Criar projeto base
- [x] Explorar estrutura inicial
- [ ] Documentar funções e rotas
- [ ] Implementar serviço de exemplo
- [ ] Integrar com banco de dados (Prisma)
