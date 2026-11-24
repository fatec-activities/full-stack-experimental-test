export type TaskStatus = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA';

export type TaskPriority = 'BAIXA' | 'MEDIA' | 'ALTA';

export type Task = {
  id: number;
  titulo: string;
  descricao: string | null;
  responsavel: string;
  status: TaskStatus;
  prioridade: TaskPriority;
};

export type TaskRequest = Omit<Task, 'id'>;
