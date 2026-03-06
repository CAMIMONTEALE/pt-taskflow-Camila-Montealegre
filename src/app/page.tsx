"use client";

import { useState } from 'react';
import { useTodos, TodoFilter } from '@/hooks/useTodos';
import { TodoItem } from '@/components/TodoItem';
import { LoadingWrapper } from '@/components/LoadingWrapper';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListTodo, Plus, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function Home() {
  const [page, setPage] = useState(1);
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const {
    todos,
    total,
    isLoading,
    isError,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    isAdding
  } = useTodos({ limit: ITEMS_PER_PAGE, skip });

  const [newTodo, setNewTodo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim() || isAdding) return;
    addTodo(newTodo.trim());
    setNewTodo('');
  };

  const handleNextPage = () => {
    if (page * ITEMS_PER_PAGE < total) {
      setPage(p => p + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(p => p - 1);
    }
  };

  // State: Error
  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center space-y-4">
          <div className="mx-auto bg-red-50 text-red-500 rounded-full h-16 w-16 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Algo salió mal</h2>
          <p className="text-sm text-slate-500">
            No pudimos cargar tus tareas. Verifica tu conexión e inténtalo de nuevo.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 w-full">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <main className="max-w-2xl mx-auto py-12 px-6">
        {/* Header */}
        <header className="mb-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-primary/10 p-3 rounded-2xl text-primary">
              <ListTodo className="h-8 w-8 text-slate-900" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">TaskFlow</h1>
          </div>
          <p className="text-slate-500">Organiza tus tareas con facilidad</p>
        </header>

        {/* Create Input */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
          <Input
            type="text"
            placeholder="¿Qué necesitas hacer hoy?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            disabled={isAdding}
            className="h-12 text-base md:text-sm shadow-sm"
          />
          <Button type="submit" disabled={isAdding} className="h-12 px-6 shadow-sm min-w-[110px]">
            {isAdding ? (
              <Loader2 className="h-5 w-5 mr-1 animate-spin" />
            ) : (
              <Plus className="h-5 w-5 mr-1" />
            )}
            Añadir
          </Button>
        </form>

        {/* Filters and Pagination Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 p-1 bg-slate-200/50 rounded-lg w-fit">
            {(['all', 'pending', 'completed'] as TodoFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === f
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                  }`}
              >
                {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : 'Completadas'}
              </button>
            ))}
          </div>

          {/* Pagination Controls */}
          {!isLoading && total > 0 && filter === 'all' && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>
                Página {page} de {Math.max(1, Math.ceil(total / ITEMS_PER_PAGE))}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handlePrevPage}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleNextPage}
                  disabled={page * ITEMS_PER_PAGE >= total}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          {filter !== 'all' && (
            <span className="text-xs text-slate-400 italic">La paginación no se aplica en los filtros locales</span>
          )}
        </div>

        {/* Tasks List */}
        <div className="space-y-1 min-h-[400px]">
          <LoadingWrapper isLoading={isLoading} count={ITEMS_PER_PAGE}>
            {todos.length === 0 ? (
              <EmptyState
                message={filter === 'all' ? undefined : `No hay tareas ${filter === 'pending' ? 'pendientes' : 'completadas'}`}
                description={filter === 'all' ? undefined : 'Intenta cambiar de filtro o agregar nuevas tareas.'}
              />
            ) : (
              <div className="space-y-3">
                {todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={(id, completed) => toggleTodo({ id, completed })}
                    onDelete={deleteTodo}
                  />
                ))}
              </div>
            )}
          </LoadingWrapper>
        </div>
      </main>
    </div>
  );
}
