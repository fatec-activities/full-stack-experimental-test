import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { DetailMode, Task, TaskPriority, TaskRequest, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  imports: [ReactiveFormsModule],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.scss',
})
export class TaskDetail {
  readonly task = input<Task | null>(null);
  readonly mode = input<DetailMode>('empty');

  readonly save = output<TaskRequest>();
  readonly remove = output<number>();
  readonly edit = output<void>();
  readonly create = output<void>();
  readonly cancel = output<void>();

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

  readonly form = inject(FormBuilder).nonNullable.group({
    titulo: ['', Validators.required],
    descricao: [''],
    responsavel: ['', Validators.required],
    status: ['PENDENTE' as TaskStatus, Validators.required],
    prioridade: ['MEDIA' as TaskPriority, Validators.required],
  });

  constructor() {
    effect(() => {
      const mode = this.mode();
      const task = this.task();

      if (mode === 'edit' && task) {
        this.form.patchValue({
          titulo: task.titulo,
          descricao: task.descricao ?? '',
          responsavel: task.responsavel,
          status: task.status,
          prioridade: task.prioridade,
        });
      }

      if (mode === 'create') {
        this.form.reset({
          titulo: '',
          descricao: '',
          responsavel: '',
          status: 'PENDENTE',
          prioridade: 'MEDIA',
        });
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.form.getRawValue());
  }
}
