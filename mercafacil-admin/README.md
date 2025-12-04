# Mercafácil Admin

Painel administrativo web para gestão da plataforma Mercafácil.

## Instalação

1. Entre na pasta: `cd mercafacil-admin`
2. Instale dependências: `npm install`
3. Inicie o projeto: `npm start`

## Funcionalidades Cobertas

- **Login de administrador**: Acesso seguro via JWT.
- **CRUD de Mercados**: Criação e listagem vinculada aos municípios de Roraima.
- **CRUD de Produtos**: Gestão completa incluindo preços promocionais e estoque.
- **Motoristas**: Cadastro de novos motoristas e visualização dos disponíveis.
- **Financeiro**: Visualização básica de repasses (payouts) e comissões.
- **Interface**: Layout responsivo com sidebar para administração centralizada.

## 🔧 Ajustes / Considerações Técnicas

1. **Autenticação**: Use um usuário com `role = 'admin'` no banco de dados para efetuar login.
2. **Backend**: Confirme que os endpoints usados (ex: `/drivers/register`, `/delivery/payouts`) estão implementados e rodando no backend.
3. **Filtros**: A interface de produtos assume inicialmente um filtro de mercado padrão. Em produção, recomenda-se refinar o seletor de mercados.
4. **Segurança**: Em produção, altere a URL da API para HTTPS e configure variáveis de ambiente seguras (`.env`).
5. **Estilo**: O projeto utiliza Tailwind CSS e Lucide Icons para uma interface limpa e moderna.