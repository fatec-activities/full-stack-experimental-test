import { Component, input, output } from '@angular/core';

import { Task, TaskPriority, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  readonly tasks = input<Task[]>([]);
  readonly selectedId = input<number | null>(null);
  readonly loading = input(false);
  readonly filter = input('');

  readonly select = output<Task>();
  readonly filterChange = output<string>();
  readonly create = output<void>();
  readonly refresh = output<void>();

  readonly statusLabels: Record<TaskStatus, string> = {
    PENDENTE: 'Pendente',
    EM_ANDAMENTO: 'Em andamento',
    CONCLUIDA: 'Concluída',
  };

  readonly priorityLabels: Record<TaskPriority, string> = {
    BAIXA: 'Baixa',
    MEDIA: 'Média',
    ALTA: 'Alta',
  };

  onFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filterChange.emit(select.value);
  }
}
