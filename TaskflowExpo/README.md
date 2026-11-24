# TaskFlow Mobile

App Expo/React Native que consome a API do TaskFlow (Spring Boot).

## Funcionalidades

- Lista de tarefas com status e prioridade
- Filtro por status (Todos, Pendentes, Em andamento, Concluídas)
- Botão Atualizar e atualização por gesto de puxar para baixo
- Tela de detalhes da tarefa
- Criação de tarefas
- Edição de tarefas
- Exclusão com confirmação
- Alteração de status (Pendente, Em andamento, Concluída)
- Navegação entre lista, detalhes e formulário com Expo Router

## Pré-requisitos

O backend precisa estar rodando em `http://localhost:8080`:

```bash
cd /home/ryanf/Projects/Github/Java/Spring/spring-product/taskflow
./mvnw spring-boot:run
```

## Rodando o app

```bash
npm install
npx expo start
```

Depois escolha o destino no terminal (Expo Go, emulador Android, simulador iOS ou web).

## URL da API

O app usa o mesmo host do servidor de desenvolvimento do Expo e a porta `8080`:

```ts
http://<host-do-expo>:8080/api/tarefas
```

Em desenvolvimento no computador, isso resolve para `http://localhost:8080`.

Em um celular físico, o computador e o celular precisam estar na mesma rede e a porta `8080` deve estar acessível. O Expo informa o IP da máquina automaticamente; se necessário, ajuste o host em `src/services/taskService.ts`.

## Estrutura

```text
src/
  app/
    _layout.tsx        # Stack de navegação
    index.tsx          # Lista de tarefas
    task/[id].tsx      # Detalhes, status, edição e exclusão
    task/form.tsx      # Formulário de criação e edição
  components/
    TaskCard.tsx       # Linha da lista
    ChoiceGroup.tsx    # Seleção de status e prioridade
  models/
    Task.ts            # Tipos da API
  services/
    taskService.ts     # Chamadas Axios
  theme.ts             # Cores, fontes e rótulos
```

## Scripts

```bash
npm start          # inicia o Expo
npm run android    # abre no emulador Android
npm run ios        # abre no simulador iOS
npm run web        # abre no navegador
npm run lint       # ESLint
npx tsc --noEmit   # checagem de tipos
```
