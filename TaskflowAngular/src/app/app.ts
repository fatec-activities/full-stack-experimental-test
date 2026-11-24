import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';

import { TaskDetail } from './components/task-detail/task-detail';
import { TaskList } from './components/task-list/task-list';
import { DetailMode, Task, TaskRequest } from './models/task.model';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  imports: [TaskList, TaskDetail],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  readonly tasks = signal<Task[]>([]);
  readonly selectedTask = signal<Task | null>(null);
  readonly filter = signal('');
  readonly mode = signal<DetailMode>('empty');
  readonly loading = signal(false);
  readonly error = signal('');
  readonly success = signal('');

  constructor(private service: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(selectId?: number): void {
    const targetId = selectId ?? this.selectedTask()?.id ?? null;

    this.loading.set(true);

    this.service.getAll(this.filter() || undefined).subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
        this.error.set('');

        if (targetId != null) {
          const selected = tasks.find((task) => task.id === targetId);
          if (selected) {
            this.selectedTask.set(selected);
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(this.errorMessage(error));
      },
    });
  }

  refreshTasks(): void {
    this.clearMessages();
    this.loadTasks();
  }

  changeFilter(status: string): void {
    this.filter.set(status);
    this.selectedTask.set(null);
    this.mode.set('empty');
    this.clearMessages();
    this.loadTasks();
  }

  selectTask(task: Task): void {
    this.clearMessages();
    this.selectedTask.set(task);
    this.mode.set('view');
  }

  startCreate(): void {
    this.clearMessages();
    this.selectedTask.set(null);
    this.mode.set('create');
  }

  startEdit(): void {
    if (this.selectedTask()) {
      this.clearMessages();
      this.mode.set('edit');
    }
  }

  cancelEdit(): void {
    this.mode.set(this.selectedTask() ? 'view' : 'empty');
  }

  saveTask(request: TaskRequest): void {
    const current = this.selectedTask();
    this.clearMessages();

    const request$ = current
      ? this.service.update({ ...request, id: current.id })
      : this.service.save(request);

    request$.subscribe({
      next: (saved) => {
        this.selectedTask.set(saved);
        this.mode.set('view');
        this.success.set(current ? 'Tarefa atualizada com sucesso.' : 'Tarefa criada com sucesso.');
        this.loadTasks(saved.id);
      },
      error: (error: HttpErrorResponse) => this.error.set(this.errorMessage(error)),
    });
  }

  deleteTask(id: number): void {
    const task = this.selectedTask() ?? this.tasks().find((item) => item.id === id);

    if (!task || !window.confirm('Deseja realmente excluir esta tarefa?')) {
      return;
    }

    this.clearMessages();

    this.service.delete(task).subscribe({
      next: () => {
        this.selectedTask.set(null);
        this.mode.set('empty');
        this.success.set('Tarefa excluída com sucesso.');
        this.loadTasks();
      },
      error: (error: HttpErrorResponse) => this.error.set(this.errorMessage(error)),
    });
  }

  private clearMessages(): void {
    this.error.set('');
    this.success.set('');
  }

  private errorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Não foi possível conectar à API. Verifique se o backend está rodando em http://localhost:8080.';
    }

    return error.error?.message ?? 'Ocorreu um erro ao processar a solicitação.';
  }
}
