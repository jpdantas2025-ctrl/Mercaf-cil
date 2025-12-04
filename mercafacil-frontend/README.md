# Mercafácil Frontend

Aplicação React Native para o marketplace Mercafácil.

## Configuração

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o app no Android ou iOS (dependendo do seu ambiente):
- Usando React Native CLI:
  ```bash
  npx react-native run-android
  # ou
  npx react-native run-ios
  ```
- Usando Expo: adapte conforme configuração

3. Garanta que o backend esteja rodando em `http://localhost:3000` (ou ajuste `api.js`).

4. Use o app: registre usuário → login → navegue por mercados/produtos → adicione ao carrinho → finalize pedido.

## Funcionalidades incluídas

- Registro e login de usuário
- Navegação entre telas: Mercados, Promoções ativas, Produtos mais baratos, Meus Pedidos
- Catálogo de produtos por mercado
- Promoções e “baratos do dia”
- Carrinho e checkout
- Histórico de pedidos