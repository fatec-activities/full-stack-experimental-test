import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ChoiceGroup } from '@/components/ChoiceGroup';
import { TaskPriority, TaskStatus } from '@/models/Task';
import { createTask, deleteTask, getTask, updateTask } from '@/services/taskService';
import { colors, fonts, priorityLabels, statusColors, statusLabels } from '@/theme';

type FieldErrors = {
  titulo?: string;
  responsavel?: string;
};

const STATUS_OPTIONS = [
  { value: 'PENDENTE', label: statusLabels.PENDENTE, color: statusColors.PENDENTE },
  { value: 'EM_ANDAMENTO', label: statusLabels.EM_ANDAMENTO, color: statusColors.EM_ANDAMENTO },
  { value: 'CONCLUIDA', label: statusLabels.CONCLUIDA, color: statusColors.CONCLUIDA },
];

const PRIORITY_OPTIONS = [
  { value: 'BAIXA', label: priorityLabels.BAIXA },
  { value: 'MEDIA', label: priorityLabels.MEDIA },
  { value: 'ALTA', label: priorityLabels.ALTA },
];

export default function TaskForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const taskId = id ? Number(id) : null;
  const isEditing = taskId != null;

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [status, setStatus] = useState<TaskStatus>('PENDENTE');
  const [prioridade, setPrioridade] = useState<TaskPriority>('MEDIA');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (taskId == null) {
      return;
    }

    let active = true;

    getTask(taskId)
      .then((task) => {
        if (!active) return;
        setTitulo(task.titulo);
        setDescricao(task.descricao ?? '');
        setResponsavel(task.responsavel);
        setStatus(task.status);
        setPrioridade(task.prioridade);
        setLoadError('');
      })
      .catch(() => {
        if (active) setLoadError('Não foi possível carregar a tarefa.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [taskId, reloadKey]);

  const retry = () => {
    setLoading(true);
    setLoadError('');
    setReloadKey((key) => key + 1);
  };

  const submit = async () => {
    const nextErrors: FieldErrors = {};

    if (!titulo.trim()) {
      nextErrors.titulo = 'O título é obrigatório.';
    }

    if (!responsavel.trim()) {
      nextErrors.responsavel = 'O responsável é obrigatório.';
    }

    setFieldErrors(nextErrors);

    if (nextErrors.titulo || nextErrors.responsavel) {
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      titulo: titulo.trim(),
      descricao: descricao.trim() || null,
      responsavel: responsavel.trim(),
      status,
      prioridade,
    };

    try {
      if (taskId != null) {
        await updateTask(taskId, payload);
        setSaving(false);
        router.back();
      } else {
        const saved = await createTask(payload);
        setSaving(false);
        router.replace({ pathname: '/task/[id]', params: { id: String(saved.id) } });
      }
    } catch {
      setSaving(false);
      setError('Não foi possível salvar a tarefa. Verifique os campos e o backend.');
    }
  };

  const remove = async () => {
    if (taskId == null) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      await deleteTask(taskId);
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

  const cancel = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.helper}>Carregando tarefa...</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{loadError}</Text>
        <Pressable style={styles.ghostButton} onPress={retry}>
          <Text style={styles.ghostButtonText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: isEditing ? 'Editar tarefa' : 'Nova tarefa' }} />

      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.panel}>
            <Text style={styles.eyebrow}>
              {isEditing ? `Editando tarefa #${taskId}` : 'Nova tarefa'}
            </Text>
            <Text style={styles.title}>{isEditing ? 'Editar tarefa' : 'Cadastrar tarefa'}</Text>

            <View style={styles.divider} />

            <View style={styles.field}>
              <Text style={styles.label}>Título *</Text>
              <TextInput
                value={titulo}
                onChangeText={setTitulo}
                style={[styles.input, fieldErrors.titulo ? styles.inputError : null]}
                placeholder="Ex.: Implementar a listagem de tarefas"
                placeholderTextColor={colors.muted}
                editable={!saving}
                returnKeyType="next"
              />
              {fieldErrors.titulo ? (
                <Text style={styles.errorText}>{fieldErrors.titulo}</Text>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Responsável *</Text>
              <TextInput
                value={responsavel}
                onChangeText={setResponsavel}
                style={[styles.input, fieldErrors.responsavel ? styles.inputError : null]}
                placeholder="Ex.: Ana"
                placeholderTextColor={colors.muted}
                editable={!saving}
              />
              {fieldErrors.responsavel ? (
                <Text style={styles.errorText}>{fieldErrors.responsavel}</Text>
              ) : null}
            </View>

            <ChoiceGroup
              label="Status"
              options={STATUS_OPTIONS}
              value={status}
              onChange={(value) => setStatus(value as TaskStatus)}
              disabled={saving}
            />

            <ChoiceGroup
              label="Prioridade"
              options={PRIORITY_OPTIONS}
              value={prioridade}
              onChange={(value) => setPrioridade(value as TaskPriority)}
              disabled={saving}
            />

            <View style={styles.field}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                value={descricao}
                onChangeText={setDescricao}
                style={[styles.input, styles.textArea]}
                placeholder="Detalhes opcionais da tarefa"
                placeholderTextColor={colors.muted}
                editable={!saving}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                disabled={saving}
                onPress={submit}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.buttonPressed,
                  saving && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                disabled={saving}
                onPress={cancel}
                style={({ pressed }) => [
                  styles.ghostButton,
                  pressed && styles.buttonPressed,
                  saving && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.ghostButtonText}>Cancelar</Text>
              </Pressable>
            </View>

            {isEditing ? (
              <>
                <View style={styles.divider} />

                {confirmDelete ? (
                  <View style={styles.confirmBox}>
                    <Text style={styles.confirmTitle}>Excluir esta tarefa?</Text>
                    <Text style={styles.confirmText}>Essa ação não pode ser desfeita.</Text>

                    <View style={styles.actions}>
                      <Pressable
                        accessibilityRole="button"
                        disabled={deleting}
                        onPress={remove}
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
                        onPress={() => setConfirmDelete(false)}
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
                ) : (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setConfirmDelete(true)}
                    style={({ pressed }) => [
                      styles.dangerButton,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text style={styles.dangerButtonText}>Excluir tarefa</Text>
                  </Pressable>
                )}
              </>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  divider: {
    height: 1,
    marginVertical: 20,
    backgroundColor: colors.border,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 4,
    backgroundColor: colors.input,
    color: colors.text,
    fontSize: 15,
  },
  inputError: {
    borderColor: colors.danger,
  },
  textArea: {
    minHeight: 110,
    paddingTop: 10,
  },
  errorText: {
    marginTop: 4,
    color: colors.danger,
    fontSize: 12,
  },
  error: {
    marginBottom: 12,
    color: colors.danger,
    fontSize: 13,
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
    alignSelf: 'flex-start',
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
    color: colors.muted,
    fontSize: 14,
  },
});
