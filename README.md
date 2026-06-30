# AutoRecicla

Sistema fullstack de gestão para redes de desmonte e revenda de autopeças usadas. Controla o ciclo completo de operação — do cadastro de peças ao fechamento de venda — com suporte a múltiplas filiais, controle de estoque em tempo real e fluxo de atendimento integrado.

Backend em Java 21 + Spring Boot. Frontend em React + Vite. Banco de dados PostgreSQL.

---

## O que o sistema faz

**Gestão de estoque multi-filial**
Cada filial tem seu próprio inventário de peças. O sistema impede que um vendedor de uma unidade movimente peças de outra, garantindo rastreabilidade total entre filiais.

**Fluxo de venda com nota unificada**
O atendimento começa com a abertura de uma nota vinculada ao vendedor e ao cliente. As peças são adicionadas à nota e ficam reservadas no estoque automaticamente — evitando que a mesma peça seja vendida duas vezes. No fechamento, a forma de pagamento é registrada e a nota é finalizada.

**Controle de status em tempo real**
O estoque de cada peça transita automaticamente entre estados conforme o andamento da venda:

```
Disponível → Reservada → Vendida
```

Se a nota for cancelada, as peças voltam ao estoque imediatamente.

**Compatibilidade de peças por modelo e ano**
Cada peça pode ser vinculada a múltiplos modelos de veículos com intervalo de anos de compatibilidade, facilitando a consulta de quais peças servem para o veículo do cliente.

**Histórico de preços**
O valor vendido é registrado no momento da venda e não muda — alterações futuras no preço da peça não afetam o histórico de notas anteriores.

---

## Tecnologias

| Camada | Stack |
|--------|-------|
| Backend | Java 21, Spring Boot 3, Spring Data JPA, Hibernate |
| Banco de dados | PostgreSQL |
| Frontend | React, Vite, JavaScript, CSS |
| HTTP Client | Axios |
| Build | Maven |

---

## Arquitetura

O backend segue arquitetura em camadas. As regras de negócio ficam exclusivamente na camada de service — controllers recebem e respondem requisições, repositories acessam o banco, services decidem o que pode ou não acontecer.

```
React (Vite)
     │  HTTP / REST
     ▼
Controller
     │
Service  ←── regras de negócio aqui
     │
Repository
     │
PostgreSQL
```

---

## Endpoints

### Notas — fluxo principal

| Método | Rota | O que faz |
|--------|------|-----------|
| POST | `/notas` | Abre uma nova nota |
| POST | `/notas/{id}/itens` | Adiciona peça à nota e reserva estoque |
| PATCH | `/notas/{id}/finalizar` | Fecha a venda com forma de pagamento |
| PATCH | `/notas/{id}/cancelar` | Cancela e devolve peças ao estoque |
| GET | `/notas` | Lista todas as notas |
| GET | `/notas/{id}` | Detalhe da nota |
| GET | `/notas/{id}/itens` | Itens da nota |

### Peças

| Método | Rota | O que faz |
|--------|------|-----------|
| GET | `/pecas` | Lista todas as peças |
| GET | `/pecas/filial/{id}` | Peças de uma filial específica |
| POST | `/pecas` | Cadastra peça |
| PUT | `/pecas/{id}` | Atualiza peça |
| DELETE | `/pecas/{id}` | Remove peça |

### Compatibilidades

| Método | Rota | O que faz |
|--------|------|-----------|
| GET | `/compatibilidades/peca/{id}` | Quais modelos uma peça atende |
| GET | `/compatibilidades/modelo/{id}` | Quais peças servem para um modelo |
| POST | `/compatibilidades` | Vincula peça a modelo |
| DELETE | `/compatibilidades/{id}` | Remove vínculo |

### Demais recursos

CRUD completo disponível para: `/filiais`, `/vendedores`, `/clientes`, `/marcas`, `/modelos`, `/categorias`

---

## Regras de negócio

- Vendedor inativo não abre nota
- Só entram na nota peças da mesma filial do vendedor
- Estoque insuficiente bloqueia a adição da peça
- Nota finalizada ou cancelada não aceita novos itens
- Cancelamento devolve 100% das quantidades ao estoque
- Preço da peça é congelado no momento da venda

---

## Como rodar

### Pré-requisitos

- Java 21
- Node.js 18+
- PostgreSQL rodando localmente
- Maven

### 1. Banco de dados

```sql
CREATE DATABASE autorecicla;
```

### 2. Backend

```bash
cd backend/autorecicla-api
```

Crie o arquivo `src/main/resources/application.properties`:

```properties
spring.application.name=autorecicla-api

spring.datasource.url=jdbc:postgresql://localhost:5432/autorecicla
spring.datasource.username=SEU_USUARIO
spring.datasource.password=SUA_SENHA
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

```bash
mvn spring-boot:run
```

API disponível em `http://localhost:8080`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em `http://localhost:5173`

> O `application.properties` não está no repositório. Crie-o localmente antes de rodar.

---

## Estrutura

```
autorecicla/
├── backend/
│   └── autorecicla-api/
│       └── src/main/java/com/autorecicla/api/
│           ├── config/       → CORS
│           ├── controller/   → endpoints REST
│           ├── dto/          → objetos de entrada
│           ├── exception/    → tratamento global de erros
│           ├── model/        → entidades JPA
│           ├── repository/   → acesso ao banco
│           └── service/      → regras de negócio
│
├── frontend/
│   └── src/
│       ├── api/              → configuração do Axios
│       ├── components/       → Navbar
│       └── pages/            → uma página por entidade
│
└── README.md
```

---


## Autor

[Renato Paiva](https://github.com/renPaiva-dev)
