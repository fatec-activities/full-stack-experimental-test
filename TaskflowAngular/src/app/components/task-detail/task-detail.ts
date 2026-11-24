import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { DetailMode, Task, TaskPriority, TaskRequest, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  imports: [ReactiveFormsModule],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.scss',
})
export class TaskDetail implements OnChanges {
  @Input() task: Task | null = null;
  @Input() mode: DetailMode = 'empty';

  @Output() save = new EventEmitter<TaskRequest>();
  @Output() remove = new EventEmitter<number>();
  @Output() edit = new EventEmitter<void>();
  @Output() create = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

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

  form = new FormGroup({
    titulo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    descricao: new FormControl(''),
    responsavel: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl<TaskStatus>('PENDENTE', { nonNullable: true }),
    prioridade: new FormControl<TaskPriority>('MEDIA', { nonNullable: true }),
  });

  ngOnChanges(): void {
    if (this.mode === 'edit' && this.task) {
      this.form.patchValue({
        titulo: this.task.titulo,
        descricao: this.task.descricao || '',
        responsavel: this.task.responsavel,
        status: this.task.status,
        prioridade: this.task.prioridade,
      });
    } else if (this.mode === 'create') {
      this.form.reset({
        titulo: '',
        descricao: '',
        responsavel: '',
        status: 'PENDENTE',
        prioridade: 'MEDIA',
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.save.emit({
      titulo: value.titulo,
      descricao: value.descricao || null,
      responsavel: value.responsavel,
      status: value.status,
      prioridade: value.prioridade,
    });
  }
}
