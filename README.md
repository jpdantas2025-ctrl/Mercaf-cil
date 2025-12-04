# Mercafácil - Roraima

Marketplace de supermercados com entrega sob demanda, desenvolvido para os 15 municípios de Roraima.

## 🚀 Funcionalidades Ativas (MVP)

O projeto está rodando em modo **Frontend-First** com lógica de backend simulada no navegador para testes imediatos.

### 📱 Cliente
- **Geolocalização**: Seleção de município (15 cidades de RR).
- **Busca Inteligente**: Pesquisa por texto e **Voz**.
- **Carrinho & Checkout**: Fluxo completo de compra simulada.
- **Chatbot AI**: Assistente virtual "Mercabot" (Gemini).

### 🛵 Entregador
- **Painel do Motorista**: Visualização de ganhos e status.
- **Gestão de Pedidos**: Aceitar entregas da sua região.
- **Rota**: Simulação de entrega e comissão.

### 🏢 Lojista & Admin
- **Estúdio AI**: Criação de anúncios automáticos via foto do produto.
- **Painel Administrativo**: Métricas de vendas, repasses e motoristas ativos.

---

# Mercafácil – Backend (Node.js)

Abaixo estão as instruções para execução do servidor backend gerado na pasta `src/`.

## 🧰 Instalação e execução

1. Clone o repositório
2. Copie `.env.example` para `.env` e ajuste se necessário
3. Instale dependências
   ```bash
   npm install
   ```
4. Popule o banco de dados (Seed)
   ```bash
   npm run seed
   ```
5. Inicie o servidor
   ```bash
   npm start
   ```

## 🛣️ Rotas principais

### Autenticação
- `POST /api/auth/register` — Registrar cliente
- `POST /api/auth/login` — Login (cliente, entregador, admin)

### Mercados & Produtos
- `GET /api/markets` — Listar mercados
- `POST /api/markets` — Criar mercado (Admin)
- `GET /api/products/market/:marketId` — Produtos de um mercado
- `GET /api/products/cheapest-today` — 10 produtos mais baratos do dia
- `GET /api/products/promocoes` — Produtos em promoção (usuário logado)

### Motoristas
- `POST /api/drivers/register` — Registrar entregador parceiro
- `GET /api/drivers/available` — Listar entregadores disponíveis

### Pedidos & Entregas
- `POST /api/orders` — Criar pedido (Cliente logado)
- `POST /api/delivery/:orderId/assign` — Atribuir entregador a pedido
- `POST /api/delivery/:orderId/complete` — Finalizar entrega + criar repasse

## ⚠️ Observações

- A autenticação por middleware JWT protege rotas sensíveis.
- A lógica de repasse é simplificada: **10% para entregador**, **10% plataforma**, **80% para o mercado**.

---

## 🛠 Tecnologias

- **Frontend**: React 19, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express, Sequelize, SQLite/Postgres.
- **AI**: Google Gemini (Flash 2.5) para Chat e Visão Computacional.
- **Voz**: Web Speech API.

## 👤 Autoria

Desenvolvido por **João Paulo Silva Dantas**.