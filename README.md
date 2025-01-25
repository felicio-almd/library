# Aplicação de Gerenciamento de Biblioteca 

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/felicio-almd/library?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/felicio-almd/library?color=56BEB8">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/felicio-almd/library?color=56BEB8">
</p>

## :dart: Visão Geral
Aplicação full-stack gerada com JHipster 8.8.0 para gerenciamento de bibliotecas, utilizando tecnologias modernas de desenvolvimento.

## :sparkles: Features
- Personalização básica do layout angular
- Relacionamentos complexos entre tabelas
- Validações específicas no CRUD
- Especificação de niveis de acesso de usuario no Backend (ex: Usuarios não adicionam livros, categorias, autores e locais nem veem todos os emprestimos, apenas Admin tem esse acesso)
- Utilização do PostgreSQL e docker para criação da imagem e uso dos volumes.

## Pré-requisitos

- Java 17+
- Node.js
- Docker

## Configuração de Desenvolvimento

### Instalação de Dependências
```bash
# Instalar dependências do projeto
./npmw install
```

### Executar Aplicação
```bash
# Iniciar backend
./mvnw

# Iniciar frontend
./npmw start
```

## Estrutura do Projeto

- `src/main/java/`: Código backend Java
- `src/main/webapp/`: Código frontend Angular
- `src/test/`: Configurações de teste

## Comandos Úteis

### Gerenciamento de Dependências
```bash
# Adicionar biblioteca
./npmw install --save leaflet
./npmw install --save-dev @types/leaflet
```

### Build de Produção
```bash
# Criar JAR de produção
./mvnw -Pprod clean verify

# Executar JAR
java -jar target/*.jar
```

### Docker
```bash
# Construir imagem Docker
npm run java:docker

# Iniciar serviços
docker compose -f src/main/docker/app.yml up -d
```

## Testes

### Testes backend
```bash
./mvnw verify
```

### Testes frontend
```bash
./npmw test
```

### Testes E2E
```bash
./npmw run e2e
```

## Ferramentas

- **Sonar**: Qualidade de código
- **ESLint**
- **Prettier**
- **JHipster Control Center**

## Documentação

- [Documentação JHipster](https://www.jhipster.tech/documentation-archive)

## Fluxo de Trabalho

1. Instalar dependências
2. Configurar ambiente
3. Desenvolver funcionalidades
4. Executar testes
5. Construir para produção
6. Implantar

Made by <a href="https://github.com/felicio-almd" target="_blank">Felicio</a>
