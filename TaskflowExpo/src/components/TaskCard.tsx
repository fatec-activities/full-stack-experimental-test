import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Task } from '@/models/Task';
import { colors, priorityLabels, statusColors, statusLabels } from '@/theme';

type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: '/task/[id]', params: { id: String(task.id) } })
      }
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <Text style={styles.title}>{task.titulo}</Text>
      <Text style={styles.assignee}>{task.responsavel}</Text>

      <View style={styles.meta}>
        <View style={[styles.dot, { backgroundColor: statusColors[task.status] }]} />
        <Text style={styles.status}>{statusLabels[task.status]}</Text>
        <Text style={styles.separator}>·</Text>
        <Text style={styles.priority}>{priorityLabels[task.prioridade]}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: colors.surface,
  },
  rowPressed: {
    backgroundColor: '#f7f3ea',
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  assignee: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 12,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  status: {
    color: colors.muted,
    fontSize: 12,
  },
  separator: {
    color: colors.borderStrong,
    fontSize: 12,
  },
  priority: {
    color: colors.muted,
    fontSize: 12,
  },
});
