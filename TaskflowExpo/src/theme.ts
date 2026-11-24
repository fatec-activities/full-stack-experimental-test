import { Platform } from 'react-native';

import { TaskPriority, TaskStatus } from '@/models/Task';

export const colors = {
  background: '#f3f0e9',
  surface: '#fffdf8',
  surfaceMuted: '#fbf9f3',
  border: '#ddd6c8',
  borderStrong: '#c8c0b0',
  text: '#26231d',
  muted: '#7b7466',
  accent: '#37603f',
  accentSoft: '#e9efe4',
  input: '#fffefb',
  danger: '#9b3b2c',
  dangerBorder: '#d9b9b2',
  dangerSoft: '#f7e9e6',
};

export const fonts = {
  serif: Platform.OS === 'android' ? 'serif' : 'Georgia',
};

export const statusLabels: Record<TaskStatus, string> = {
  PENDENTE: 'Pendente',
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDA: 'Concluída',
};

export const statusColors: Record<TaskStatus, string> = {
  PENDENTE: '#b8862f',
  EM_ANDAMENTO: '#3f6f8a',
  CONCLUIDA: '#4a7c59',
};

export const priorityLabels: Record<TaskPriority, string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
};
