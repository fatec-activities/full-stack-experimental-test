export type TaskStatus = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA';

export type TaskPriority = 'BAIXA' | 'MEDIA' | 'ALTA';

export type DetailMode = 'empty' | 'view' | 'create' | 'edit';

export interface Task {
  id: number;
  titulo: string;
  descricao: string | null;
  responsavel: string;
  status: TaskStatus;
  prioridade: TaskPriority;
}

export interface TaskRequest {
  titulo: string;
  descricao: string | null;
  responsavel: string;
  status: TaskStatus;
  prioridade: TaskPriority;
}
