# Mercafácil - Mobile App (React Native)

Aplicação mobile para clientes e motoristas do Mercafácil Roraima.

## Estrutura
- **App.js**: Navegação Principal (Stack Login + Tabs Home)
- **context/**: Gerenciamento de estado (Auth, Cart)
- **screens/**: Telas da aplicação

## Como rodar
1. Certifique-se de que o backend está rodando.
2. Instale as dependências:
   ```bash
   cd mobile
   npm install
   ```
3. Inicie o Expo:
   ```bash
   npx expo start
   ```
4. Escaneie o QR Code com o app Expo Go no seu celular ou rode no Emulador.

## Configuração de IP
No arquivo `api.js`, altere o `API_URL` caso esteja testando em dispositivo físico para o IP da sua máquina na rede local (ex: `http://192.168.1.10:3000/api`).