import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Task, TaskPriority, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  @Input() tasks: Task[] = [];
  @Input() selectedId: number | null = null;
  @Input() loading = false;
  @Input() filter = '';

  @Output() select = new EventEmitter<Task>();
  @Output() filterChange = new EventEmitter<string>();
  @Output() create = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

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
