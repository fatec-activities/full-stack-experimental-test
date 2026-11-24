import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { TaskCard } from '@/components/TaskCard';
import { Task } from '@/models/Task';
import { getTasks } from '@/services/taskService';
import { colors, fonts } from '@/theme';

const FILTER_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'PENDENTE', label: 'Pendentes' },
  { value: 'EM_ANDAMENTO', label: 'Em andamento' },
  { value: 'CONCLUIDA', label: 'Concluídas' },
];

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async (currentFilter: string = filter) => {
    try {
      setError('');
      const data = await getTasks(currentFilter || undefined);
      setTasks(data);
    } catch {
      setError('Não foi possível conectar à API. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadTasks();
  };

  const onFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setLoading(true);
    loadTasks(newFilter);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.helper}>Carregando tarefas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <Text style={styles.heading}>Tarefas</Text>

          <View style={styles.headerActions}>
            <Text style={styles.count}>
              {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}
            </Text>

            <Pressable onPress={() => loadTasks()}>
              <Text style={styles.refreshText}>Atualizar</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/task/form')}
              style={({ pressed }) => [styles.newButton, pressed && styles.newButtonPressed]}
            >
              <Text style={styles.newButtonText}>Nova tarefa</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.filterWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterBar}>
            {FILTER_OPTIONS.map((item) => {
              const active = filter === item.value;
              return (
                <Pressable
                  key={item.value}
                  onPress={() => onFilterChange(item.value)}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                >
                  <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retry} onPress={() => loadTasks()}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <TaskCard task={item} />}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            contentContainerStyle={tasks.length === 0 ? styles.emptyContent : undefined}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Nenhuma tarefa encontrada.</Text>
                <Pressable
                  onPress={() => router.push('/task/form')}
                  style={styles.emptyButton}
                >
                  <Text style={styles.emptyButtonText}>Cadastrar tarefa</Text>
                </Pressable>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.accent}
                colors={[colors.accent]}
              />
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  panel: {
    flex: 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    backgroundColor: colors.surface,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  heading: {
    fontFamily: fonts.serif,
    fontSize: 21,
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  count: {
    color: colors.muted,
    fontSize: 12,
  },
  refreshText: {
    color: colors.muted,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  newButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  newButtonPressed: {
    opacity: 0.8,
  },
  newButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  filterWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  filterChipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  filterChipText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: colors.accent,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyBox: {
    alignItems: 'center',
    gap: 12,
    padding: 24,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
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
  errorBox: {
    alignItems: 'center',
    gap: 12,
    padding: 24,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
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
