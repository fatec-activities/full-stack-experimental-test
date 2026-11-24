import { Platform } from 'react-native';

import { TaskPriority, TaskStatus } from '@/models/Task';

export const colors = {
  background: '#121212',
  surface: '#1b1b1b',
  surfaceMuted: '#222222',
  hover: '#2a2a2a',
  border: '#333333',
  borderStrong: '#454545',
  text: '#f0f0f0',
  muted: '#a3a3a3',
  accent: '#7c5cbf',
  accentSoft: '#2a2238',
  input: '#161616',
  danger: '#d36b5d',
  dangerBorder: '#6b3a34',
  dangerSoft: '#2a1c1a',
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
  PENDENTE: '#c9a04a',
  EM_ANDAMENTO: '#6a93c4',
  CONCLUIDA: '#6aaa78',
};

export const priorityLabels: Record<TaskPriority, string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
};
