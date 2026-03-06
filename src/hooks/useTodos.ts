import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Todo, TodosResponse } from '@/types/todo';
import { toast } from 'sonner';

export type TodoFilter = 'all' | 'completed' | 'pending';

interface UseTodosOptions {
    limit?: number;
    skip?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dummyjson.com/todos';

export function useTodos({ limit = 10, skip = 0 }: UseTodosOptions = {}) {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState<TodoFilter>('all');

    const queryKey = ['todos', limit, skip];

    // 1. Query for listing todos
    const fetchTodos = async (): Promise<TodosResponse> => {
        const res = await fetch(`${API_URL}?limit=${limit}&skip=${skip}`);
        if (!res.ok) throw new Error('Failed to fetch todos');
        return res.json();
    };

    const { data, isLoading, isError, error, isFetching } = useQuery<TodosResponse, Error>({
        queryKey,
        queryFn: fetchTodos,
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false, // Keep false to preserve local changes on DummyJSON
    });

    // 2. Add Mutation (POST)
    const addTodoMutation = useMutation({
        mutationFn: async (newTodoText: string) => {
            const res = await fetch(`${API_URL}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    todo: newTodoText,
                    completed: false,
                    userId: 1, // Dummy userId as required by the API
                })
            });
            if (!res.ok) throw new Error('Error al añadir tarea');
            return res.json();
        },
        onSuccess: (newTodo) => {
            queryClient.setQueryData<TodosResponse>(queryKey, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    todos: [{ ...newTodo, id: Date.now() }, ...old.todos], // use local ID to avoid collisions
                    total: old.total + 1,
                };
            });
            toast.success('¡Tarea añadida exitosamente!');
        },
        onError: () => {
            toast.error('No se pudo crear la tarea');
        }
    });

    // 3. Update Mutation (PATCH) - Optimistic update
    const updateTodoMutation = useMutation({
        mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
            // Using ID >= 300 will fail on DummyJSON, but we simulate it locally
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed }),
            });
            // If it's a simulated local item (id > 300 roughly), API might return 404, we catch it but ignore if we want, or just let error trigger rollback
            if (!res.ok && res.status !== 404) throw new Error('Error actualizando tarea');
            return res.ok ? res.json() : { id, completed };
        },
        onMutate: async ({ id, completed }) => {
            await queryClient.cancelQueries({ queryKey });
            const previousData = queryClient.getQueryData<TodosResponse>(queryKey);

            queryClient.setQueryData<TodosResponse>(queryKey, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    todos: old.todos.map((todo) =>
                        todo.id === id ? { ...todo, completed } : todo
                    ),
                };
            });

            return { previousData };
        },
        onError: (err, newTodo, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(queryKey, context.previousData);
            }
            toast.error('Ocurrió un error al actualizar la tarea');
        },
        onSuccess: () => {
            // Optional success toast for completed tasks
            // toast.success('Tarea actualizada');
        }
    });

    // 4. Delete Mutation (DELETE) - Optimistic update
    const deleteTodoMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok && res.status !== 404) throw new Error('Error eliminando tarea');
            return id;
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey });
            const previousData = queryClient.getQueryData<TodosResponse>(queryKey);

            queryClient.setQueryData<TodosResponse>(queryKey, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    todos: old.todos.filter((todo) => todo.id !== id),
                    total: old.total - 1,
                };
            });

            return { previousData };
        },
        onError: (err, id, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(queryKey, context.previousData);
            }
            toast.error('Error al intentar eliminar la tarea');
        },
        onSuccess: () => {
            toast.success('La tarea ha sido eliminada');
        }
    });


    // 5. Local filter on already loaded data
    const filteredTodos = useMemo(() => {
        if (!data?.todos) return [];

        switch (filter) {
            case 'completed':
                return data.todos.filter((todo) => todo.completed);
            case 'pending':
                return data.todos.filter((todo) => !todo.completed);
            case 'all':
            default:
                return data.todos;
        }
    }, [data?.todos, filter]);

    return {
        // Data and Status
        todos: filteredTodos,
        total: data?.total || 0,
        isLoading,
        isFetching,
        isError,
        error,

        // Filtering
        filter,
        setFilter,

        // Mutations
        addTodo: addTodoMutation.mutate,
        isAdding: addTodoMutation.isPending,
        toggleTodo: updateTodoMutation.mutate,
        deleteTodo: deleteTodoMutation.mutate,
    };
}
