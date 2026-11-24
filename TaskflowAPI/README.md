# TaskFlow — Backend (API REST)

API REST do projeto **TaskFlow**, desenvolvida com **Java 25 + Spring Boot 4.2** e banco **H2 em memória**. O código-fonte é em inglês, mas o contrato da API segue o enunciado do desafio em português (`/api/tarefas`, `titulo`, `responsavel`, etc.).

## Tecnologias

- Java 25
- Spring Boot 4.2.0
- Spring Web MVC
- Spring Data JPA
- H2 Database
- Maven (wrapper incluído)

## Estrutura

```
src/main/java/com/fatec/taskflow/
├── TaskflowApplication.java
├── config/
│   └── CorsConfig.java
├── controllers/
│   └── TaskController.java
├── dtos/
│   ├── TaskRequest.java
│   ├── TaskResponse.java
│   └── TaskStatusRequest.java
├── entities/
│   └── Task.java
├── mappers/
│   └── TaskMapper.java
├── repositories/
│   └── TaskRepository.java
└── services/
    └── TaskService.java
```

## Como executar

Na pasta do backend:

```bash
./mvnw spring-boot:run
```

A API estará disponível em `http://localhost:8080`.

Para compilar e executar os testes:

```bash
./mvnw test
```

Para gerar o `.jar`:

```bash
./mvnw package
java -jar target/taskflow-0.0.1-SNAPSHOT.jar
```

## Endpoints

Base: `http://localhost:8080/api/tarefas`

| Método | Rota | Operação | Sucesso |
|--------|------|----------|---------|
| GET | `/api/tarefas` | Listar tarefas | 200 |
| GET | `/api/tarefas?status=PENDENTE` | Filtrar por status | 200 |
| GET | `/api/tarefas/{id}` | Consultar por ID | 200 |
| POST | `/api/tarefas` | Cadastrar tarefa | 201 |
| PUT | `/api/tarefas/{id}` | Editar tarefa | 200 |
| PATCH | `/api/tarefas/{id}/status` | Alterar status | 200 |
| DELETE | `/api/tarefas/{id}` | Excluir tarefa | 204 |

Erros: `400` para dados inválidos e `404` para tarefa não encontrada. O corpo do erro contém `status`, `error` e `message`.

## Modelo da tarefa

```json
{
  "id": 1,
  "titulo": "Implementar a API de tarefas",
  "descricao": "Criar os endpoints REST com Spring Boot e H2",
  "responsavel": "Bruno",
  "status": "EM_ANDAMENTO",
  "prioridade": "ALTA"
}
```

Regras:

- `titulo` e `responsavel` são obrigatórios.
- `descricao` é opcional.
- `status`: `PENDENTE`, `EM_ANDAMENTO` ou `CONCLUIDA` (padrão `PENDENTE`).
- `prioridade`: `BAIXA`, `MEDIA` ou `ALTA` (padrão `MEDIA`).

## Exemplos

Cadastrar:

```bash
curl -X POST http://localhost:8080/api/tarefas \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Nova tarefa","descricao":"Teste","responsavel":"Ana","status":"PENDENTE","prioridade":"ALTA"}'
```

Editar:

```bash
curl -X PUT http://localhost:8080/api/tarefas/1 \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Tarefa editada","descricao":"Nova descrição","responsavel":"Ana","status":"EM_ANDAMENTO","prioridade":"MEDIA"}'
```

Alterar status (usado pelo app Expo):

```bash
curl -X PATCH http://localhost:8080/api/tarefas/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"CONCLUIDA"}'
```

## Banco H2

Console: `http://localhost:8080/h2-console`

- JDBC URL: `jdbc:h2:mem:taskflowdb`
- Usuário: `sa`
- Senha: (vazia)

O banco é recriado a cada inicialização e recebe 4 tarefas de exemplo a partir de `src/main/resources/data.sql`.

## Acesso pelo celular (Expo)

O Angular roda no navegador e acessa `http://localhost:8080`. No celular, `localhost` aponta para o próprio aparelho, então use o IP da máquina na rede local:

```bash
hostname -I
# exemplo: 192.168.0.10
```

No app Expo, configure a base da API como `http://192.168.0.10:8080/api`. O celular e o computador devem estar na mesma rede, e a porta 8080 precisa estar liberada no firewall. O CORS já está liberado para todas as origens.

## Códigos de resposta

- `200 OK`: consultas, edição e alteração de status.
- `201 Created`: cadastro.
- `204 No Content`: exclusão.
- `400 Bad Request`: campos obrigatórios ausentes ou valores inválidos.
- `404 Not Found`: tarefa inexistente.
