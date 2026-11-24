import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Task, TaskStatus } from '@/models/Task';
import { deleteTask, getTask, updateTaskStatus } from '@/services/taskService';
import { colors, fonts, priorityLabels, statusLabels } from '@/theme';

const STATUSES: TaskStatus[] = ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA'];

export default function TaskDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const taskId = Number(id);

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<TaskStatus | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState('');

  const loadTask = useCallback(async () => {
    try {
      const data = await getTask(taskId);
      setError('');
      setTask(data);
    } catch {
      setError('Não foi possível carregar a tarefa.');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useFocusEffect(
    useCallback(() => {
      loadTask();
    }, [loadTask]),
  );

  const retry = () => {
    setLoading(true);
    loadTask();
  };

  const changeStatus = async (status: TaskStatus) => {
    if (!task || status === task.status) {
      return;
    }

    setSaving(status);
    setError('');

    try {
      setTask(await updateTaskStatus(task.id, status));
    } catch {
      setError('Não foi possível alterar o status.');
    } finally {
      setSaving(null);
    }
  };

  const removeTask = async () => {
    if (!task) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      await deleteTask(task.id);
      setDeleting(false);

      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    } catch {
      setDeleting(false);
      setError('Não foi possível excluir a tarefa.');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: task ? `Tarefa #${task.id}` : 'Tarefa' }} />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.helper}>Carregando tarefa...</Text>
        </View>
      ) : !task ? (
        <View style={styles.centered}>
          <Text style={styles.error}>{error || 'Tarefa não encontrada.'}</Text>
          <Pressable style={styles.retry} onPress={retry}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
          <View style={styles.panel}>
            <Text style={styles.eyebrow}>Tarefa #{task.id}</Text>
            <Text style={styles.title}>{task.titulo}</Text>

            <View style={styles.meta}>
              <Text style={styles.metaText}>{statusLabels[task.status]}</Text>
              <Text style={styles.separator}>-</Text>
              <Text style={styles.metaText}>{priorityLabels[task.prioridade]}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.field}>
              <Text style={styles.label}>Responsável</Text>
              <Text style={styles.value}>{task.responsavel}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Descrição</Text>
              <Text style={styles.value}>{task.descricao || 'Sem descrição.'}</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Alterar status</Text>

            <View style={styles.statusOptions}>
              {STATUSES.map((status) => {
                const active = task.status === status;

                return (
                  <Pressable
                    key={status}
                    disabled={saving !== null}
                    onPress={() => changeStatus(status)}
                    style={[styles.statusButton, active && styles.statusButtonActive]}
                  >
                    <Text
                      style={[
                        styles.statusButtonText,
                        active && styles.statusButtonTextActive,
                      ]}
                    >
                      {statusLabels[status]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {saving ? <Text style={styles.helper}>Salvando...</Text> : null}
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.divider} />

            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setConfirmingDelete(false);
                  router.push({
                    pathname: '/task/form',
                    params: { id: String(task.id) },
                  });
                }}
                style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
              >
                <Text style={styles.primaryButtonText}>Editar</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => setConfirmingDelete(true)}
                style={({ pressed }) => [styles.dangerButton, pressed && styles.buttonPressed]}
              >
                <Text style={styles.dangerButtonText}>Excluir</Text>
              </Pressable>

              {/* <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setConfirmingDelete(false);
                  router.push('/task/form');
                }}
                style={({ pressed }) => [styles.ghostButton, pressed && styles.buttonPressed]}
              >
                <Text style={styles.ghostButtonText}>Nova tarefa</Text>
              </Pressable> */}
            </View>

            {confirmingDelete ? (
              <View style={styles.confirmBox}>
                <Text style={styles.confirmTitle}>Excluir esta tarefa?</Text>
                <Text style={styles.confirmText}>Essa ação não pode ser desfeita.</Text>

                <View style={styles.actions}>
                  <Pressable
                    accessibilityRole="button"
                    disabled={deleting}
                    onPress={removeTask}
                    style={({ pressed }) => [
                      styles.dangerButton,
                      pressed && styles.buttonPressed,
                      deleting && styles.buttonDisabled,
                    ]}
                  >
                    <Text style={styles.dangerButtonText}>
                      {deleting ? 'Excluindo...' : 'Excluir'}
                    </Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    disabled={deleting}
                    onPress={() => setConfirmingDelete(false)}
                    style={({ pressed }) => [
                      styles.ghostButton,
                      pressed && styles.buttonPressed,
                      deleting && styles.buttonDisabled,
                    ]}
                  >
                    <Text style={styles.ghostButtonText}>Cancelar</Text>
                  </Pressable>
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  panel: {
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    backgroundColor: colors.surface,
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 12,
  },
  title: {
    marginTop: 4,
    color: colors.text,
    fontFamily: fonts.serif,
    fontSize: 24,
    lineHeight: 31,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  metaText: {
    color: colors.muted,
    fontSize: 12,
  },
  separator: {
    color: colors.borderStrong,
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginVertical: 20,
    backgroundColor: colors.border,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 3,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  sectionTitle: {
    marginBottom: 10,
    color: colors.text,
    fontFamily: fonts.serif,
    fontSize: 18,
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    backgroundColor: colors.surface,
  },
  statusButtonActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  statusButtonText: {
    color: colors.text,
    fontSize: 13,
  },
  statusButtonTextActive: {
    color: colors.accent,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  primaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  ghostButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 4,
  },
  ghostButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  dangerButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: 4,
  },
  dangerButtonText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  confirmBox: {
    gap: 6,
    marginTop: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: 4,
    backgroundColor: colors.dangerSoft,
  },
  confirmTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  confirmText: {
    marginBottom: 4,
    color: colors.muted,
    fontSize: 12,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 24,
    backgroundColor: colors.background,
  },
  helper: {
    marginTop: 10,
    color: colors.muted,
    fontSize: 12,
  },
  error: {
    marginTop: 10,
    color: colors.danger,
    fontSize: 13,
    textAlign: 'center',
  },
  retry: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 4,
  },
  retryText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
});
