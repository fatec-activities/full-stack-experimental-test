# TaskFlow - Frontend Web (Angular)

Interface web do **TaskFlow**, que consome a API Java Spring Boot em `http://localhost:8080/api/tarefas`. A tela é dividida em duas colunas: lista de tarefas à esquerda e visualização/cadastro/edição à direita.

## Requisitos

- Node.js e npm
- Backend do TaskFlow em execução na porta 8080

## Como executar

```bash
npm install
npm start
```

A aplicação estará disponível em `http://localhost:4200`.

Para gerar a build de produção:

```bash
npm run build
```

Para executar os testes:

```bash
npm test
```

## Funcionalidades

- Listagem de tarefas consumindo `GET /api/tarefas`
- Filtro por status (`PENDENTE`, `EM_ANDAMENTO`, `CONCLUIDA`)
- Botão **Atualizar** que recarrega lista e detalhe direto da API (útil para ver mudanças feitas no Expo)
- Visualização dos detalhes da tarefa selecionada
- Cadastro de tarefa (`POST`)
- Edição de tarefa (`PUT`)
- Exclusão de tarefa (`DELETE`)
- Mensagens de sucesso e erro de integração
- Layout responsivo em SCSS

## Estrutura

```
src/app/
|-- app.ts                     # estado da tela e integração
|-- app.html
|-- app.scss
|-- app.config.ts              # provideHttpClient
|-- components/
|   |-- task-list/             # coluna esquerda: filtro e lista
|   `-- task-detail/           # coluna direita: visualizar/cadastrar/editar
|-- models/
|   `-- task.model.ts
`-- services/
    `-- task.service.ts
```

A integração segue o padrão do projeto: `HttpClient` injetado no serviço, métodos retornando `Observable`, formulários reativos e componentes simples com `@Input` e `@Output`.

## Endereço da API

A URL está em `src/app/services/task.service.ts`:

```ts
apiUrl = 'http://localhost:8080/api/tarefas';
```

No navegador do computador, `localhost` funciona. Para acessar de outro dispositivo, troque por `http://IP-DA-MAQUINA:8080/api/tarefas`. O backend já está com CORS liberado.

## Roteiro de demonstração (integração)

1. Suba o backend (`./mvnw spring-boot:run` na pasta do backend).
2. Suba o Angular (`npm start`).
3. Cadastre uma tarefa pela direita - ela aparece na lista e no banco H2.
4. Abra o app Expo e consulte a mesma tarefa.
5. Altere o status pelo Expo.
6. No Angular, clique no botão Atualizar ou troque o filtro para ver o novo status direto da API.
