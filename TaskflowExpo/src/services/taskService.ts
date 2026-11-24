import axios from 'axios';
import Constants from 'expo-constants';

import { Task, TaskRequest, TaskStatus } from '@/models/Task';

// Em desenvolvimento, usa o mesmo IP do servidor do Expo para o celular acessar o backend.
const devHost = Constants.expoConfig?.hostUri?.split(':')[0];
const host = devHost && devHost !== 'localhost' ? devHost : 'localhost';

export const API_URL = `http://${host}:8080/api/tarefas`;

export async function getTasks(status?: string): Promise<Task[]> {
  const url = status ? `${API_URL}?status=${status}` : API_URL;
  const response = await axios.get<Task[]>(url);
  return response.data;
}

export async function getTask(id: number): Promise<Task> {
  const response = await axios.get<Task>(`${API_URL}/${id}`);
  return response.data;
}

export async function createTask(task: TaskRequest): Promise<Task> {
  const response = await axios.post<Task>(API_URL, task);
  return response.data;
}

export async function updateTask(id: number, task: TaskRequest): Promise<Task> {
  const response = await axios.put<Task>(`${API_URL}/${id}`, task);
  return response.data;
}

export async function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  const response = await axios.patch<Task>(`${API_URL}/${id}/status`, { status });
  return response.data;
}

export async function deleteTask(id: number): Promise<void> {
  await axios.delete(`${API_URL}/${id}`);
}
